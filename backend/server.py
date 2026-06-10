from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict
import uuid
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
import resend
import stripe

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Secret
JWT_SECRET = os.environ.get('JWT_SECRET', 'aurora-therapy-secret-key-2024')
JWT_ALGORITHM = "HS256"

# Stripe
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', '')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET', '')
stripe.api_key = STRIPE_API_KEY

# Default-Admin (Passwort per Env überschreibbar)
ADMIN_DEFAULT_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'Aurora2024!')

# Resend Email
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'info@aurora-therapiezentrum.de')

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Create the main app
app = FastAPI(title="Aurora Therapiezentrum API")

# Health check endpoint (required for Kubernetes deployment)
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/health")
async def api_health_check():
    return {"status": "healthy"}

# Create routers
api_router = APIRouter(prefix="/api")
auth_router = APIRouter(prefix="/api/auth")
booking_router = APIRouter(prefix="/api/bookings")
admin_router = APIRouter(prefix="/api/admin")
payment_router = APIRouter(prefix="/api/payments")

security = HTTPBearer(auto_error=False)

# ============== MODELS ==============

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    company: Optional[str] = None
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    first_name: str
    last_name: str
    company: Optional[str] = None
    phone: Optional[str] = None
    is_approved: bool = False
    is_admin: bool = False
    created_at: str

class BookingCreate(BaseModel):
    date: str  # YYYY-MM-DD
    start_hour: int  # 8-19
    end_hour: int  # 9-20
    include_flipchart: bool = False
    notes: Optional[str] = None

class BookingResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    user_email: str
    user_name: str
    date: str
    start_hour: int
    end_hour: int
    include_flipchart: bool
    hours: int
    base_price: float
    flipchart_price: float
    total_price: float
    status: str  # pending_payment, paid, cancelled
    notes: Optional[str] = None
    created_at: str
    paid_at: Optional[str] = None

class AvailabilityQuery(BaseModel):
    date: str  # YYYY-MM-DD

class TimeSlot(BaseModel):
    hour: int
    available: bool

# Room pricing
HOURLY_RATE = 25.0
FLIPCHART_RATE = 5.0

# Opening hours
OPENING_HOURS = {
    0: (8, 19),   # Monday
    1: (8, 19),   # Tuesday
    2: (8, 19),   # Wednesday
    3: (8, 19),   # Thursday
    4: (8, 16),   # Friday
    5: (9, 16),   # Saturday
    6: None       # Sunday - closed
}

# ============== AUTH HELPERS ==============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user_id: str, is_admin: bool = False) -> str:
    payload = {
        "user_id": user_id,
        "is_admin": is_admin,
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token abgelaufen")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Ungültiger Token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Nicht authentifiziert")
    
    payload = decode_token(credentials.credentials)
    user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Benutzer nicht gefunden")
    return user

async def get_approved_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user = await get_current_user(credentials)
    if not user.get("is_approved"):
        raise HTTPException(status_code=403, detail="Ihr Konto wurde noch nicht freigeschaltet")
    return user

async def get_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user = await get_current_user(credentials)
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin-Berechtigung erforderlich")
    return user

# ============== EMAIL HELPERS ==============

async def send_email(to: str, subject: str, html: str):
    if not RESEND_API_KEY:
        logging.warning(f"Email not sent (no API key): {subject} to {to}")
        return
    
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [to],
            "subject": subject,
            "html": html
        }
        await asyncio.to_thread(resend.Emails.send, params)
        logging.info(f"Email sent: {subject} to {to}")
    except Exception as e:
        logging.error(f"Failed to send email: {e}")

async def notify_admin_new_registration(user: dict):
    html = f"""
    <h2>Neue Registrierung - Aurora Raumvermietung</h2>
    <p>Ein neuer Benutzer hat sich registriert:</p>
    <ul>
        <li><strong>Name:</strong> {user['first_name']} {user['last_name']}</li>
        <li><strong>E-Mail:</strong> {user['email']}</li>
        <li><strong>Firma:</strong> {user.get('company', '-')}</li>
        <li><strong>Telefon:</strong> {user.get('phone', '-')}</li>
    </ul>
    <p>Bitte loggen Sie sich im Admin-Bereich ein, um das Konto freizuschalten.</p>
    """
    await send_email(ADMIN_EMAIL, "Neue Registrierung - Raumvermietung", html)

async def notify_user_approved(user: dict):
    html = f"""
    <h2>Ihr Konto wurde freigeschaltet</h2>
    <p>Hallo {user['first_name']},</p>
    <p>Ihr Konto für die Raumvermietung im Aurora Therapiezentrum wurde freigeschaltet.</p>
    <p>Sie können sich jetzt einloggen und Termine buchen.</p>
    <p>Mit freundlichen Grüßen,<br>Ihr Aurora Therapiezentrum Team</p>
    """
    await send_email(user['email'], "Konto freigeschaltet - Aurora Therapiezentrum", html)

async def notify_booking_confirmed(user: dict, booking: dict):
    html = f"""
    <h2>Buchungsbestätigung</h2>
    <p>Hallo {user['first_name']},</p>
    <p>Ihre Buchung wurde bestätigt:</p>
    <ul>
        <li><strong>Datum:</strong> {booking['date']}</li>
        <li><strong>Zeit:</strong> {booking['start_hour']}:00 - {booking['end_hour']}:00 Uhr</li>
        <li><strong>Dauer:</strong> {booking['hours']} Stunden</li>
        <li><strong>Elektronisches Flipchart:</strong> {'Ja' if booking['include_flipchart'] else 'Nein'}</li>
        <li><strong>Gesamtpreis:</strong> {booking['total_price']:.2f} €</li>
    </ul>
    <p>Mit freundlichen Grüßen,<br>Ihr Aurora Therapiezentrum Team</p>
    """
    await send_email(user['email'], "Buchungsbestätigung - Aurora Therapiezentrum", html)

async def notify_admin_new_booking(user: dict, booking: dict):
    html = f"""
    <h2>Neue Buchung - Gruppentherapieraum</h2>
    <ul>
        <li><strong>Kunde:</strong> {user['first_name']} {user['last_name']}</li>
        <li><strong>E-Mail:</strong> {user['email']}</li>
        <li><strong>Datum:</strong> {booking['date']}</li>
        <li><strong>Zeit:</strong> {booking['start_hour']}:00 - {booking['end_hour']}:00 Uhr</li>
        <li><strong>Flipchart:</strong> {'Ja' if booking['include_flipchart'] else 'Nein'}</li>
        <li><strong>Preis:</strong> {booking['total_price']:.2f} €</li>
    </ul>
    """
    await send_email(ADMIN_EMAIL, "Neue Buchung - Gruppentherapieraum", html)

# ============== AUTH ROUTES ==============

@auth_router.post("/register")
async def register(data: UserCreate):
    # Check if email exists
    existing = await db.users.find_one({"email": data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="E-Mail bereits registriert")
    
    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "email": data.email.lower(),
        "password_hash": hash_password(data.password),
        "first_name": data.first_name,
        "last_name": data.last_name,
        "company": data.company,
        "phone": data.phone,
        "is_approved": False,
        "is_admin": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user)
    
    # Notify admin
    await notify_admin_new_registration(user)
    
    return {
        "message": "Registrierung erfolgreich. Ihr Konto muss noch freigeschaltet werden.",
        "user_id": user_id
    }

@auth_router.post("/login")
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email.lower()}, {"_id": 0})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Ungültige Anmeldedaten")
    
    token = create_token(user["id"], user.get("is_admin", False))
    
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "is_approved": user.get("is_approved", False),
            "is_admin": user.get("is_admin", False)
        }
    }

@auth_router.get("/me")
async def get_me(user: dict = Depends(get_current_user)):
    return {
        "id": user["id"],
        "email": user["email"],
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "company": user.get("company"),
        "phone": user.get("phone"),
        "is_approved": user.get("is_approved", False),
        "is_admin": user.get("is_admin", False)
    }

# ============== BOOKING ROUTES ==============

@booking_router.get("/availability/{date}")
async def get_availability(date: str):
    """Get available time slots for a specific date"""
    try:
        booking_date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Ungültiges Datumsformat. Verwenden Sie YYYY-MM-DD")
    
    weekday = booking_date.weekday()
    hours = OPENING_HOURS.get(weekday)
    
    if hours is None:
        return {"date": date, "closed": True, "slots": []}
    
    open_hour, close_hour = hours
    
    # Get existing bookings for this date
    existing_bookings = await db.bookings.find(
        {"date": date, "status": {"$in": ["pending_payment", "paid"]}},
        {"_id": 0}
    ).to_list(100)
    
    booked_hours = set()
    for booking in existing_bookings:
        for h in range(booking["start_hour"], booking["end_hour"]):
            booked_hours.add(h)
    
    slots = []
    for hour in range(open_hour, close_hour):
        slots.append({
            "hour": hour,
            "available": hour not in booked_hours,
            "label": f"{hour}:00 - {hour+1}:00"
        })
    
    return {
        "date": date,
        "closed": False,
        "open_hour": open_hour,
        "close_hour": close_hour,
        "slots": slots,
        "hourly_rate": HOURLY_RATE,
        "flipchart_rate": FLIPCHART_RATE
    }

@booking_router.post("/create")
async def create_booking(data: BookingCreate, user: dict = Depends(get_approved_user)):
    """Create a new booking (requires approved account)"""
    try:
        booking_date = datetime.strptime(data.date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Ungültiges Datumsformat")
    
    # Check if date is not in the past
    if booking_date.date() < datetime.now().date():
        raise HTTPException(status_code=400, detail="Buchung in der Vergangenheit nicht möglich")
    
    weekday = booking_date.weekday()
    hours = OPENING_HOURS.get(weekday)
    
    if hours is None:
        raise HTTPException(status_code=400, detail="An diesem Tag geschlossen")
    
    open_hour, close_hour = hours
    
    if data.start_hour < open_hour or data.end_hour > close_hour:
        raise HTTPException(status_code=400, detail=f"Buchung nur zwischen {open_hour}:00 und {close_hour}:00 möglich")
    
    if data.start_hour >= data.end_hour:
        raise HTTPException(status_code=400, detail="Endzeit muss nach Startzeit liegen")
    
    # Check availability
    existing = await db.bookings.find_one({
        "date": data.date,
        "status": {"$in": ["pending_payment", "paid"]},
        "$or": [
            {"start_hour": {"$lt": data.end_hour, "$gte": data.start_hour}},
            {"end_hour": {"$gt": data.start_hour, "$lte": data.end_hour}},
            {"$and": [{"start_hour": {"$lte": data.start_hour}}, {"end_hour": {"$gte": data.end_hour}}]}
        ]
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Zeitraum bereits gebucht")
    
    # Calculate price
    num_hours = data.end_hour - data.start_hour
    base_price = num_hours * HOURLY_RATE
    flipchart_price = num_hours * FLIPCHART_RATE if data.include_flipchart else 0
    total_price = base_price + flipchart_price
    
    booking_id = str(uuid.uuid4())
    booking = {
        "id": booking_id,
        "user_id": user["id"],
        "user_email": user["email"],
        "user_name": f"{user['first_name']} {user['last_name']}",
        "date": data.date,
        "start_hour": data.start_hour,
        "end_hour": data.end_hour,
        "include_flipchart": data.include_flipchart,
        "hours": num_hours,
        "base_price": base_price,
        "flipchart_price": flipchart_price,
        "total_price": total_price,
        "status": "pending_payment",
        "notes": data.notes,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "paid_at": None
    }
    
    await db.bookings.insert_one(booking)
    
    # Return booking without MongoDB's _id field
    booking_response = {k: v for k, v in booking.items() if k != '_id'}
    return booking_response

@booking_router.get("/my-bookings")
async def get_my_bookings(user: dict = Depends(get_current_user)):
    """Get all bookings for current user"""
    bookings = await db.bookings.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("date", -1).to_list(100)
    
    return bookings

@booking_router.delete("/{booking_id}")
async def cancel_booking(booking_id: str, user: dict = Depends(get_current_user)):
    """Cancel a booking (only if not yet paid)"""
    booking = await db.bookings.find_one({"id": booking_id, "user_id": user["id"]}, {"_id": 0})
    
    if not booking:
        raise HTTPException(status_code=404, detail="Buchung nicht gefunden")
    
    if booking["status"] == "paid":
        raise HTTPException(status_code=400, detail="Bezahlte Buchungen können nicht storniert werden")
    
    await db.bookings.update_one(
        {"id": booking_id},
        {"$set": {"status": "cancelled"}}
    )
    
    return {"message": "Buchung storniert"}

# ============== PAYMENT ROUTES ==============

@payment_router.post("/create-checkout/{booking_id}")
async def create_checkout_session(booking_id: str, request: Request, user: dict = Depends(get_approved_user)):
    """Create Stripe checkout session for a booking"""
    booking = await db.bookings.find_one({"id": booking_id, "user_id": user["id"]}, {"_id": 0})
    
    if not booking:
        raise HTTPException(status_code=404, detail="Buchung nicht gefunden")
    
    if booking["status"] != "pending_payment":
        raise HTTPException(status_code=400, detail="Buchung kann nicht bezahlt werden")
    
    # Erfolgs-/Abbruch-URLs vom Origin des Aufrufers ableiten
    origin = request.headers.get("origin", str(request.base_url).rstrip('/'))
    success_url = f"{origin}/raumvermietung/booking-success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/raumvermietung?cancelled=true"

    amount_cents = int(round(float(booking["total_price"]) * 100))
    slot_label = f"{booking['date']} {booking['start_hour']}:00-{booking['end_hour']}:00 Uhr"

    try:
        session = await asyncio.to_thread(
            stripe.checkout.Session.create,
            mode="payment",
            line_items=[{
                "price_data": {
                    "currency": "eur",
                    "product_data": {"name": f"Gruppentherapieraum – {slot_label}"},
                    "unit_amount": amount_cents,
                },
                "quantity": 1,
            }],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "booking_id": booking_id,
                "user_id": user["id"],
                "user_email": user["email"],
            },
        )
    except Exception as e:
        logging.error(f"Stripe checkout error: {e}")
        raise HTTPException(status_code=502, detail="Zahlungsanbieter nicht erreichbar")

    # Store payment transaction
    await db.payment_transactions.insert_one({
        "id": str(uuid.uuid4()),
        "session_id": session.id,
        "booking_id": booking_id,
        "user_id": user["id"],
        "user_email": user["email"],
        "amount": booking["total_price"],
        "currency": "eur",
        "status": "initiated",
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    })

    return {"checkout_url": session.url, "session_id": session.id}

@payment_router.get("/status/{session_id}")
async def get_payment_status(session_id: str, user: dict = Depends(get_current_user)):
    """Check payment status and update booking if paid"""
    try:
        session = await asyncio.to_thread(stripe.checkout.Session.retrieve, session_id)
    except Exception as e:
        logging.error(f"Stripe status error: {e}")
        raise HTTPException(status_code=502, detail="Zahlungsstatus nicht abrufbar")

    payment_status = session.get("payment_status")

    # Update transaction status
    transaction = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})

    if transaction and payment_status == "paid":
        # Check if not already processed
        if transaction.get("payment_status") != "paid":
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"status": session.get("status"), "payment_status": payment_status}}
            )

            # Update booking status
            booking_id = transaction.get("booking_id")
            if booking_id:
                await db.bookings.update_one(
                    {"id": booking_id},
                    {"$set": {"status": "paid", "paid_at": datetime.now(timezone.utc).isoformat()}}
                )

                # Get booking and user for notifications
                booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
                user_data = await db.users.find_one({"id": transaction["user_id"]}, {"_id": 0})

                if booking and user_data:
                    await notify_booking_confirmed(user_data, booking)
                    await notify_admin_new_booking(user_data, booking)

    return {
        "status": session.get("status"),
        "payment_status": payment_status,
        "amount_total": session.get("amount_total"),
        "currency": session.get("currency")
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    body = await request.body()
    sig = request.headers.get("Stripe-Signature")

    if not STRIPE_WEBHOOK_SECRET:
        logging.warning("Kein STRIPE_WEBHOOK_SECRET gesetzt - Webhook wird ignoriert")
        return {"status": "ignored"}

    try:
        event = stripe.Webhook.construct_event(body, sig, STRIPE_WEBHOOK_SECRET)
    except Exception as e:
        logging.error(f"Webhook signature error: {e}")
        raise HTTPException(status_code=400, detail="Ungültige Webhook-Signatur")

    if event.get("type") == "checkout.session.completed":
        session = event["data"]["object"]
        if session.get("payment_status") == "paid":
            session_id = session.get("id")
            booking_id = (session.get("metadata") or {}).get("booking_id")

            if booking_id:
                await db.bookings.update_one(
                    {"id": booking_id, "status": "pending_payment"},
                    {"$set": {"status": "paid", "paid_at": datetime.now(timezone.utc).isoformat()}}
                )
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {"$set": {"status": "complete", "payment_status": "paid"}}
                )

    return {"status": "processed"}

# ============== ADMIN ROUTES ==============

@admin_router.get("/users")
async def get_all_users(admin: dict = Depends(get_admin_user)):
    """Get all users (admin only)"""
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    return users

@admin_router.get("/pending-users")
async def get_pending_users(admin: dict = Depends(get_admin_user)):
    """Get users pending approval"""
    users = await db.users.find(
        {"is_approved": False},
        {"_id": 0, "password_hash": 0}
    ).to_list(100)
    return users

@admin_router.post("/approve-user/{user_id}")
async def approve_user(user_id: str, admin: dict = Depends(get_admin_user)):
    """Approve a user account"""
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    
    if not user:
        raise HTTPException(status_code=404, detail="Benutzer nicht gefunden")
    
    await db.users.update_one(
        {"id": user_id},
        {"$set": {"is_approved": True}}
    )
    
    # Notify user
    await notify_user_approved(user)
    
    return {"message": "Benutzer freigeschaltet"}

@admin_router.post("/reject-user/{user_id}")
async def reject_user(user_id: str, admin: dict = Depends(get_admin_user)):
    """Delete a user account (reject)"""
    result = await db.users.delete_one({"id": user_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Benutzer nicht gefunden")
    
    return {"message": "Benutzer abgelehnt und gelöscht"}

@admin_router.get("/bookings")
async def get_all_bookings(admin: dict = Depends(get_admin_user)):
    """Get all bookings (admin only)"""
    bookings = await db.bookings.find({}, {"_id": 0}).sort("date", -1).to_list(1000)
    return bookings

@admin_router.get("/stats")
async def get_stats(admin: dict = Depends(get_admin_user)):
    """Get dashboard statistics"""
    total_users = await db.users.count_documents({})
    pending_users = await db.users.count_documents({"is_approved": False})
    total_bookings = await db.bookings.count_documents({"status": "paid"})
    
    # Revenue this month
    now = datetime.now()
    month_start = now.replace(day=1).strftime("%Y-%m-%d")
    month_bookings = await db.bookings.find(
        {"status": "paid", "date": {"$gte": month_start}},
        {"_id": 0, "total_price": 1}
    ).to_list(1000)
    
    month_revenue = sum(b.get("total_price", 0) for b in month_bookings)
    
    return {
        "total_users": total_users,
        "pending_users": pending_users,
        "total_bookings": total_bookings,
        "month_revenue": month_revenue
    }

# ============== BASIC ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "Aurora Therapiezentrum API"}

@api_router.get("/room-info")
async def get_room_info():
    """Get room information and pricing"""
    return {
        "name": "Gruppentherapieraum",
        "hourly_rate": HOURLY_RATE,
        "flipchart_rate": FLIPCHART_RATE,
        "opening_hours": {
            "monday": "8:00 - 19:00",
            "tuesday": "8:00 - 19:00",
            "wednesday": "8:00 - 19:00",
            "thursday": "8:00 - 19:00",
            "friday": "8:00 - 16:00",
            "saturday": "9:00 - 16:00",
            "sunday": "Geschlossen"
        },
        "features": [
            "Große helle Räumlichkeit",
            "Klimatisiert",
            "Bestuhlung flexibel",
            "WLAN inklusive",
            "Elektronisches Flipchart (Aufpreis)"
        ]
    }

# Include all routers
app.include_router(api_router)
app.include_router(auth_router)
app.include_router(booking_router)
app.include_router(admin_router)
app.include_router(payment_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Create default admin user on startup
@app.on_event("startup")
async def create_default_admin():
    admin = await db.users.find_one({"is_admin": True})
    if not admin:
        admin_user = {
            "id": str(uuid.uuid4()),
            "email": "admin@aurora-therapiezentrum.de",
            "password_hash": hash_password(ADMIN_DEFAULT_PASSWORD),
            "first_name": "Admin",
            "last_name": "Aurora",
            "company": "Aurora Therapiezentrum",
            "phone": None,
            "is_approved": True,
            "is_admin": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_user)
        logger.info("Default admin user created: admin@aurora-therapiezentrum.de (Passwort siehe ADMIN_PASSWORD)")

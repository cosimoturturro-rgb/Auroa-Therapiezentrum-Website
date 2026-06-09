# Aurora Therapiezentrum - Experten-Seite Redesign

## Original Problem Statement
Der Benutzer möchte die Internetseite https://www.aurora-therapiezentrum.de/kopie-von-unsere-experten überarbeiten. Anforderungen:
- Nur Bilder und Titel erscheinen zunächst
- Beim Klick auf einen Experten öffnet sich ein Raumbild und die Beschreibung
- Die Karte klappt auf/erweitert sich (nicht Modal)
- **Option A gewählt**: Design soll zum Original Aurora Wix-Design passen
- Kategorien beibehalten (Psychotherapie, Coaching, Physiotherapie/Osteopathie)
- Platzhalter-Bilder für Therapieräume

## Architecture & Tech Stack
- **Frontend**: React 19 mit Tailwind CSS
- **Animations**: Framer Motion für flüssige Aufklapp-Animationen
- **Icons**: Lucide React
- **Images**: Original Aurora Wix-Bilder für Experten
- **Colors**: Aurora Brand Colors (#0e4a6a Primary, #14b8a6 Secondary)

## User Personas
1. **Patienten/Klienten**: Menschen die Therapie, Coaching oder Physiotherapie in Augsburg suchen
2. **Neue Besucher**: Personen die das Zentrum und seine Experten kennenlernen möchten

## Core Requirements (Static)
- [x] Hero-Sektion mit Titel
- [x] Interaktive Experten-Karten (aufklappbar)
- [x] Kategorisierung nach Fachbereich
- [x] Raumbild bei Aufklappen
- [x] Kontaktmöglichkeiten (E-Mail, Telefon, Website)
- [x] Responsive Design (Desktop + Mobile)
- [x] Kontakt-Sektion

## What's Been Implemented
### 2026-01-23 - Experten-Seite
- ✅ Experten-Seite im Original Aurora Wix-Design
- ✅ Hero-Sektion mit Original Aurora Header-Bild
- ✅ **11 Experten-Karten** mit aufklappbarer Funktion (Klick auf blauen Button = Raumbild + Beschreibung):
  **Psychotherapie (9 Experten)** - alphabetisch nach Nachnamen sortiert:
  - Markus Bauer - Kinder- und Jugendlichenpsychotherapeut
  - Sarah Bauer - Kinder- und Jugendlichenpsychotherapeutin
  - Alisha Berchtold - Systemische Einzel-, Paar- und Familientherapie
  - Elena Berkus - Kinder- und Jugendlichenpsychotherapeutin
  - Veronika Hartl - Psychologin, Psychotherapeutin in Ausbildung
  - Daniel Karg - Kinder- und Jugendlichenpsychotherapeut
  - Karin Kraus - Praxis für Traumatherapie
  - Juan Jose Lopez Lamas - Systemische Einzel-, Paar- und Familientherapie
  - Ulrich Passow - Systemische Therapie und Hypnotherapie (zentriert als letzter)
  **Coaching (2 Experten)**:
  - Elisabeth Berchtold - Business Coaching, Logotherapie & Existenzanalyse
  - Carina Roy - Business Coach
  **Physiotherapie und Osteopathie (1 Experte)**:
  - Michaela Stabenow - Heilpraktikerin Physiotherapie und Osteopathie
- ✅ Sanfte Framer Motion Aufklapp-Animationen
- ✅ Kontakt-Links (E-Mail, Website, Telefon) im aufgeklappten Zustand
- ✅ Kategorien-Überschriften (Psychotherapie, Coaching, Physiotherapie und Osteopathie)
- ✅ Kontakt-Sektion am Ende
- ✅ Design passt zum restlichen Aurora Wix-Website
- ✅ **Einzelne Experten in ungeraden Reihen werden zentriert** (z.B. Ulrich Passow)

### 2026-01-23 - Raumvermietungs-System (NEU)
- ✅ Neue Seite /raumvermietung für Gruppentherapieraum-Vermietung
- ✅ Neuer Navigations-Reiter "Raumvermietung"
- ✅ Benutzerregistrierung mit Admin-Freigabe-System
- ✅ JWT-basierte Authentifizierung
- ✅ Online-Buchungskalender mit Zeitslot-Auswahl
- ✅ Preisgestaltung: 25€/Stunde + 5€/Stunde für elektr. Flipchart
- ✅ Öffnungszeiten: Mo-Do 8-19, Fr 8-16, Sa 9-16, So geschlossen
- ✅ Stripe-Zahlung integriert
- ✅ Admin-Dashboard (/admin) für:
  - Benutzerfreigaben
  - Buchungsübersicht
  - Umsatzstatistiken
- ✅ E-Mail-Benachrichtigungen (vorbereitet, benötigt Resend API-Key)
- ✅ Admin-Zugangsdaten: admin@aurora-therapiezentrum.de / Aurora2024!

## Prioritized Backlog
### P0 (Critical) - Done
- [x] Grundlegende Seitenstruktur
- [x] Experten-Karten mit Klick-Funktion

### P1 (High Priority)
- [ ] Echte Experten-Bilder von Aurora einbinden
- [ ] Echte Raum-Fotos hochladen
- [ ] SEO Meta-Tags optimieren

### P2 (Medium Priority)
- [ ] Weitere Experten hinzufügen (falls gewünscht)
- [ ] Filterung/Suche nach Experten
- [ ] Kontaktformular direkt auf der Seite

### P3 (Low Priority)
- [ ] Terminbuchungs-Integration
- [ ] Bewertungen/Testimonials
- [ ] Mehrsprachigkeit

## Next Tasks
1. ~~Echte Bilder der Therapeuten einbinden~~ ✅ Erledigt
2. ~~Echte Fotos der Praxisräume hochladen~~ ✅ Größtenteils erledigt
3. ✅ Alphabetische Sortierung nach Nachnamen
4. ✅ Einzelne Experten zentrieren (wenn letzte Reihe ungerade)
5. 🟡 Raumbild für Karin Kraus noch ausstehend
6. 🟡 "Save to Github" für Selbst-Hosting vorbereiten

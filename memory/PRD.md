# Aurora Therapiezentrum - Experten-Seite Redesign

## Original Problem Statement
Der Benutzer möchte die Internetseite https://www.aurora-therapiezentrum.de/kopie-von-unsere-experten überarbeiten. Anforderungen:
- Nur Bilder und Titel erscheinen zunächst
- Beim Klick auf einen Experten öffnet sich ein Raumbild und die Beschreibung
- Die Karte klappt auf/erweitert sich (nicht Modal)
- Hell & freundlich mit bestehender Aurora-Farbwelt (dunkelblau/türkis)
- Kategorien beibehalten (Psychotherapie, Coaching, Physiotherapie/Osteopathie)
- Platzhalter-Bilder für Therapieräume

## Architecture & Tech Stack
- **Frontend**: React 19 mit Tailwind CSS
- **Animations**: Framer Motion für flüssige Aufklapp-Animationen
- **Icons**: Lucide React
- **Fonts**: Libre Baskerville (Überschriften), Inter (Text)
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
### 2026-01-23
- ✅ Komplettes Redesign der Experten-Seite
- ✅ Header mit Navigation (Startseite, Experten, Angebot, Kontakt)
- ✅ Hero-Sektion mit Aurora-Branding
- ✅ 4 Experten-Karten mit aufklappbarer Funktion:
  - Daniel Karg (Psychotherapie)
  - Ulrich Passow (Psychotherapie)
  - Carina Roy (Coaching)
  - Michaela Stabenow (Physiotherapie/Osteopathie)
- ✅ Sanfte Framer Motion Animationen
- ✅ Responsive Mobile-Ansicht mit Hamburger-Menü
- ✅ Footer mit Links zur Hauptseite
- ✅ Kontakt-Sektion

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
1. Echte Bilder der Therapeuten einbinden
2. Echte Fotos der Praxisräume hochladen
3. Weitere Experten hinzufügen (falls vorhanden)

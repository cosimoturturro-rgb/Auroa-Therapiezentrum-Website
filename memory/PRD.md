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
### 2026-01-23
- ✅ Experten-Seite im Original Aurora Wix-Design
- ✅ Hero-Sektion mit Original Aurora Header-Bild
- ✅ 4 Experten-Karten mit aufklappbarer Funktion (Klick = Raumbild + Beschreibung):
  - Daniel Karg (Psychotherapie) - Original Wix-Bild
  - Ulrich Passow (Psychotherapie) - Original Wix-Bild
  - Carina Roy (Coaching) - Original Wix-Bild
  - Michaela Stabenow (Physiotherapie/Osteopathie) - Original Wix-Bild
- ✅ Sanfte Framer Motion Aufklapp-Animationen
- ✅ Kontakt-Links (E-Mail, Website, Telefon) im aufgeklappten Zustand
- ✅ Kategorien-Überschriften (Psychotherapie, Coaching, Physiotherapie und Osteopathie)
- ✅ Kontakt-Sektion am Ende
- ✅ Design passt zum restlichen Aurora Wix-Website

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

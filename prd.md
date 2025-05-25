# Product Requirements Document: SwapBox

## Produktübersicht

Eine App-basierte Tauschplattform für Kleidung, Haushaltskram, Bücher oder Technik – alles, was noch gut ist, aber nicht mehr gebraucht wird.

## Zielgruppe

Die Plattform richtet sich an alle Hochschulangehörigen (Studierende, Dozierende und Mitarbeitende), die nachhaltig handeln möchten, indem sie nicht mehr benötigte Gegenstände tauschen oder weitergeben.

## Technologie-Stack

- **Frontend**: Sveltekit
- **UI + Styling**: Tailwind CSS + DaisyUI
- **Sequentielle Datenspeicherung**: SupabaseDB
- **Bilder Storage**: SupabaseStorage
- **Authentifizierung**: SupabaseAuth
- **Build-Tool**: Vite
- **Containerisierung**: Docker

## Grundfunktionen

### Authentifizierung und Benutzerverwaltung
- Registrierung ausschließlich mit Hochschul-E-Mail-Adresse
- Automatischer Verifikationsprozess über E-Mail-Bestätigungslink
- Personalisierte Profilseiten mit Bewertungssystem

### Artikelverwaltung
- Erstellung von Angeboten mit detaillierten Beschreibungen und mehreren Fotos
- Kategorisierung nach Art (Kleidung, Bücher, Elektronik, etc.)
- Status-Tracking (verfügbar, reserviert, getauscht)
- Angebotsart (Tauschen, Verschenken, Verleihen, Event)
- Möglichkeit zur angebe des Standorts anhand des Stadtgebiets (Neustadt, Altstadt, Görden, ...) oder Berlin

### Suchfunktionen
- Erweiterte Filtermöglichkeiten (Kategorie, Campus-Standort)
- Volltextsuche mit Schlagworten
- Persönliche Merkliste für interessante Angebote
- Benachrichtigungen für neue Angebote nach individuellen Suchkriterien

### Eventmanagement
- Anzeige hochschulinterner Veranstaltungen und Tauschbörsen
- Eigene Events erstellen (z.B. Bücherflohmärkte, Kleidertauschparties)
- Events Funktionieren wie Anzeigen (angebortsart = Event)

### Kommunikationssystem
- Internes Nachrichtensystem zwischen Nutzern
- Automatische Benachrichtigungen bei neuen Nachrichten
- Bewertungssystem für abgeschlossene Tauschaktionen
- Meldungsfunktion für unangemessene Inhalte

## Benutzeroberflächen

### Startseite / Dashboard
- Übersichtliche Navigation mit Hauptkategorien
- Suche als Searchbar
- Anzeige zuletzt hocgeladener Angebote
- Anzeige nächster Events

### Artikelübersicht
- Listenansicht mit Vorschaubild
- Titel der Anzeige
- Standort der Anzeige
- Direktzugriff auf Filterfunktionen

### Favoritenseite
- Anzeigen Favorisierter Anzeigen
- Hervorhebung gelöschter Anzeigen
- Möglichkeit zur direkten entfernung der Favoriten

### Detailansicht eines Artikels
- Bildergalerie
- Ausführliche Beschreibung und Produktdetails (Ort, itel, Datum, Likes, Anbieter mit Zuverlässigkeit)
- Kontaktbutton für Interessensbekundung
- Artikel Favorisieren

### Profilseite
- Übersicht über eigene Angebote und Aktivitäten
- Verwaltung persönlicher Daten
- Einsicht in Bewertungshistorie

### Chat-Übersicht
- Übersicht aller Konversationen
- Chat-ähnliche Benutzeroberfläche
- Ungelesene Nachrichten werden hervorgehoben
- Möglichkeit zum Teilen von Bildern und Standortinformationen

### Chat Detailansicht
- Nachrichtenverlauf
- Nachricht senden
- Ganz oben zu welcher Anzeige der Chat gehört mit Link auf diese Anzeige

## Nicht-funktionale Anforderungen

### Benutzerfreundlichkeit
- Responsive Design für alle Bildschirmgrößen
- Intuitive Bedienung ohne lange Einarbeitungszeit
- Barrierefreiheit nach WCAG-Standards
- Konsistente Designsprache auf allen Seiten

### PWA-Funktionalität
- Installation auf dem Startbildschirm möglich
- Offline-Zugriff auf gespeicherte Inhalte
- Push-Benachrichtigungen für wichtige Ereignisse
- Geringe Datennutzung durch optimierte Assets

## Implementierungsplan

### Phase 1: MVP (Minimum Viable Product)
- Basis-Authentifizierung mit Hochschul-E-Mail
- Einfache Artikel-Erstellung und -Suche
- Grundlegende Nachrichtenfunktion
- Responsive Weboberfläche

### Phase 2: Erweiterung
- Vollständiges Bewertungssystem
- Eventkalender und -verwaltung
- Erweiterte Suchfunktionen und Filter
- Verbessertes Nachrichtensystem mit Medienunterstützung

### Phase 3: PWA und Optimierung
- Implementation der PWA-Funktionalität
- Offline-Modus und Synchronisation
- Push-Benachrichtigungen
- Performance-Optimierung

### Phase 4: Zusatzfunktionen
- Statistiken und Analysen zur Plattformnutzung
- Gamification-Elemente (Nachhaltigkeits-Punkte)
- Integration mit anderen Hochschulsystemen
- Community-Funktionen (Foren, Gruppen)

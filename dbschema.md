# SwapBox - Relationales Datenmodell

## Tabelle: users

| Feldname | Datentyp | Schlüssel | Beschreibung |
|----------|----------|-----------|--------------|
| id | SERIAL / UUID | PK | Eindeutige ID |
| name | VARCHAR | | Benutzername |
| email | VARCHAR (unique) | | Nur Hochschul-Email |
| password_hash | TEXT | | Passwort-Hash |
| verified | BOOLEAN | | E-Mail bestätigt |
| profile_picture | TEXT | | Bild-URL |
| location | VARCHAR | | Stadtgebiet |
| rating | FLOAT | | Durchschnittsbewertung |
| role | VARCHAR | | z. B. student, staff |
| created_at | TIMESTAMP | | Registrierungsdatum |

## Tabelle: offers

| Feldname | Datentyp | Schlüssel | Beschreibung |
|----------|----------|-----------|--------------|
| id | SERIAL / UUID | PK | Eindeutige ID |
| user_id | UUID | FK -> users(id) | Anbieter |
| title | VARCHAR | | Titel |
| description | TEXT | | Beschreibung |
| category | VARCHAR | | Kleidung, Bücher, etc. |
| status | VARCHAR | | verfügbar / reserviert / getauscht |
| type | VARCHAR | | tauschen / verschenken / verleihen / event |
| location | VARCHAR | | z. B. Altstadt |
| created_at | TIMESTAMP | | Datum erstellt |
| updated_at | TIMESTAMP | | Letzte Änderung |

## Tabelle: offer_images

| Feldname | Datentyp | Schlüssel | Beschreibung |
|----------|----------|-----------|--------------|
| id | SERIAL | PK | Bild-ID |
| offer_id | UUID | FK -> offers(id) | Zugehöriges Angebot |
| image_url | TEXT | | Bildpfad |
| uploaded_at | TIMESTAMP | | Upload-Datum |

## Tabelle: favorites

| Feldname | Datentyp | Schlüssel | Beschreibung |
|----------|----------|-----------|--------------|
| id | SERIAL | PK | Favoriten-ID |
| user_id | UUID | FK -> users(id) | Nutzer |
| offer_id | UUID | FK -> offers(id) | Merklisteintrag |
| created_at | TIMESTAMP | | Hinzugefügt am |

## Tabelle: events

| Feldname | Datentyp | Schlüssel | Beschreibung |
|----------|----------|-----------|--------------|
| id | SERIAL | PK | Event-ID |
| offer_id | UUID | FK -> offers(id), unique | 1:1 mit Offer |
| event_date | TIMESTAMP | | Datum des Events |
| event_location | VARCHAR | | Veranstaltungsort |
| description | TEXT | | Detailinfos |

## Tabelle: chats

| Feldname | Datentyp | Schlüssel | Beschreibung |
|----------|----------|-----------|--------------|
| id | SERIAL | PK | Chat-ID |
| offer_id | UUID | FK -> offers(id) | Zugehöriges Angebot |
| user1_id | UUID | FK -> users(id) | Teilnehmer 1 |
| user2_id | UUID | FK -> users(id) | Teilnehmer 2 |
| created_at | TIMESTAMP | | Erstellt am |

## Tabelle: messages

| Feldname | Datentyp | Schlüssel | Beschreibung |
|----------|----------|-----------|--------------|
| id | SERIAL | PK | Nachrichten-ID |
| chat_id | UUID | FK -> chats(id) | Zu welchem Chat |
| sender_id | UUID | FK -> users(id) | Absender |
| content | TEXT | | Nachrichtentext |
| image_url | TEXT | | Optionales Bild |
| sent_at | TIMESTAMP | | Versandzeitpunkt |
| read | BOOLEAN | | Gelesen-Status |

## Tabelle: ratings

| Feldname | Datentyp | Schlüssel | Beschreibung |
|----------|----------|-----------|--------------|
| id | SERIAL | PK | Bewertungs-ID |
| offer_id | UUID | FK -> offers(id) | Zugehöriges Angebot |
| from_user_id | UUID | FK -> users(id) | Wer bewertet |
| to_user_id | UUID | FK -> users(id) | Wer wird bewertet |
| rating_value | INTEGER | | Wert (1-5) |
| comment | TEXT | | Optionaler Kommentar |
| created_at | TIMESTAMP | | Datum der Bewertung |

## Tabelle: reports

| Feldname | Datentyp | Schlüssel | Beschreibung |
|----------|----------|-----------|--------------|
| id | SERIAL | PK | Meldungs-ID |
| reporter_id | UUID | FK -> users(id) | Melder |
| offer_id | UUID | FK -> offers(id), optional | Angebot |
| message_id | UUID | FK -> messages(id), optional | Nachricht |
| reason | TEXT | | Begründung |
| created_at | TIMESTAMP | | Datum der Meldung |
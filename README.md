# Aplikacja webowa dla wypożyczalni samochodów z systemem self-service

Projekt inżynierski przedstawiający **demo aplikacji webowej** do obsługi wypożyczalni samochodów w modelu **self-service**.  
System umożliwia klientom samodzielną rejestrację, logowanie, przegląd floty oraz tworzenie rezerwacji, a administratorowi – zarządzanie flotą i rezerwacjami.

> Uwaga: jest to **wersja demonstracyjna** przygotowana na potrzeby pracy dyplomowej.

---

## 1. Stos technologiczny

**Backend**

- Node.js + Express
- MongoDB (MongoDB Atlas) + Mongoose
- JWT (JSON Web Token) – uwierzytelnianie
- express-validator – walidacja danych wejściowych
- dotenv – konfiguracja środowiskowa

**Frontend**

- React (Vite)
- React Router
- Axios
- Tailwind CSS

---

## 2. Funkcjonalności

### 2.1. Klient (użytkownik końcowy)

- Rejestracja nowego użytkownika
- Logowanie z użyciem e-maila i hasła
- Przegląd listy dostępnych samochodów
- Tworzenie rezerwacji wybranego samochodu w określonym przedziale dat
- Podgląd swoich rezerwacji
- Anulowanie własnych rezerwacji w statusie `pending`

### 2.2. Administrator

- Logowanie do panelu administracyjnego
- Przegląd wszystkich pojazdów (flota)
- Dodawanie nowych samochodów (marka, model, rok, segment, numer rejestracyjny, stawka dzienna, dostępność)
- Usuwanie samochodów
- Przegląd wszystkich rezerwacji
- Zmiana statusu rezerwacji (`pending`, `confirmed`, `cancelled`, `completed`)

### 2.3. Gość (niezalogowany)

- Przegląd listy samochodów
- Przejście do ekranu logowania / rejestracji

---

## 3. Struktura repozytorium

```text
.
├── backend/                     # Aplikacja serwerowa (Node.js/Express)
│   ├── src/
│   │   ├── app.js              # Konfiguracja Express
│   │   ├── server.js           # Uruchomienie serwera
│   │   ├── config/
│   │   │   └── db.js           # Połączenie z MongoDB
│   │   ├── models/             # Modele Mongoose (User, Car, Reservation)
│   │   ├── routes/             # Trasy API (auth, cars, reservations, admin)
│   │   └── middleware/         # Middleware (auth, rola admina)
│   └── .env.example            # Przykład konfiguracji środowiska
│
├── frontend/                    # Aplikacja kliencka (React + Vite)
│   ├── src/
│   │   ├── api/                # axiosClient + konfiguracja baseURL
│   │   ├── components/         # Navbar, Container, AdminRoute itp.
│   │   ├── context/            # AuthContext (user + token JWT)
│   │   ├── pages/              # Widoki: Login, Register, Cars, MyReservations, Admin...
│   │   ├── App.jsx             # Główne routowanie
│   │   └── main.jsx            # Wejście aplikacji
│   ├── index.html
│   └── tailwind.config.js      # Konfiguracja Tailwind CSS
│
├── Praca dyplomowa inżynierska.docx  # Tekst pracy (wersja robocza)
└── README.md                   # Dokument, który właśnie czytasz
```

---

## 4. Wymagania

- Node.js (zalecane: LTS, np. 18.x lub 20.x)
- npm
- Konto w MongoDB Atlas lub własny serwer MongoDB

---

## 5. Konfiguracja środowiska

## 5.1. Backend (backend/.env)

Utwórz plik .env w katalogu backend na podstawie .env.example (jeśli istnieje) lub poniższego przykładu:

```text
PORT=5000

# URI do klastra MongoDB (np. MongoDB Atlas)
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/car_rental_selfservice?retryWrites=true&w=majority&appName=Cluster0

# Sekret JWT do podpisywania tokenów
JWT_SECRET=jakis_tajny_ciag_znakow
```

---

## 6. Uruchomienie projektu (tryb deweloperski)

## 6.1. Backend

```text
cd backend
npm install
npm run dev
```

Serwer powinien wystartować domyślnie na porcie http://localhost:5000.

Dla sprawdzenia można wywołać endpoint:
```text
GET http://localhost:5000/api/health
```

## 6.2. Frontend

W osobnym terminalu:

```text
cd frontend
npm install
npm run dev
```

Aplikacja frontendowa będzie domyślnie dostępna pod adresem (np.):
```text
http://localhost:5173/
```

---

## 7. Konta testowe (przykład)

W wersji demonstracyjnej zakłada się:

- administrator – tworzony ręcznie w bazie danych:
    - rejestracja konta przez formularz,
    - ręczna zmiana pola role na "admin" w kolekcji users (MongoDB).
- zwykły użytkownik – tworzony przez formularz rejestracji w aplikacji.

Przykładowe dane (do uzupełnienia według stanu faktycznego):

```text
Admin:
  email: admin@example.com
  hasło: admin123
  rola: admin (ustawiana ręcznie w bazie)

Klient:
  email: jan.kowalski@example.com
  hasło: tajnehaslo
  rola: user
```

---

## 8. Ograniczenia wersji demo

Aplikacja została celowo uproszczona na potrzeby pracy dyplomowej.
Najważniejsze ograniczenia:

- brak realnych płatności on-line,
- brak zaawansowanej walidacji konfliktów rezerwacji (np. nakładających się terminów dla tego samego pojazdu),
- brak zaawansowanego zarządzania użytkownikami (reset hasła, zmiana danych itp.),
- brak integracji z fizycznym systemem wydawania kluczy/pojazdów – kod odbioru jest jedynie symulacją elementu self-service.

---

## 9. Autor

- Imię i nazwisko: Arkadiusz Mokicki
- Kierunek: Informatyka - Inżynier aplikacji i systemów chmurowych
- Uczelnia: Uniwersytet Dolnośląski DSW

Projekt stanowi część pracy dyplomowej inżynierskiej pt.
„Aplikacja webowa dla wypożyczalni samochodów z systemem self-service”.
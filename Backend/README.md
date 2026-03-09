# MicroPay Backend

Ye backend **do jagah** use hota hai:
- **Website** (React / Vite) – browser
- **Flutter app** – mobile (native)

Production URL: `https://micropay-backend-production.up.railway.app`

---

## Railway / Production env

| Variable      | Use |
|---------------|-----|
| `CLIENT_URL`  | Sirf **website** ka URL (CORS). Comma-separated agar multiple sites. Flutter app **mat** add karo. |
| `DATABASE_URL`| Postgres connection string |
| `JWT_SECRET`  | Strong secret production ke liye |

**Example:** Website `https://micropay.vercel.app` pe hai to:
```env
CLIENT_URL=https://micropay.vercel.app
```

---

## Website vs Flutter

- **Website:** Browser CORS use karta hai, isliye `CLIENT_URL` mein website URL hona chahiye.
- **Flutter:** Native app hai, CORS nahi lagta. App mein direct same backend URL use karo: `https://micropay-backend-production.up.railway.app`.

## Local run

```bash
cp .env.example .env   # values bharo
node index.js
```

Server `http://localhost:8000` pe chalega.

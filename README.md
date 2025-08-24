# PDF Merge — Free Online Tool

A minimal iLovePDF-style PDF merger you can deploy **today**.

## ✨ Features
- Upload multiple PDFs, **reorder**, and merge.
- Fast in-memory processing using **pdf-lib**.
- No files stored on disk.
- Clean, responsive UI.

## 🧱 Tech Stack
- **Node.js + Express** (server)
- **multer** (file uploads, memory storage)
- **pdf-lib** (merge PDFs)
- Static frontend (HTML/CSS/JS)

## ▶️ Run Locally
```bash
# 1) Install deps
npm install

# 2) Start
npm start

# 3) Open in browser
http://localhost:3000
```

## ☁️ Deploy (Render — free)
1. Create a repo on GitHub and push this project.
2. Go to **render.com** → New → **Web Service** → Connect repo.
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Region: closest to your users. Click **Create Web Service**.

That’s it. Render will give you a live URL like: `https://your-app.onrender.com`

## (Optional) Deploy on your own VPS
Use Node 18+, `npm install && npm start`, and put a reverse proxy (Nginx) in front.

## ⚙️ Change Limits
Open `server.js` and adjust `multer` limits:
```js
limits: { fileSize: 20 * 1024 * 1024, files: 20 }
```

## 🔒 Privacy Note
Files are processed in memory and discarded after merge; nothing is saved.

---

© 2025 YourBrand

# 🎓 Campus Lost & Found Portal — How to Run

## ✅ STEP 1 — Open This Folder in VS Code
Right-click the `CampusLostFound` folder → "Open with Code"

---

## ✅ STEP 2 — Start the Backend Server (IMPORTANT!)
Open **Terminal** in VS Code (top menu → Terminal → New Terminal)

Type this command:
```
java -jar backend\target\campus-lost-found-1.0.0.jar
```

Wait until you see this message:
```
CAMPUS LOST & FOUND PORTAL IS RUNNING SUCCESSFULLY!
```

🔴 **DO NOT close this terminal!** Keep it open while using the site.

---

## ✅ STEP 3 — Open the Website
**Option A (BEST — no Live Server needed):**
Open your browser and go to: **http://localhost:8080**

**Option B (Via Live Server):**
In VS Code, go to `frontend/` folder → Right-click `index.html` → "Open with Live Server"

---

## ✅ STEP 4 — Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Student | rahul@campus.edu | password123 |
| Admin | admin@campus.edu | admin123 |

---

## ❌ Getting ERROR 405 on Sign In?
→ It means the backend is NOT running.
→ Go back to **STEP 2** and start the backend first!

---

## 🛑 To Stop the Server
Press **Ctrl + C** in the terminal window.

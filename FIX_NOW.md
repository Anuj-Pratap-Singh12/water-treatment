# 🚨 DO THIS NOW - Fix Your Error

You're seeing: **"Could not load water data from GPT"**

This takes **2 minutes to fix**. Follow these exact steps:

---

## Step 1: Get Your Free API Key (1 minute)

1. Click this link: https://platform.openai.com/api-keys
2. Sign in or create account (free)
3. Click **"Create new secret key"**
4. Copy the key (looks like: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx`)
5. Keep this tab open

---

## Step 2: Add Key to Your Project (1 minute)

**Choose your method:**

### Method A: PowerShell (Easiest) ⭐
Open PowerShell in your project's `backend/` folder and run:

```powershell
cd backend
.\setup-api-key.ps1
```

Then:
1. Paste your API key
2. Press Enter
3. Done!

### Method B: Manual (Most Control)
1. Open your `backend/` folder
2. Create a new file called `.env`
3. Paste this line into it:
   ```
   OPENAI_API_KEY=sk-proj-paste-your-key-here
   ```
4. Replace `sk-proj-paste-your-key-here` with your actual key from Step 1
5. Save file

### Method C: Command Line
Open PowerShell and run:
```powershell
cd backend
"OPENAI_API_KEY=sk-proj-paste-your-key-here" | Out-File .env
```

Replace with your actual key.

---

## Step 3: Install & Start (1 minute)

In PowerShell, still in `backend/` folder:

```bash
npm install
npm run dev
```

You should see:
```
🚀 Backend Server is running on http://localhost:5001
```

---

## Step 4: Test It (30 seconds)

Open your simulator page in browser and click **"Sync from GPT IoT"** button.

✅ If it works: Congratulations! Water data will auto-fill.

❌ If it still fails: See below.

---

## 🆘 If Step 4 Fails

### Option 1: Run Diagnostics (Automatic)
```bash
cd backend
.\diagnose.ps1
```

This tells you exactly what's wrong!

### Option 2: Manual Checks

Check 1 - Is .env file there?
```bash
# In backend folder
ls .env
```
Should show: `.env`

Check 2 - Does it have your key?
```bash
cat .env
```
Should show: `OPENAI_API_KEY=sk-proj-xxx...`

Check 3 - Is backend running?
```bash
curl http://localhost:5001/
```
Should show: `Backend running 🚀`

Check 4 - Test the endpoint directly
```bash
curl http://localhost:5001/api/iot/water
```
Should return JSON with water data

---

## 🎯 Common Issues & Quick Fixes

| Problem | What to Do |
|---------|-----------|
| ❌ API Key Doesn't Work | Get new one: https://platform.openai.com/api-keys |
| ❌ "Module not found" error | Run: `npm install` |
| ❌ Port 5001 in use | Run: `npm run dev` on different port (5002) |
| ❌ Still can't load data | Run: `.\diagnose.ps1` |

---

## ✨ What Happens Next

Once it works:
1. Click "Sync from GPT IoT" button
2. Form fields auto-fill with realistic water data
3. Click "Simulate & Get AI Recipe"
4. See your AI treatment recommendations

---

## 📖 Full Guides (If You Need Details)

- **SETUP_API_KEY.md** - Detailed API key setup
- **TROUBLESHOOTING.md** - All possible errors & fixes
- **QUICKSTART.md** - Full quick start guide

---

## ✅ Verification Checklist

After following steps above, check:
- [ ] .env file created in backend/ folder
- [ ] OPENAI_API_KEY=sk-proj-xxx is in the file
- [ ] npm install completed
- [ ] npm run dev is running
- [ ] curl http://localhost:5001/ returns "Backend running 🚀"
- [ ] Click "Sync from GPT IoT" fills form with water data
- [ ] No errors in browser console
- [ ] No errors in backend terminal

---

## 🚀 You've Got This!

This is a 2-minute fix:
1. Get free API key (1 min)
2. Add to .env (1 min)
3. Start backend
4. Click button

That's it! 

**Questions? Run `.\diagnose.ps1` or check TROUBLESHOOTING.md**

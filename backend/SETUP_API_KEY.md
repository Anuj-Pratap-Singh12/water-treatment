# 🚀 Quick Setup - Get Your OpenAI API Key

## Step 1: Get Your OpenAI API Key (2 minutes)

### Option A: Use Claude API (Recommended)
1. Go to: https://platform.openai.com/api-keys
2. Sign in or create account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-`)
5. Keep it safe!

### Option B: Create New Organization
1. Visit: https://platform.openai.com/account/org-settings/general
2. Create new organization
3. Generate API key from that organization

---

## Step 2: Add Your API Key to .env (1 minute)

### Windows (PowerShell)
Open PowerShell in backend folder:
```powershell
cd backend
# Create/edit .env file with your API key
"OPENAI_API_KEY=sk-proj-your-actual-key-here" | Out-File -FilePath .env -Encoding UTF8
```

### Windows (Command Prompt)
```cmd
cd backend
echo OPENAI_API_KEY=sk-proj-your-actual-key-here > .env
```

### Or Simply Create File Manually
1. In `backend/` folder, create file: `.env`
2. Add this line:
   ```
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```
3. Replace with your actual API key

---

## Step 3: Verify It's Working (1 minute)

### Start Backend
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Backend Server is running on http://localhost:5001
```

### Test the Endpoint
Open another terminal:
```bash
curl http://localhost:5001/api/iot/water
```

You should get water quality data like:
```json
{
  "ph": 7.2,
  "tds": 1200,
  "turbidity": 120,
  ...
}
```

---

## Step 4: Use in Your Simulator (Instant!)

1. Open your treatment simulator page
2. Click **"Sync from GPT IoT"** button
3. Watch water quality data auto-fill!
4. Run treatment simulation

---

## 🆘 If It Still Doesn't Work

### Check 1: Is .env file in right location?
```bash
# In PowerShell/CMD, go to backend folder and list files
cd backend
dir .env  # Windows
# or
ls .env   # PowerShell
```
Should show: `.env` file exists in `backend/` folder

### Check 2: Is API key correct format?
```bash
# Should look like:
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
```
- Should start with `sk-proj-`
- No spaces around `=`
- No quotes

### Check 3: Do you have API credits?
1. Go to: https://platform.openai.com/account/usage/overview
2. Check "Credits" section
3. Make sure balance > $0

### Check 4: Backend logs
Look at terminal where you ran `npm run dev`:
- Any error messages?
- Is server running on 5001?

### Check 5: Try simpler test
```bash
# Test backend is running
curl http://localhost:5001/

# Should return: "Backend running 🚀"
```

---

## 📋 Troubleshooting Checklist

- [ ] .env file created in `backend/` folder
- [ ] OPENAI_API_KEY=sk-proj-xxx format is correct
- [ ] npm install completed successfully
- [ ] Backend running on http://localhost:5001
- [ ] curl http://localhost:5001/ returns "Backend running 🚀"
- [ ] curl http://localhost:5001/api/iot/water returns JSON
- [ ] OpenAI account has API credits remaining

---

## 🔐 Security Reminders

✅ Never commit .env file to Git
✅ Keep your API key secret
✅ Use environment variables (not hardcoded)
✅ Rotate key if compromised
✅ Monitor usage: https://platform.openai.com/account/usage/overview

---

## 💰 Cost Check

Each API call costs ~$0.001 USD (very cheap!)

Monitor your usage:
- Dashboard: https://platform.openai.com/account/usage/overview
- Billing: https://platform.openai.com/account/billing/overview

---

## ✨ You're Ready!

Once .env is set up with your API key:
1. Backend auto-loads it with `require("dotenv").config()`
2. GPT controller uses it for API calls
3. Everything works!

**Questions? Check the full documentation in SETUP_INSTRUCTIONS.md or QUICKSTART.md**

# 🔧 Troubleshooting: "Could not load water data from GPT"

This guide helps fix the error: **"Could not load water data from GPT. Check backend is running and OPENAI_API_KEY is set."**

---

## ⚡ Quick Fix (Try This First!)

### Step 1: Get Your API Key
Visit: https://platform.openai.com/api-keys
- Sign in to your OpenAI account
- Click "Create new secret key"
- Copy the entire key (starts with `sk-proj-`)

### Step 2: Create .env File
In PowerShell (in the `backend/` folder):
```powershell
"OPENAI_API_KEY=sk-proj-paste-your-key-here" | Out-File -FilePath .env -Encoding UTF8
```

Replace `sk-proj-paste-your-key-here` with your actual API key.

### Step 3: Install & Start
```bash
npm install
npm run dev
```

### Step 4: Test
Click "Sync from GPT IoT" in your simulator!

---

## 🔍 Detailed Troubleshooting

### Problem 1: Backend Not Running

**Symptom**: Error says "Failed to fetch" or "Cannot reach server"

**Check**:
```bash
# Is backend running on port 5001?
curl http://localhost:5001/

# Should show: "Backend running 🚀"
```

**Fix**:
```bash
cd backend
npm run dev
```

---

### Problem 2: OPENAI_API_KEY Not Configured

**Symptom**: Error says "OPENAI_API_KEY not configured"

**Check**:
```bash
# Does .env file exist?
ls .env      # PowerShell
dir .env     # CMD
```

**Fix Option 1 - PowerShell Script** (Easiest):
```bash
cd backend
.\setup-api-key.ps1
```

**Fix Option 2 - Manual**:
1. In `backend/` folder, create file: `.env`
2. Add this line:
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. Replace with your actual API key

**Fix Option 3 - Command Line**:
```powershell
cd backend
"OPENAI_API_KEY=sk-proj-your-key-here" | Out-File .env
```

---

### Problem 3: Invalid API Key

**Symptom**: Error changes but still fails, or says "Invalid API Key"

**Check**:
1. Go to: https://platform.openai.com/api-keys
2. Verify your key hasn't expired
3. Verify key starts with `sk-proj-`

**Fix**:
- Delete old key (it may be revoked)
- Create new secret key
- Update `.env` file with new key

---

### Problem 4: No API Credits

**Symptom**: API call fails even though key seems valid

**Check**:
1. Go to: https://platform.openai.com/account/billing/overview
2. Look at "Credits"
3. Make sure balance > $0

**Fix**:
- Add payment method
- Purchase credits
- Or upgrade to paid account

---

### Problem 5: Dependencies Not Installed

**Symptom**: Error about "openai module not found"

**Check**:
```bash
npm list openai
# Should show: openai@4.52.0 (or later)
```

**Fix**:
```bash
npm install
```

---

### Problem 6: Port 5001 Already in Use

**Symptom**: Error: "EADDRINUSE: address already in use :::5001"

**Check**:
```bash
netstat -ano | findstr :5001
```

**Fix Option 1 - Kill Process**:
```bash
# Find the PID (Process ID) from netstat output
taskkill /PID <PID> /F
```

**Fix Option 2 - Use Different Port**:
In `.env`:
```
PORT=5002
```

Then update frontend endpoint in `TreatmentSimulator.jsx`:
```javascript
const WATER_IOT_URL = "http://localhost:5002/api/iot/water";
```

---

### Problem 7: Can't Connect to OpenAI API

**Symptom**: "Failed to fetch" when trying to use the button, timeout errors

**Check**:
1. Internet connection working?
2. Firewall blocking OpenAI?
3. VPN interfering?

**Fix**:
- Restart internet connection
- Check firewall settings
- Try disabling VPN
- Try different network (hotspot?)

---

## 🚀 Automated Diagnostics

Run the diagnostic script:

```bash
cd backend
.\diagnose.ps1
```

This checks:
- ✓ .env file exists
- ✓ OPENAI_API_KEY is configured
- ✓ All dependencies installed
- ✓ Backend files present
- ✓ Port 5001 availability
- ✓ Network connectivity to OpenAI

---

## 📋 Full Troubleshooting Checklist

- [ ] .env file exists in `backend/` folder
- [ ] .env contains `OPENAI_API_KEY=sk-proj-xxx` format
- [ ] API key from https://platform.openai.com/api-keys
- [ ] Key starts with `sk-proj-`
- [ ] `npm install` completed successfully
- [ ] Backend running: `npm run dev`
- [ ] Backend responds: `curl http://localhost:5001/`
- [ ] Can reach OpenAI API (internet working)
- [ ] OpenAI account has API credits
- [ ] Port 5001 not blocked by firewall
- [ ] No typos in .env file
- [ ] Restarted terminal after creating .env

---

## 🧪 Test the Endpoint Directly

### Test 1: Backend is running
```bash
curl http://localhost:5001/
```
Should return: `Backend running 🚀`

### Test 2: API endpoint works
```bash
curl http://localhost:5001/api/iot/water
```
Should return JSON like:
```json
{
  "ph": 7.2,
  "tds": 1200,
  "turbidity": 120,
  "bod": 200,
  "cod": 500,
  "tn": 45,
  "temperature": 30,
  "flow": 1000,
  "totalVolume": 1000000,
  "heavyMetals": false,
  "source": "GPT-Generated",
  "timestamp": "2024-12-09T..."
}
```

### Test 3: Check logs
Look at terminal where you ran `npm run dev`:
- Any error messages?
- Warnings?
- Network errors?

---

## 💡 Common Error Messages

### "OPENAI_API_KEY not configured"
→ Solution: Create `.env` file with API key

### "Failed to fetch"
→ Solution: Backend not running. Run: `npm run dev`

### "Invalid API Key"
→ Solution: API key is wrong or revoked. Get new one from platform.openai.com

### "Could not parse JSON from GPT response"
→ Solution: API call succeeded but response format wrong. Check API key validity

### "EADDRINUSE"
→ Solution: Port 5001 in use. Run: `taskkill /PID <PID> /F`

### "Module not found: openai"
→ Solution: Run `npm install`

---

## 📞 If Still Not Working

1. **Run diagnostics**:
   ```bash
   .\diagnose.ps1
   ```

2. **Check backend logs** - Open terminal where backend is running, look for:
   - Error messages
   - Network errors
   - API key errors

3. **Verify .env format** - Make sure:
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
   ```
   - No spaces
   - No quotes
   - Correct key format

4. **Verify API key is valid** - Visit:
   - https://platform.openai.com/api-keys (should be listed)
   - https://platform.openai.com/account/billing (should have credits)

5. **Check internet** - Can you access:
   - https://platform.openai.com
   - https://api.openai.com

---

## 🎯 Step-by-Step Recovery

### If Everything is Broken:

```bash
# 1. Stop backend (Ctrl+C if running)

# 2. Go to backend folder
cd backend

# 3. Delete node_modules and reinstall
rm -r node_modules    # PowerShell/Bash
# or
rmdir /s node_modules # CMD

# 4. Reinstall
npm install

# 5. Create fresh .env
"OPENAI_API_KEY=sk-proj-your-actual-key" | Out-File .env

# 6. Start backend
npm run dev

# 7. Test
curl http://localhost:5001/api/iot/water
```

---

## ✅ Success Indicators

When everything works, you'll see:

1. **Backend log**:
   ```
   🚀 Backend Server is running on http://localhost:5001
   ```

2. **API response** (from curl):
   ```json
   { "ph": 7.2, "tds": 1200, ... }
   ```

3. **Frontend** - Clicking "Sync from GPT IoT" fills form with water data

---

## 📚 Related Documentation

- **SETUP_API_KEY.md** - How to get and set up API key
- **setup-api-key.ps1** - Automated setup script
- **diagnose.ps1** - Automated diagnostics
- **QUICKSTART.md** - Quick start guide

---

**Still stuck? Message could include backend console output for debugging!** 🔍

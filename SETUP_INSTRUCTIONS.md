# Water Treatment Simulator - GPT Integration Setup

## Overview
The water treatment simulator now uses **OpenAI's API** to generate realistic wastewater quality data instead of hardcoded values. This provides dynamic, realistic sensor readings for your treatment simulation.

## How It Works

### Data Flow
1. **Frontend** (`TreatmentSimulator.jsx`) → Click "Sync from GPT IoT" button
2. **Backend** receives request at `GET /api/iot/water`
3. **GPT Controller** calls OpenAI API with a detailed prompt to generate realistic water quality parameters
4. **Response** returns simulated sensor data (pH, TDS, Turbidity, BOD, COD, etc.)
5. **Frontend** populates the "Influent Quality" fields with GPT-generated data

### Generated Parameters
```json
{
  "ph": 6.5,
  "tds": 1500,
  "turbidity": 150,
  "bod": 300,
  "cod": 700,
  "tn": 60,
  "temperature": 25,
  "flow": 1200,
  "totalVolume": 1200000,
  "heavyMetals": false,
  "source": "GPT-Generated",
  "timestamp": "2024-12-09T12:34:56.789Z"
}
```

## Setup Instructions

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

This will install the `openai` package (^4.52.0) needed for GPT integration.

### 2. Set Up Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your OpenAI API key
# OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### 3. Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it into your `.env` file:
   ```
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```

**Important**: 
- Keep this key secret and never commit it to version control
- The `.env` file is already in `.gitignore`
- You'll need an active OpenAI account with API credits

### 4. Start the Backend Server

```bash
cd backend

# For development with auto-reload
npm run dev

# Or for production
npm start
```

You should see:
```
🚀 Backend Server is running on http://localhost:5001
```

### 5. Test the Endpoint

Open your browser or use curl to test:

```bash
curl http://localhost:5001/api/iot/water
```

Expected response (example):
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
  "timestamp": "2024-12-09T14:30:45.123Z"
}
```

### 6. Use in Frontend

In your treatment simulator page:
1. Click the **"Sync from GPT IoT"** button
2. The influent quality fields will be populated with GPT-generated data
3. Adjust values manually if needed
4. Click **"Simulate & Get AI Recipe"** to run the treatment simulation

## Architecture

### Backend Changes
- **New File**: `backend/controllers/gptWaterController.js`
  - Handles GPT API calls
  - Generates realistic water quality data
  - Validates and returns formatted JSON

- **New File**: `backend/routes/iotRoutes.js`
  - Defines `/api/iot/water` endpoint
  - Routes requests to GPT controller

- **Updated**: `backend/server.js`
  - Imports IoT routes
  - Registers `/api/iot` route group

### Frontend Changes
- **Updated**: `frontend/src/components/TreatmentSimulator.jsx`
  - Changed endpoint URL to `http://localhost:5001/api/iot/water`
  - Updated button text from "Cloudopus 4.1" to "GPT IoT"
  - Improved error messages

## Troubleshooting

### Issue: "OPENAI_API_KEY not configured"
**Solution**: Make sure your `.env` file exists in the backend directory and contains the correct API key.

### Issue: "Failed to generate water data from GPT"
**Solutions**:
- Check if OpenAI API key is valid and active
- Verify you have API credits remaining: https://platform.openai.com/account/billing/overview
- Check backend logs for specific error message
- Ensure OpenAI API is accessible (not blocked by firewall)

### Issue: CORS errors in frontend
**Solution**: CORS is already enabled in server.js, but verify:
```javascript
app.use(cors());  // This should be in server.js
```

### Issue: Port 5001 already in use
**Solution**: Change the PORT in `.env` or kill the process using that port:
```bash
# On Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

## Cost Considerations

OpenAI API calls have a cost. Each GPT-generated water data request uses Claude tokens:
- **Model**: Claude 3.5 Sonnet
- **Typical cost**: ~0.001 USD per request

Monitor your usage at: https://platform.openai.com/account/usage/overview

## Files Modified/Created

### Created Files
- `backend/controllers/gptWaterController.js`
- `backend/routes/iotRoutes.js`
- `backend/.env.example`
- `SETUP_INSTRUCTIONS.md` (this file)

### Modified Files
- `backend/package.json` - Added `openai` dependency
- `backend/server.js` - Added IoT routes
- `frontend/src/components/TreatmentSimulator.jsx` - Updated endpoint and button text

## Next Steps

1. Test the GPT integration by clicking "Sync from GPT IoT"
2. Adjust the GPT prompt in `gptWaterController.js` if you need different data characteristics
3. Consider caching responses if you want to reduce API costs
4. Integrate this with your real treatment recommendations from the ML model

## Support

For questions:
- OpenAI API Docs: https://platform.openai.com/docs/api-reference
- Claude Documentation: https://claude.ai/docs
- Backend logs will show detailed error messages for debugging

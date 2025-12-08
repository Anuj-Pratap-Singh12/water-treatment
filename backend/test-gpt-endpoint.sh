#!/bin/bash
# Test script for GPT Water Data endpoint

# Test the endpoint with curl
echo "Testing GPT Water Data Endpoint..."
echo "=================================="
echo ""
echo "Making request to: http://localhost:5001/api/iot/water"
echo ""

curl -X GET http://localhost:5001/api/iot/water \
  -H "Content-Type: application/json" \
  -s | python -m json.tool

echo ""
echo "=================================="
echo "Response includes:"
echo "- ph: Water pH level (4.0-10.0)"
echo "- tds: Total Dissolved Solids (800-3000 mg/L)"
echo "- turbidity: Cloudiness (10-300 NTU)"
echo "- bod: Biochemical Oxygen Demand (100-600 mg/L)"
echo "- cod: Chemical Oxygen Demand (200-1200 mg/L)"
echo "- tn: Total Nitrogen (20-100 mg/L)"
echo "- temperature: Water temperature (15-35°C)"
echo "- flow: Water flow rate (500-2000 m³/day)"
echo "- totalVolume: Total volume (500K-2M L/day)"
echo "- heavyMetals: Presence of heavy metals (true/false)"
echo "- source: Data source indicator"
echo "- timestamp: When data was generated"

// src/pages/MarketplacePage.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MarketplacePage() {
  // Wallet state
  const [wallet, setWallet] = useState({
    coins: 1000,
    waterCredits: 20, // KL
    waterReusedViaMe: 50, // KL
  });

  // Listings state (sample data)
  const [listings, setListings] = useState([
    {
      id: 1,
      seller: "Industry A",
      quantity: 10,
      quality: "CPCB Compliant ✅",
      pricePerKL: 5,
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: 2,
      seller: "STP B",
      quantity: 20,
      quality: "Reuse Ready",
      pricePerKL: 4,
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: 3,
      seller: "Treatment Plant C",
      quantity: 15,
      quality: "CPCB Compliant ✅",
      pricePerKL: 6,
      timestamp: new Date(Date.now() - 10800000),
    },
  ]);

  // Transaction history state
  const [transactions, setTransactions] = useState([
    { id: 1, date: "Today", action: "Sold", water: 10, coins: 50 },
    { id: 2, date: "Today", action: "Bought", water: -5, coins: -25 },
    { id: 3, date: "Yesterday", action: "Sold", water: 8, coins: 40 },
  ]);

  // Sell water modal state
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellForm, setSellForm] = useState({
    quantity: "",
    pricePerKL: "",
    quality: "CPCB Compliant ✅",
  });

  // Buy water handler
  const handleBuyWater = (listing) => {
    const totalCost = listing.quantity * listing.pricePerKL;

    if (wallet.coins < totalCost) {
      alert("Not enough coins!");
      return;
    }

    // Deduct coins, add water credits
    setWallet({
      ...wallet,
      coins: wallet.coins - totalCost,
      waterCredits: wallet.waterCredits + listing.quantity,
    });

    // Add transaction
    setTransactions([
      {
        id: transactions.length + 1,
        date: "Today",
        action: "Bought",
        water: -listing.quantity,
        coins: -totalCost,
      },
      ...transactions,
    ]);

    // Remove listing
    setListings(listings.filter((l) => l.id !== listing.id));
  };

  // Post water listing
  const handlePostWater = () => {
    if (!sellForm.quantity || !sellForm.pricePerKL) {
      alert("Please fill all fields");
      return;
    }

    const quantity = parseFloat(sellForm.quantity);
    const pricePerKL = parseFloat(sellForm.pricePerKL);
    const totalCoins = quantity * pricePerKL;

    // Add new listing
    const newListing = {
      id: Math.max(...listings.map((l) => l.id), 0) + 1,
      seller: "You (My Listing)",
      quantity: quantity,
      quality: sellForm.quality,
      pricePerKL: pricePerKL,
      timestamp: new Date(),
    };

    setListings([newListing, ...listings]);

    // Add transaction
    setTransactions([
      {
        id: transactions.length + 1,
        date: "Today",
        action: "Sold",
        water: quantity,
        coins: totalCoins,
      },
      ...transactions,
    ]);

    // Update wallet (coins added)
    setWallet({
      ...wallet,
      coins: wallet.coins + totalCoins,
      waterReusedViaMe: wallet.waterReusedViaMe + quantity,
    });

    // Reset form
    setSellForm({ quantity: "", pricePerKL: "", quality: "CPCB Compliant ✅" });
    setShowSellModal(false);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-r from-emerald-50 via-cyan-50 to-sky-50 shadow-md p-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Water Credit Marketplace
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Earn coins by treating water. Spend coins to buy surplus treated water from others.
        </p>
      </div>

      {/* 1. MY WALLET */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-md p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">My Wallet</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Coins */}
          <div className="rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 p-4">
            <div className="text-sm font-semibold text-yellow-700">🪙 My Coins</div>
            <div className="text-3xl font-bold text-yellow-900 mt-2">{wallet.coins}</div>
            <div className="text-xs text-yellow-600 mt-1">Available for spending</div>
          </div>

          {/* Water Credits */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-4">
            <div className="text-sm font-semibold text-blue-700">💧 My Water Credits</div>
            <div className="text-3xl font-bold text-blue-900 mt-2">{wallet.waterCredits} KL</div>
            <div className="text-xs text-blue-600 mt-1">Treated water available</div>
          </div>

          {/* Water Reused Via Me */}
          <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-4">
            <div className="text-sm font-semibold text-emerald-700">♻️ Water Reused via Me</div>
            <div className="text-3xl font-bold text-emerald-900 mt-2">{wallet.waterReusedViaMe} KL</div>
            <div className="text-xs text-emerald-600 mt-1">Your circular water impact</div>
          </div>
        </div>
      </div>

      {/* 2. SELL WATER & 3. BUY WATER - SIDE BY SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SELL WATER */}
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-md p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Sell Water</h3>
          <p className="text-sm text-slate-600 mb-4">
            List your treated water and earn coins instantly.
          </p>
          <button
            onClick={() => setShowSellModal(true)}
            className="w-full px-4 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
          >
            + Create Listing
          </button>
        </div>

        {/* BUY WATER - LISTINGS TABLE */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/70 bg-white shadow-md p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Available Listings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Seller</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Water (KL)</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Quality</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-700">Price/KL</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{listing.seller}</td>
                    <td className="px-4 py-3 text-slate-700">{listing.quantity} KL</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-emerald-700">{listing.quality}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-amber-600">
                      {listing.pricePerKL} 🪙
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleBuyWater(listing)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition"
                      >
                        Buy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. TRANSACTION HISTORY */}
      <div className="rounded-2xl border border-slate-200/70 bg-white shadow-md p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Action</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700">Water (KL)</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700">Coins</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-700">{txn.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        txn.action === "Sold"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {txn.action === "Sold" ? "↗️" : "↙️"} {txn.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">
                    {txn.water > 0 ? "+" : ""}{txn.water} KL
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${txn.coins > 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {txn.coins > 0 ? "+" : ""}{txn.coins} 🪙
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SELL WATER MODAL */}
      <AnimatePresence>
        {showSellModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Sell Water - Create Listing</h2>

              {/* Quantity Input */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ✅ Quantity (KL)
                </label>
                <input
                  type="number"
                  value={sellForm.quantity}
                  onChange={(e) => setSellForm({ ...sellForm, quantity: e.target.value })}
                  placeholder="e.g., 10"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Price Input */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ✅ Price per KL (Coins)
                </label>
                <input
                  type="number"
                  value={sellForm.pricePerKL}
                  onChange={(e) => setSellForm({ ...sellForm, pricePerKL: e.target.value })}
                  placeholder="e.g., 5"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Quality Dropdown */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ✅ Water Quality
                </label>
                <select
                  value={sellForm.quality}
                  onChange={(e) => setSellForm({ ...sellForm, quality: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="CPCB Compliant ✅">CPCB Compliant ✅</option>
                  <option value="Not for drinking ⚠️">Not for drinking ⚠️</option>
                </select>
              </div>

              {/* Calculate total */}
              {sellForm.quantity && sellForm.pricePerKL && (
                <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="text-sm text-slate-700">You will earn:</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">
                    {(parseFloat(sellForm.quantity) * parseFloat(sellForm.pricePerKL)).toFixed(0)} 🪙
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSellModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePostWater}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
                >
                  POST
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React from "react";

export default function MarketplaceCard({ item, onBuy }){
  return (
    <div className="p-4 border rounded flex items-center justify-between">
      <div>
        <div className="font-semibold">{item.seller || "Seller"}</div>
        <div className="text-xs text-gray-500 mt-1">Qty: {item.qty} L • Price: {item.price}</div>
        <div className="text-xs text-gray-500">Quality: Turb {item.turbidity} NTU • BOD {item.BOD} • TN {item.TN}</div>
      </div>
      <div>
        {item.sold
          ? <div className="text-green-600 text-sm">Sold</div>
          : <button className="px-3 py-2 border rounded" onClick={onBuy}>Buy</button>}
      </div>
    </div>
  );
}

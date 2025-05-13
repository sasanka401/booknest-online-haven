
import React from "react";

const CashOnDelivery: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Cash on Delivery</h2>
      <div className="bg-gray-50 p-4 rounded-md">
        <p>Pay with cash upon delivery.</p>
        <div className="flex items-center mt-3">
          <input 
            type="checkbox" 
            id="cod-confirm" 
            className="mr-2 h-4 w-4"
            required
          />
          <label htmlFor="cod-confirm" className="text-sm">
            I confirm that I will make payment upon delivery
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Our delivery partner will collect the payment at the time of delivery
        </p>
      </div>
    </div>
  );
};

export default CashOnDelivery;

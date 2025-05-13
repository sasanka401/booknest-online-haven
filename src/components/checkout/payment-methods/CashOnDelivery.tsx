
import React from "react";

const CashOnDelivery: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Cash on Delivery</h2>
      <div className="bg-gray-50 p-4 rounded-md">
        <p>Pay with cash upon delivery.</p>
        <p className="text-sm text-gray-500 mt-2">
          Our delivery partner will collect the payment at the time of delivery
        </p>
      </div>
    </div>
  );
};

export default CashOnDelivery;

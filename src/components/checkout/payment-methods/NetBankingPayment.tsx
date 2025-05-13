
import React from "react";

const NetBankingPayment: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Net Banking</h2>
      <div className="bg-gray-50 p-4 rounded-md">
        <p className="mb-2">Select Your Bank</p>
        <select className="w-full p-2 border rounded">
          <option>Select Bank</option>
          <option>State Bank of India</option>
          <option>HDFC Bank</option>
          <option>ICICI Bank</option>
          <option>Axis Bank</option>
          <option>Kotak Mahindra Bank</option>
        </select>
        <p className="text-sm text-gray-500 mt-2">
          You will be redirected to your bank's website
        </p>
      </div>
    </div>
  );
};

export default NetBankingPayment;

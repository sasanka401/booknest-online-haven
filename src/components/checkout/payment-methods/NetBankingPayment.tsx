
import React from "react";

const NetBankingPayment: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Net Banking</h2>
      <div className="bg-gray-50 p-4 rounded-md">
        <p className="mb-2">Select Your Bank</p>
        <select 
          className="w-full p-2 border rounded"
          id="bank-select"
          required
        >
          <option value="">Select Bank</option>
          <option value="SBI">State Bank of India</option>
          <option value="HDFC">HDFC Bank</option>
          <option value="ICICI">ICICI Bank</option>
          <option value="Axis">Axis Bank</option>
          <option value="Kotak">Kotak Mahindra Bank</option>
        </select>
        <p className="text-sm text-gray-500 mt-2">
          You will be redirected to your bank's website
        </p>
      </div>
    </div>
  );
};

export default NetBankingPayment;

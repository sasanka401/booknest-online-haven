
import React from "react";
import { Input } from "@/components/ui/input";

const UPIPayment: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">UPI Payment</h2>
      <div className="bg-gray-50 p-4 rounded-md">
        <p className="mb-2">Enter your UPI ID</p>
        <Input placeholder="username@upi" />
        <p className="text-sm text-gray-500 mt-2">
          You will receive a payment request on your UPI app
        </p>
      </div>
    </div>
  );
};

export default UPIPayment;

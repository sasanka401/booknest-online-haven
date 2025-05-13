
import React from "react";
import { ShippingFormValues } from "../validation-schemas";

interface ShippingSummaryProps {
  shippingData: ShippingFormValues;
}

const ShippingSummary: React.FC<ShippingSummaryProps> = ({ shippingData }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md mt-6">
      <h3 className="font-medium mb-2">Shipping Details</h3>
      <div className="text-sm space-y-1">
        <p>{shippingData.fullName}</p>
        <p>{shippingData.phoneNumber}</p>
        <p>{shippingData.address}</p>
        <p>{shippingData.city}, {shippingData.state} {shippingData.pinCode}</p>
        <p>{shippingData.email}</p>
      </div>
    </div>
  );
};

export default ShippingSummary;

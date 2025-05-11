
import React from "react";

type CheckoutStep = "shipping" | "payment" | "confirmation";

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
}

const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        <div className={`flex items-center ${currentStep === "shipping" ? "text-primary" : "text-gray-500"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "shipping" ? "bg-primary text-white" : "bg-gray-200"}`}>
            1
          </div>
          <span className="ml-2 font-medium">Shipping</span>
        </div>
        <div className="h-1 w-16 mx-2 bg-gray-200"></div>
        <div className={`flex items-center ${currentStep === "payment" ? "text-primary" : "text-gray-500"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "payment" ? "bg-primary text-white" : "bg-gray-200"}`}>
            2
          </div>
          <span className="ml-2 font-medium">Payment</span>
        </div>
        <div className="h-1 w-16 mx-2 bg-gray-200"></div>
        <div className="flex items-center text-gray-500">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200">
            3
          </div>
          <span className="ml-2 font-medium">Confirmation</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProgress;

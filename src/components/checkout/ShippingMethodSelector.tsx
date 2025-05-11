
import React from "react";
import { Truck, Package } from "lucide-react";
import { IndianRupee } from "lucide-react";

interface ShippingMethodSelectorProps {
  selectedMethod: string;
  onMethodSelect: (method: string) => void;
}

const ShippingMethodSelector: React.FC<ShippingMethodSelectorProps> = ({ 
  selectedMethod, 
  onMethodSelect 
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Shipping Method</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`p-4 border rounded-md cursor-pointer transition-all ${
            selectedMethod === "standard" 
              ? "border-primary bg-primary/5" 
              : "hover:border-gray-400"
          }`}
          onClick={() => onMethodSelect("standard")}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Truck size={18} className="mr-2" />
              <span className="font-medium">Standard</span>
            </div>
            <span className="text-sm font-semibold flex items-center"><IndianRupee className="h-3 w-3 mr-0.5" />399</span>
          </div>
          <p className="text-sm text-gray-500">Delivery in 3-5 business days</p>
        </div>
        
        <div
          className={`p-4 border rounded-md cursor-pointer transition-all ${
            selectedMethod === "express" 
              ? "border-primary bg-primary/5" 
              : "hover:border-gray-400"
          }`}
          onClick={() => onMethodSelect("express")}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Package size={18} className="mr-2" />
              <span className="font-medium">Express</span>
            </div>
            <span className="text-sm font-semibold flex items-center"><IndianRupee className="h-3 w-3 mr-0.5" />1199</span>
          </div>
          <p className="text-sm text-gray-500">Delivery in 1-2 business days</p>
        </div>
        
        <div
          className={`p-4 border rounded-md cursor-pointer transition-all ${
            selectedMethod === "next-day" 
              ? "border-primary bg-primary/5" 
              : "hover:border-gray-400"
          }`}
          onClick={() => onMethodSelect("next-day")}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Truck size={18} className="mr-2" />
              <span className="font-medium">Next Day</span>
            </div>
            <span className="text-sm font-semibold flex items-center"><IndianRupee className="h-3 w-3 mr-0.5" />1999</span>
          </div>
          <p className="text-sm text-gray-500">Delivered by tomorrow</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingMethodSelector;

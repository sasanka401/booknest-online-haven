
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Banknote, CircleDollarSign } from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  form: any;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  setPaymentMethod,
  form,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Choose Payment Method</h2>
      
      <RadioGroup 
        defaultValue="credit-card" 
        value={paymentMethod} 
        onValueChange={(value) => {
          setPaymentMethod(value);
          form.setValue("paymentMethod", value);
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <div className={`border rounded-md p-4 cursor-pointer ${paymentMethod === "credit-card" ? "border-primary bg-primary/5" : "border-gray-200"}`}>
          <RadioGroupItem value="credit-card" id="credit-card" className="sr-only" />
          <label htmlFor="credit-card" className="flex items-center gap-3 cursor-pointer">
            <CreditCard className="h-5 w-5 text-primary" />
            <span className="font-medium">Credit Card</span>
          </label>
        </div>
        
        <div className={`border rounded-md p-4 cursor-pointer ${paymentMethod === "debit-card" ? "border-primary bg-primary/5" : "border-gray-200"}`}>
          <RadioGroupItem value="debit-card" id="debit-card" className="sr-only" />
          <label htmlFor="debit-card" className="flex items-center gap-3 cursor-pointer">
            <CreditCard className="h-5 w-5 text-primary" />
            <span className="font-medium">Debit Card</span>
          </label>
        </div>
        
        <div className={`border rounded-md p-4 cursor-pointer ${paymentMethod === "upi" ? "border-primary bg-primary/5" : "border-gray-200"}`}>
          <RadioGroupItem value="upi" id="upi" className="sr-only" />
          <label htmlFor="upi" className="flex items-center gap-3 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
              <path d="M4 18L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 6L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 18L9 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium">UPI</span>
          </label>
        </div>
        
        <div className={`border rounded-md p-4 cursor-pointer ${paymentMethod === "net-banking" ? "border-primary bg-primary/5" : "border-gray-200"}`}>
          <RadioGroupItem value="net-banking" id="net-banking" className="sr-only" />
          <label htmlFor="net-banking" className="flex items-center gap-3 cursor-pointer">
            <Banknote className="h-5 w-5 text-primary" />
            <span className="font-medium">Net Banking</span>
          </label>
        </div>
        
        <div className={`border rounded-md p-4 cursor-pointer ${paymentMethod === "cash-on-delivery" ? "border-primary bg-primary/5" : "border-gray-200"}`}>
          <RadioGroupItem value="cash-on-delivery" id="cash-on-delivery" className="sr-only" />
          <label htmlFor="cash-on-delivery" className="flex items-center gap-3 cursor-pointer">
            <CircleDollarSign className="h-5 w-5 text-primary" />
            <span className="font-medium">Cash on Delivery</span>
          </label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  CreditCard, 
  ArrowLeft, 
  IndianRupee,
  DebitCard, 
  Banknote, 
  Cash
} from "lucide-react";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema, PaymentFormValues } from "./validation-schemas";
import { ShippingFormValues } from "./validation-schemas";

interface PaymentFormProps {
  onSubmit: (values: PaymentFormValues) => void;
  onBack: () => void;
  shippingData: ShippingFormValues;
  total: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  onBack,
  shippingData,
  total,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card");
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const handlePaymentSubmit = (values: PaymentFormValues) => {
    // Add payment method to values
    onSubmit({ ...values, paymentMethod });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handlePaymentSubmit)} className="space-y-6">
        {/* Payment Method Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Choose Payment Method</h2>
          
          <RadioGroup 
            defaultValue="credit-card" 
            value={paymentMethod} 
            onValueChange={setPaymentMethod}
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
                <DebitCard className="h-5 w-5 text-primary" />
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
                <Cash className="h-5 w-5 text-primary" />
                <span className="font-medium">Cash on Delivery</span>
              </label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Show Card Details only for Credit Card and Debit Card payment methods */}
        {(paymentMethod === "credit-card" || paymentMethod === "debit-card") && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{paymentMethod === "credit-card" ? "Credit" : "Debit"} Card Information</h2>
            
            <FormField
              control={form.control}
              name="cardName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name on Card</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234 5678 9012 3456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input placeholder="MM/YY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input placeholder="123" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
        
        {/* UPI Payment Method */}
        {paymentMethod === "upi" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">UPI Payment</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="mb-2">Enter your UPI ID</p>
              <Input placeholder="username@upi" />
              <p className="text-sm text-gray-500 mt-2">You will receive a payment request on your UPI app</p>
            </div>
          </div>
        )}
        
        {/* Net Banking Method */}
        {paymentMethod === "net-banking" && (
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
              <p className="text-sm text-gray-500 mt-2">You will be redirected to your bank's website</p>
            </div>
          </div>
        )}
        
        {/* Cash on Delivery */}
        {paymentMethod === "cash-on-delivery" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Cash on Delivery</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p>Pay with cash upon delivery.</p>
              <p className="text-sm text-gray-500 mt-2">Our delivery partner will collect the payment at the time of delivery</p>
            </div>
          </div>
        )}

        {/* Shipping info summary */}
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
        
        <div className="pt-4 flex gap-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex items-center">
            <ArrowLeft className="mr-2" size={16} /> Back
          </Button>
          <Button type="submit" className="flex-1 flex items-center justify-center">
            Pay <IndianRupee className="h-4 w-4 mx-1" />{total.toFixed(2)}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentForm;

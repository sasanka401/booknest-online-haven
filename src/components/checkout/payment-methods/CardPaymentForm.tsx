
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, CreditCard, Calendar, KeyRound } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PaymentFormValues } from "../validation-schemas";

interface CardPaymentFormProps {
  form: UseFormReturn<PaymentFormValues>;
  formatCardNumber: (value: string) => string;
  handleExpiryDateChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => void;
}

const CardPaymentForm: React.FC<CardPaymentFormProps> = ({
  form,
  formatCardNumber,
  handleExpiryDateChange,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Card Information</h2>
      
      <FormField
        control={form.control}
        name="cardName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name on Card</FormLabel>
            <FormControl>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="John Doe" 
                  {...field} 
                  className="pl-10" 
                  pattern="[A-Za-z ]+"
                  title="Only letters and spaces are allowed" 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="cardNumber"
        render={({ field: { onChange, ...fieldProps } }) => (
          <FormItem>
            <FormLabel>Card Number</FormLabel>
            <FormControl>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="1234567890123456" 
                  {...fieldProps}
                  onChange={(e) => onChange(formatCardNumber(e.target.value))}
                  className="pl-10" 
                  maxLength={16}
                  pattern="[0-9]{16}"
                  inputMode="numeric"
                  title="Card number must be 16 digits" 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="MM/YY" 
                    {...fieldProps}
                    onChange={(e) => handleExpiryDateChange(e, onChange)}
                    className="pl-10" 
                    maxLength={5}
                    inputMode="numeric"
                  />
                </div>
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
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="123" 
                    type="password" 
                    {...field} 
                    className="pl-10"
                    maxLength={3}
                    pattern="[0-9]{3}"
                    inputMode="numeric"
                    title="CVV must be 3 digits" 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CardPaymentForm;

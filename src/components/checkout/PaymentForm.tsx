
import React from "react";
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
import { CreditCard, ArrowLeft, IndianRupee } from "lucide-react";
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
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Payment Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Payment Information</h2>
          
          <div className="flex items-center mb-4">
            <CreditCard size={20} className="mr-2" />
            <span className="font-medium">Credit Card</span>
          </div>
          
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

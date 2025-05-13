
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
import { User, Phone, Mail, Building, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingSchema, ShippingFormValues } from "./validation-schemas";
import ShippingMethodSelector from "./ShippingMethodSelector";

interface ShippingFormProps {
  onSubmit: (values: ShippingFormValues) => void;
  shippingMethod: string;
  onShippingMethodChange: (method: string) => void;
  defaultValues?: ShippingFormValues;
}

const ShippingForm: React.FC<ShippingFormProps> = ({
  onSubmit,
  shippingMethod,
  onShippingMethodChange,
  defaultValues = {
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
  }
}) => {
  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Shipping Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Shipping Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input 
                        placeholder="John Doe" 
                        {...field} 
                        className="pl-10" 
                        pattern="[A-Za-z ]+"
                        title="Only letters are allowed"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input 
                        placeholder="9876543210" 
                        {...field} 
                        className="pl-10" 
                        maxLength={10}
                        pattern="[0-9]{10}"
                        title="Phone number must be exactly 10 digits"
                        inputMode="numeric"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input 
                      placeholder="john@example.com" 
                      {...field} 
                      className="pl-10"
                      type="email" 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input placeholder="123 Main St" {...field} className="pl-10" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City/Village</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="New York" 
                      {...field}
                      pattern="[A-Za-z ]+"
                      title="Only letters are allowed" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="NY" 
                      {...field}
                      pattern="[A-Za-z ]+"
                      title="Only letters are allowed" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="pinCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIN Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="100001" 
                      {...field}
                      maxLength={6}
                      pattern="[0-9]{6}"
                      title="PIN code must be exactly 6 digits"
                      inputMode="numeric" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Shipping Method */}
        <ShippingMethodSelector 
          selectedMethod={shippingMethod} 
          onMethodSelect={onShippingMethodChange} 
        />
        
        <div className="pt-4">
          <Button type="submit" className="w-full flex items-center justify-center">
            Continue to Payment <ArrowRight className="ml-2" size={16} />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ShippingForm;

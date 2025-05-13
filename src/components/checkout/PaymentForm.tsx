
import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema, PaymentFormValues } from "./validation-schemas";
import { ShippingFormValues } from "./validation-schemas";

// Import payment method components
import PaymentMethodSelector from "./payment-methods/PaymentMethodSelector";
import CardPaymentForm from "./payment-methods/CardPaymentForm";
import UPIPayment from "./payment-methods/UPIPayment";
import NetBankingPayment from "./payment-methods/NetBankingPayment";
import CashOnDelivery from "./payment-methods/CashOnDelivery";
import ShippingSummary from "./payment-methods/ShippingSummary";
import PaymentActions from "./payment-methods/PaymentActions";

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
      paymentMethod: "credit-card"
    },
  });

  const handlePaymentSubmit = (values: PaymentFormValues) => {
    // Add payment method to values
    onSubmit({ ...values, paymentMethod });
  };
  
  // Format card number to show spaces every 4 digits
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    return v.length > 16 ? v.slice(0, 16) : v;
  };
  
  // Handle expiry date formatting to automatically add the slash
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
      if (value.length <= 2) {
        onChange(value);
      } else {
        const month = value.slice(0, 2);
        const year = value.slice(2, 4);
        onChange(`${month}/${year}`);
      }
    } else {
      onChange('');
    }
  };

  // Render the appropriate payment method form based on selection
  const renderPaymentMethodForm = () => {
    switch (paymentMethod) {
      case "credit-card":
      case "debit-card":
        return (
          <CardPaymentForm
            form={form}
            formatCardNumber={formatCardNumber}
            handleExpiryDateChange={handleExpiryDateChange}
          />
        );
      case "upi":
        return <UPIPayment />;
      case "net-banking":
        return <NetBankingPayment />;
      case "cash-on-delivery":
        return <CashOnDelivery />;
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handlePaymentSubmit)} className="space-y-6">
        {/* Payment Method Selection */}
        <PaymentMethodSelector 
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          form={form}
        />
        
        {/* Payment Method Form */}
        {renderPaymentMethodForm()}
        
        {/* Shipping info summary */}
        <ShippingSummary shippingData={shippingData} />
        
        {/* Action Buttons */}
        <PaymentActions onBack={onBack} total={total} />
      </form>
    </Form>
  );
};

export default PaymentForm;

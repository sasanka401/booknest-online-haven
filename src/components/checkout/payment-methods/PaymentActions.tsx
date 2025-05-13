
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, IndianRupee } from "lucide-react";

interface PaymentActionsProps {
  onBack: () => void;
  total: number;
}

const PaymentActions: React.FC<PaymentActionsProps> = ({ onBack, total }) => {
  return (
    <div className="pt-4 flex gap-4">
      <Button type="button" variant="outline" onClick={onBack} className="flex items-center">
        <ArrowLeft className="mr-2" size={16} /> Back
      </Button>
      <Button type="submit" className="flex-1 flex items-center justify-center">
        Pay <IndianRupee className="h-4 w-4 mx-1" />{total.toFixed(2)}
      </Button>
    </div>
  );
};

export default PaymentActions;

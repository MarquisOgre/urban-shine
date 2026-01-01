import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  total_amount: number;
  amount_paid: number;
  status: string;
}

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onPayment: (invoiceId: string, amount: number) => void;
}

const PaymentModal = ({ open, onClose, invoice, onPayment }: PaymentModalProps) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [notes, setNotes] = useState("");

  const balance = invoice ? invoice.total_amount - (invoice.amount_paid || 0) : 0;

  const handleSave = () => {
    if (invoice && amount) {
      onPayment(invoice.id, Number(amount));
      setAmount("");
      setPaymentMethod("upi");
      setNotes("");
    }
  };

  const handlePayFull = () => {
    setAmount(balance.toFixed(2));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        
        {invoice && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="font-medium">{invoice.invoice_number}</p>
              <p className="text-sm text-slate-600">{invoice.customer_name}</p>
              <div className="mt-2 flex justify-between text-sm">
                <span>Total:</span>
                <span>₹{invoice.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Paid:</span>
                <span>₹{(invoice.amount_paid || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium border-t mt-2 pt-2">
                <span>Balance:</span>
                <span className="text-red-600">₹{balance.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Button size="sm" variant="outline" onClick={handlePayFull}>
                  Pay Full
                </Button>
              </div>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                max={balance}
              />
            </div>

            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes..."
                className="h-20"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button 
                onClick={handleSave} 
                disabled={!amount || Number(amount) <= 0 || Number(amount) > balance}
              >
                Record Payment
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
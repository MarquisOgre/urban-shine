import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface InvoicePrintProps {
  invoice: any;
  onClose: () => void;
}

const InvoicePrint = ({ invoice, onClose }: InvoicePrintProps) => {
  useEffect(() => {
    const handlePrint = () => {
      window.print();
    };

    // Auto print after a brief delay
    const timer = setTimeout(handlePrint, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Close button - hidden when printing */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <Button variant="outline" size="sm" onClick={onClose}>
          <X className="h-4 w-4 mr-2" />
          Close
        </Button>
      </div>

      <div className="max-w-3xl mx-auto p-8 print:p-4">
        {/* Header */}
        <div className="text-center border-b-2 border-slate-800 pb-6 mb-6">
          <div className="flex justify-center mb-4">
            <img src="/Logo.png" alt="Logo" className="h-16 w-auto object-contain" />
          </div>
          {/* <h1 className="text-2xl font-bold text-slate-800">Urban Shine</h1> */}
          <p className="text-sm text-slate-600 mt-2">
            RK Residency, Haritha Royal City Colony, Ravalkole, Medchal - 501401
          </p>
        </div>

        {/* Invoice Details */}
        <div className="flex justify-between mb-8">
          <div>
            <h3 className="font-bold text-slate-800 mb-2">Bill To:</h3>
            <p className="font-medium">{invoice.customer_name || "N/A"}</p>
            {invoice.customer_phone && <p className="text-sm">{invoice.customer_phone}</p>}
            {invoice.customer_email && <p className="text-sm">{invoice.customer_email}</p>}
            {invoice.customer_address && <p className="text-sm">{invoice.customer_address}</p>}
            {invoice.customer_gst_no && <p className="text-sm">GST: {invoice.customer_gst_no}</p>}
          </div>
          <div className="text-right">
            <h3 className="font-bold text-slate-800 mb-2">Invoice Details:</h3>
            <p><span className="font-medium">Invoice #:</span> {invoice.invoice_number}</p>
            <p><span className="font-medium">Date:</span> {new Date(invoice.invoice_date).toLocaleDateString()}</p>
            <p><span className="font-medium">Status:</span> {invoice.status}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-3 border border-slate-200">Description</th>
              <th className="text-center p-3 border border-slate-200">Qty</th>
              <th className="text-right p-3 border border-slate-200">Rate (₹)</th>
              <th className="text-right p-3 border border-slate-200">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item: any, index: number) => (
              <tr key={index}>
                <td className="p-3 border border-slate-200">{item.description}</td>
                <td className="text-center p-3 border border-slate-200">{item.quantity}</td>
                <td className="text-right p-3 border border-slate-200">₹{item.rate.toFixed(2)}</td>
                <td className="text-right p-3 border border-slate-200">₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span>Subtotal:</span>
              <span>₹{(invoice.subtotal || 0).toFixed(2)}</span>
            </div>
            {(invoice.discount || 0) > 0 && (
              <div className="flex justify-between py-2 text-red-600">
                <span>Discount ({invoice.discount}%):</span>
                <span>- ₹{((invoice.subtotal || 0) * (invoice.discount || 0) / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-2">
              <span>Tax ({invoice.tax_rate || 0}%):</span>
              <span>₹{(invoice.tax_amount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg border-t-2 border-slate-800">
              <span>Total:</span>
              <span>₹{(invoice.total_amount || 0).toFixed(2)}</span>
            </div>
            {(invoice.amount_paid || 0) > 0 && (
              <>
                <div className="flex justify-between py-2 text-green-600">
                  <span>Paid:</span>
                  <span>₹{(invoice.amount_paid || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-red-600">
                  <span>Balance:</span>
                  <span>₹{((invoice.total_amount || 0) - (invoice.amount_paid || 0)).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="bg-slate-50 p-4 rounded-lg mb-8 border-l-4 border-blue-500">
            <h4 className="font-bold mb-2">Notes:</h4>
            <p>{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-6 mt-8">
          <div className="text-center">
            {/* <p className="font-bold">Urban Shine</p> */}
            <div className="flex justify-center gap-8 text-sm text-slate-600 mt-2">
              <span>📍 #202, RK Residency, Ravalkole, Medchal</span>
              <span>📞 +91 8500 60 6000</span>
              <span>📧 support@urbanshine.com</span>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">
            This is a computer-generated invoice and does not require a signature.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;
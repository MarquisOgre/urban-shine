import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Printer, Edit, Trash2, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvoiceModal from "@/components/InvoiceModal";
import CustomerModal from "@/components/CustomerModal";
import InvoicePrint from "@/components/InvoicePrint";
import PaymentModal from "@/components/PaymentModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  gst_no?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  customer_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  customer_gst_no?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  amount_paid: number;
  status: string;
  invoice_date: string;
  notes?: string;
}

const Invoice = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();

  const fetchInvoices = async () => {
    const { data, error } = await supabase.from("invoices").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      setInvoices(data.map((inv: any) => ({
        ...inv,
        items: (inv.items as any) || [],
        subtotal: Number(inv.subtotal),
        tax_rate: Number(inv.tax_rate),
        tax_amount: Number(inv.tax_amount),
        total_amount: Number(inv.total_amount),
        amount_paid: Number(inv.amount_paid),
      })));
    }
  };

  const fetchCustomers = async () => {
    const { data, error } = await supabase.from("customers").select("*").order("name");
    if (!error && data) setCustomers(data);
  };

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
  }, []);

  const handleSaveInvoice = async (invoiceData: any) => {
    if (selectedInvoice) {
      const { error } = await supabase.from("invoices").update({
        ...invoiceData,
        customer_id: invoiceData.customer_id || null,
      }).eq("id", selectedInvoice.id);
      if (!error) {
        toast({ title: "Success", description: "Invoice updated successfully", duration: 3000 });
        fetchInvoices();
      }
    } else {
      const { error } = await supabase.from("invoices").insert({
        ...invoiceData,
        amount_paid: 0,
        customer_id: invoiceData.customer_id || null,
      });
      if (!error) {
        toast({ title: "Success", description: "Invoice created successfully", duration: 3000 });
        fetchInvoices();
      }
    }
    setSelectedInvoice(null);
  };

  const handleSaveCustomer = async (customerData: any) => {
    if (customerData.id) {
      const { error } = await supabase.from("customers").update({
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        gst_no: customerData.gst_no,
      }).eq("id", customerData.id);
      if (!error) {
        toast({ title: "Success", description: "Customer updated successfully", duration: 3000 });
        fetchCustomers();
      }
    } else {
      const { error } = await supabase.from("customers").insert({
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        gst_no: customerData.gst_no,
      });
      if (!error) {
        toast({ title: "Success", description: "Customer added successfully", duration: 3000 });
        fetchCustomers();
      }
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      const { error } = await supabase.from("invoices").delete().eq("id", invoiceId);
      if (!error) {
        toast({ title: "Deleted", description: "Invoice deleted successfully", duration: 3000 });
        fetchInvoices();
      }
    }
  };

  const handlePayment = async (invoiceId: string, amount: number) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;
    const newAmountPaid = (inv.amount_paid || 0) + amount;
    const newStatus = newAmountPaid >= inv.total_amount ? "Paid" : newAmountPaid > 0 ? "Partial" : "Pending";

    const { error } = await supabase.from("invoices").update({
      amount_paid: newAmountPaid,
      status: newStatus,
    }).eq("id", invoiceId);

    if (!error) {
      toast({ title: "Success", description: "Payment recorded successfully", duration: 3000 });
      fetchInvoices();
    }
    setShowPaymentModal(false);
    setSelectedInvoice(null);
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Paid: "default", Pending: "destructive", Partial: "secondary",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (printInvoice) {
    return <InvoicePrint invoice={printInvoice} onClose={() => setPrintInvoice(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className="py-6 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">Invoice System</h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">Manage invoices, customers, and payments</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{invoices.length}</p>
                <p className="text-sm text-slate-600">Total Invoices</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{invoices.filter((i) => i.status === "Paid").length}</p>
                <p className="text-sm text-slate-600">Paid</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">{invoices.filter((i) => i.status === "Partial").length}</p>
                <p className="text-sm text-slate-600">Partial</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{invoices.filter((i) => i.status === "Pending").length}</p>
                <p className="text-sm text-slate-600">Pending</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-2xl text-slate-800">Invoices</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search invoices..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-48" />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32 bg-white"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Partial">Partial</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setShowCustomerModal(true)} variant="outline">
                    <Users className="h-4 w-4 mr-2" />Customers
                  </Button>
                  <Button onClick={() => { setSelectedInvoice(null); setShowInvoiceModal(true); }} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />New Invoice
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredInvoices.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500 mb-4">No invoices found</p>
                  <Button onClick={() => { setSelectedInvoice(null); setShowInvoiceModal(true); }}>
                    <Plus className="h-4 w-4 mr-2" />Create Your First Invoice
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Paid</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                          <TableCell>{invoice.customer_name}</TableCell>
                          <TableCell>{invoice.invoice_date}</TableCell>
                          <TableCell className="text-right">₹{invoice.total_amount.toFixed(2)}</TableCell>
                          <TableCell className="text-right">₹{(invoice.amount_paid || 0).toFixed(2)}</TableCell>
                          <TableCell className="text-right">₹{(invoice.total_amount - (invoice.amount_paid || 0)).toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button size="sm" variant="ghost" onClick={() => setPrintInvoice(invoice)}><Printer className="h-4 w-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => { setSelectedInvoice(invoice); setShowInvoiceModal(true); }}><Edit className="h-4 w-4" /></Button>
                              {invoice.status !== "Paid" && (
                                <Button size="sm" variant="outline" onClick={() => { setSelectedInvoice(invoice); setShowPaymentModal(true); }}>Pay</Button>
                              )}
                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteInvoice(invoice.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />

      <InvoiceModal open={showInvoiceModal} onClose={() => { setShowInvoiceModal(false); setSelectedInvoice(null); }} invoice={selectedInvoice} customers={customers} onSave={handleSaveInvoice} />
      <CustomerModal open={showCustomerModal} onClose={() => setShowCustomerModal(false)} customers={customers} onSave={handleSaveCustomer} onDelete={async (id) => {
        const { error } = await supabase.from("customers").delete().eq("id", id);
        if (!error) {
          toast({ title: "Deleted", description: "Customer deleted successfully", duration: 3000 });
          fetchCustomers();
        }
      }} />
      <PaymentModal open={showPaymentModal} onClose={() => { setShowPaymentModal(false); setSelectedInvoice(null); }} invoice={selectedInvoice} onPayment={handlePayment} />
    </div>
  );
};

export default Invoice;

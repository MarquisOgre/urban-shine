import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useProductPrices, useUpsertRow, useDeleteRow } from "@/hooks/useCloudData";
import type { PricingData } from "@/data/types";

const empty = {
  id: "",
  product: "",
  uom: "",
  retailPrice: "",
  bulkPrice5Ltr: "",
  bulkPrice100Gms: "",
};

const ProductPrices = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: products = [], isLoading } = useProductPrices();
  const upsert = useUpsertRow("product_prices");
  const remove = useDeleteRow("product_prices");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const startAdd = () => { setForm(empty); setOpen(true); };
  const startEdit = (p: PricingData) => {
    setForm({
      id: p.id,
      product: p.product,
      uom: p.uom ?? "",
      retailPrice: String(p.retailPrice),
      bulkPrice5Ltr: p.bulkPrice5Ltr == null ? "" : String(p.bulkPrice5Ltr),
      bulkPrice100Gms: p.bulkPrice100Gms == null ? "" : String(p.bulkPrice100Gms),
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.product.trim()) return toast.error("Product name is required");
    try {
      await upsert.mutateAsync({
        ...(form.id ? { id: form.id } : {}),
        product: form.product.trim(),
        uom: form.uom.trim() || null,
        retail_price: Number(form.retailPrice) || 0,
        bulk_price_5ltr: form.bulkPrice5Ltr === "" ? null : Number(form.bulkPrice5Ltr),
        bulk_price_100gms: form.bulkPrice100Gms === "" ? null : Number(form.bulkPrice100Gms),
      });
      toast.success(form.id ? "Price updated" : "Product added");
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
    }
  };

  const del = async (id: string) => {
    try {
      await remove.mutateAsync(id);
      toast.success("Product removed");
    } catch (e: any) {
      toast.error(e.message ?? "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="py-8 px-6">
        <div className="max-w-[1900px] mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <Button variant="outline" onClick={() => navigate("/")} className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-slate-800">Product Prices</h1>
            {user ? (
              <Button onClick={startAdd} className="gap-2">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            ) : (
              <div className="w-[150px]" />
            )}
          </div>

          {isLoading ? (
            <p className="text-center text-slate-500">Loading…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {products.map((product) => {
                const bulkPrice = product.bulkPrice100Gms ?? product.bulkPrice5Ltr;
                const bulkLabel = product.bulkPrice100Gms ? "100 Gms Bulk" : "5 Ltr Bulk";

                return (
                  <Card
                    key={product.id}
                    className="w-full max-w-[560px] flex items-center bg-white rounded-2xl p-6 transition-all hover:shadow-xl"
                    style={{ boxShadow: "inset 6px 0 0 0 #1F44B6, 0 4px 12px rgba(0,0,0,0.08)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-slate-800 text-lg">{product.product}</span>
                    </div>

                    <div className="flex items-center gap-6 ml-auto">
                      <div className="text-center">
                        <div className="text-xs text-slate-500">UOM</div>
                        <div className="font-medium text-slate-700 text-sm">{product.uom ?? "-"}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-500">Retail</div>
                        <div className="font-bold text-yellow-700 text-lg">₹ {product.retailPrice}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-500">{bulkLabel}</div>
                        <div className="font-bold text-green-700 text-lg">
                          {bulkPrice == null ? "-" : `₹ ${bulkPrice}`}
                        </div>
                      </div>
                      {user && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => startEdit(product)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => del(product.id)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit Product Price" : "Add Product Price"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Product</Label>
                <Input value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} />
              </div>
              <div>
                <Label>UOM</Label>
                <Input placeholder="1 Ltr" value={form.uom} onChange={(e) => setForm({ ...form, uom: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Retail (₹)</Label>
                <Input type="number" value={form.retailPrice} onChange={(e) => setForm({ ...form, retailPrice: e.target.value })} />
              </div>
              <div>
                <Label>5 Ltr Bulk (₹)</Label>
                <Input type="number" value={form.bulkPrice5Ltr} onChange={(e) => setForm({ ...form, bulkPrice5Ltr: e.target.value })} />
              </div>
              <div>
                <Label>100 Gms Bulk (₹)</Label>
                <Input type="number" value={form.bulkPrice100Gms} onChange={(e) => setForm({ ...form, bulkPrice100Gms: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProductPrices;

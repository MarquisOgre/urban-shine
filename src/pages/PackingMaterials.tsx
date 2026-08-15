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
import { usePackingMaterials, useUpsertRow, useDeleteRow } from "@/hooks/useCloudData";
import type { PackingData } from "@/data/types";

const empty = { id: "", product: "", minimumOrder: "", retailPrice: "" };

const PackingMaterials = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: materials = [], isLoading } = usePackingMaterials();
  const upsert = useUpsertRow("packing_materials");
  const remove = useDeleteRow("packing_materials");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const startAdd = () => { setForm(empty); setOpen(true); };
  const startEdit = (m: PackingData) => {
    setForm({
      id: m.id,
      product: m.product,
      minimumOrder: String(m.minimumOrder),
      retailPrice: String(m.retailPrice),
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.product.trim()) return toast.error("Product name is required");
    try {
      await upsert.mutateAsync({
        ...(form.id ? { id: form.id } : {}),
        product: form.product.trim(),
        minimum_order: Number(form.minimumOrder) || 0,
        retail_price: Number(form.retailPrice) || 0,
      });
      toast.success(form.id ? "Material updated" : "Material added");
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
    }
  };

  const del = async (id: string) => {
    try {
      await remove.mutateAsync(id);
      toast.success("Material removed");
    } catch (e: any) {
      toast.error(e.message ?? "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <Button variant="outline" onClick={() => navigate("/")} className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-slate-800">Packing Materials Cost</h1>
            {user ? (
              <Button onClick={startAdd} className="gap-2">
                <Plus className="h-4 w-4" /> Add Material
              </Button>
            ) : (
              <div className="w-[150px]" />
            )}
          </div>

          {isLoading ? (
            <p className="text-center text-slate-500">Loading…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {materials.map((material) => (
                <Card
                  key={material.id}
                  className="p-4 flex items-center justify-between gap-3 bg-white rounded-2xl transition-all hover:shadow-lg"
                  style={{ boxShadow: "inset 6px 0 0 0 #1F44B6, 0 4px 10px rgba(0,0,0,0.08)" }}
                >
                  <span className="font-semibold text-slate-800 truncate flex-1">{material.product}</span>
                  <span className="text-slate-600 text-sm whitespace-nowrap">MOQ: {material.minimumOrder}</span>
                  <span className="font-bold text-yellow-700 text-lg whitespace-nowrap">₹ {material.retailPrice}</span>
                  {user && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(material)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => del(material.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit Packing Material" : "Add Packing Material"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Product</Label>
              <Input value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Minimum Order</Label>
                <Input type="number" value={form.minimumOrder} onChange={(e) => setForm({ ...form, minimumOrder: e.target.value })} />
              </div>
              <div>
                <Label>Retail Price (₹)</Label>
                <Input type="number" value={form.retailPrice} onChange={(e) => setForm({ ...form, retailPrice: e.target.value })} />
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

export default PackingMaterials;

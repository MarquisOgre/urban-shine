import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Download, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useChemicalPrices, useUpsertRow, useDeleteRow } from "@/hooks/useCloudData";
import type { ChemicalData } from "@/data/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const loadLogoDataUrl = async (): Promise<string | null> => {
  try {
    const res = await fetch("/Logo.png");
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch { return null; }
};

const exportChemicalsPDF = async (chemicals: ChemicalData[]) => {
  const doc = new jsPDF("p", "mm", "a4");
  const logoDataUrl = await loadLogoDataUrl();
  const pageW = 210;
  const marginX = 14;
  const INK: [number, number, number] = [30, 41, 59];
  const ACCENT: [number, number, number] = [31, 68, 182];
  const LINE: [number, number, number] = [200, 204, 211];

  let y = 18;

  if (logoDataUrl) {
    try {
      const props = (doc as any).getImageProperties(logoDataUrl);
      const targetH = 18;
      const ratio = props.width / props.height;
      const targetW = Math.min(50, targetH * ratio);
      const finalH = targetW / ratio;
      doc.addImage(logoDataUrl, "PNG", pageW / 2 - targetW / 2, y - 12, targetW, finalH);
      y += finalH + 6;
    } catch {}
  }

  doc.setFont(undefined, "bold");
  doc.setFontSize(18);
  doc.setTextColor(...ACCENT);
  doc.text("Chemical Prices", pageW / 2, y, { align: "center" });
  y += 8;

  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, pageW / 2, y, { align: "center" });
  y += 12;

  const sorted = [...chemicals].sort((a, b) => a.chemical.localeCompare(b.chemical));
  const body = sorted.map((c, i) => [
    i + 1,
    c.chemical,
    c.uom,
    `₹ ${c.rate.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    "",
    "",
  ]);

  autoTable(doc, {
    startY: y,
    head: [["SL", "Chemical", "UOM", "Rate (₹)", "", ""]],
    body,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: { top: 3, right: 4, bottom: 3, left: 4 },
      textColor: INK,
      lineColor: LINE,
      lineWidth: 0.2,
      valign: "middle",
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: ACCENT,
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },
      1: { cellWidth: "auto" },
      2: { halign: "center", cellWidth: 25 },
      3: { halign: "right", cellWidth: 28 },
      4: { cellWidth: 35 },
      5: { cellWidth: 35 },
    },
    margin: { left: marginX, right: marginX },
    didDrawCell: (data) => {
      if (data.section === "head" && (data.column.index === 4 || data.column.index === 5)) {
        const { x, y, width, height } = data.cell;
        doc.setDrawColor(...LINE);
        doc.setLineWidth(0.2);
        doc.line(x + 4, y + height / 2, x + width - 4, y + height / 2);
      }
    },
  });

  doc.save("chemical-prices.pdf");
};

const empty = { id: "", chemical: "", rate: "", uom: "KG" };

const ChemicalPrices = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: chemicals = [], isLoading } = useChemicalPrices();
  const upsert = useUpsertRow("chemical_prices");
  const remove = useDeleteRow("chemical_prices");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const startAdd = () => { setForm(empty); setOpen(true); };
  const startEdit = (c: ChemicalData) => {
    setForm({ id: c.id, chemical: c.chemical, rate: String(c.rate), uom: c.uom });
    setOpen(true);
  };

  const save = async () => {
    if (!form.chemical.trim()) return toast.error("Chemical name is required");
    try {
      await upsert.mutateAsync({
        ...(form.id ? { id: form.id } : {}),
        chemical: form.chemical.trim(),
        rate: Number(form.rate) || 0,
        uom: form.uom.trim() || "KG",
      });
      toast.success(form.id ? "Chemical updated" : "Chemical added");
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
    }
  };

  const del = async (id: string) => {
    try {
      await remove.mutateAsync(id);
      toast.success("Chemical removed");
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
            <h1 className="text-3xl font-bold text-slate-800">Chemical Prices</h1>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={() => downloadChemicalsCSV(chemicals)} className="gap-2">
                <Download className="h-4 w-4" /> Export All Chemicals
              </Button>
              {user && (
                <Button onClick={startAdd} className="gap-2">
                  <Plus className="h-4 w-4" /> Add Chemical
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <p className="text-center text-slate-500">Loading…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {chemicals.map((chemical) => (
                <Card
                  key={chemical.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl transition-all hover:shadow-lg"
                  style={{ boxShadow: "inset 6px 0 0 0 #1F44B6, 0 4px 10px rgba(0,0,0,0.08)" }}
                >
                  <span className="font-semibold text-slate-800 truncate flex-1">{chemical.chemical}</span>
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4">
                    <span className="text-slate-600 text-sm whitespace-nowrap">UOM: {chemical.uom}</span>
                    <span className="font-bold text-yellow-700 text-base sm:text-lg whitespace-nowrap">₹ {chemical.rate}</span>
                    {user && (
                      <div className="flex gap-1 ml-auto sm:ml-0">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(chemical)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => del(chemical.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit Chemical" : "Add Chemical"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Chemical Name</Label>
              <Input value={form.chemical} onChange={(e) => setForm({ ...form, chemical: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Rate (₹)</Label>
                <Input type="number" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} />
              </div>
              <div>
                <Label>UOM</Label>
                <Input value={form.uom} onChange={(e) => setForm({ ...form, uom: e.target.value })} />
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

export default ChemicalPrices;

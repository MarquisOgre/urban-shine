import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Menu } from "lucide-react";
import { toast } from "sonner";
import { useChemicalPrices, useUpsertRow, slugify } from "@/hooks/useCloudData";
import type { FormulationData } from "@/data/types";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  formulation?: FormulationData | null;
}

interface Row { particulars: string; uom: string; qty: string }

const emptyRow: Row = { particulars: "", uom: "KGS", qty: "" };

const FormulationModal = ({ open, onClose, formulation }: Props) => {
  const { data: chemicals = [] } = useChemicalPrices();
  const upsert = useUpsertRow("formulations");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Household Cleaners");
  const [description, setDescription] = useState("");
  const [baseYield, setBaseYield] = useState("10");
  const [bottle500, setBottle500] = useState("");
  const [bottle1L, setBottle1L] = useState("");
  const [bottle5L, setBottle5L] = useState("");
  const [rows, setRows] = useState<Row[]>([{ ...emptyRow }]);
  const [method, setMethod] = useState("");

  useEffect(() => {
    if (!open) return;
    if (formulation) {
      setName(formulation.name);
      setCategory(formulation.category);
      setDescription(formulation.description);
      setBaseYield(String(formulation.baseYield));
      setBottle500(formulation.costPer500MLBottle == null ? "" : String(formulation.costPer500MLBottle));
      setBottle1L(formulation.costPer1LBottle == null ? "" : String(formulation.costPer1LBottle));
      setBottle5L(formulation.costPer5LBottle == null ? "" : String(formulation.costPer5LBottle));
      setRows(
        formulation.ingredients.map((i) => ({
          particulars: i.particulars,
          uom: i.uom,
          qty: String(i.qty),
        }))
      );
      setMethod(formulation.methodOfPreparation.join("\n"));
    } else {
      setName(""); setCategory("Household Cleaners"); setDescription("");
      setBaseYield("10"); setBottle500(""); setBottle1L(""); setBottle5L("");
      setRows([{ ...emptyRow }]); setMethod("");
    }
  }, [open, formulation]);

  const updateRow = (index: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));

  const moveRow = (index: number, direction: -1 | 1) => {
    setRows((prev) => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(newIndex, 0, moved);
      return next;
    });
  };

  const save = async () => {
    if (!name.trim()) return toast.error("Formulation name is required");
    const ingredients = rows
      .filter((r) => r.particulars.trim())
      .map((r, i) => ({
        slNo: i + 1,
        particulars: r.particulars.trim(),
        uom: r.uom.trim() || "KGS",
        qty: Number(r.qty) || 0,
      }));
    if (!ingredients.length) return toast.error("Add at least one ingredient");

    try {
      await upsert.mutateAsync({
        ...(formulation ? { id: formulation.id } : {}),
        name: name.trim(),
        slug: formulation ? formulation.slug : slugify(name),
        category: category.trim() || "General",
        description: description.trim(),
        base_yield: Number(baseYield) || 10,
        ingredients,
        cost_per_500ml_bottle: bottle500 === "" ? null : Number(bottle500),
        cost_per_1l_bottle: bottle1L === "" ? null : Number(bottle1L),
        cost_per_5l_bottle: bottle5L === "" ? null : Number(bottle5L),
        method_of_preparation: method.split("\n").map((s) => s.trim()).filter(Boolean),
      });
      toast.success(formulation ? "Formulation updated" : "Formulation created");
      onClose();
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{formulation ? "Edit Formulation" : "Add Formulation"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <Label>Base Yield</Label>
              <Input type="number" value={baseYield} onChange={(e) => setBaseYield(e.target.value)} />
            </div>
            <div>
              <Label>500 ML Bottle ₹</Label>
              <Input type="number" value={bottle500} onChange={(e) => setBottle500(e.target.value)} />
            </div>
            <div>
              <Label>1 Ltr Bottle ₹</Label>
              <Input type="number" value={bottle1L} onChange={(e) => setBottle1L(e.target.value)} />
            </div>
            <div>
              <Label>5 Ltr Bottle ₹</Label>
              <Input type="number" value={bottle5L} onChange={(e) => setBottle5L(e.target.value)} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Ingredients</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => setRows([...rows, { ...emptyRow }])}>
                <Plus className="h-4 w-4 mr-1" /> Add Row
              </Button>
            </div>
            <div className="space-y-2">
              {rows.map((row, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Input
                      list="chemical-options"
                      placeholder="Chemical / Particulars"
                      value={row.particulars}
                      onChange={(e) => updateRow(index, { particulars: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input placeholder="UOM" value={row.uom} onChange={(e) => updateRow(index, { uom: e.target.value })} />
                  </div>
                  <div className="col-span-2">
                    <Input type="number" placeholder="Qty" value={row.qty} onChange={(e) => updateRow(index, { qty: e.target.value })} />
                  </div>
                  <div className="col-span-3 flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={index === 0}
                      onClick={() => moveRow(index, -1)}
                    >
                      <ArrowUp className="h-4 w-4 text-slate-600" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={index === rows.length - 1}
                      onClick={() => moveRow(index, 1)}
                    >
                      <ArrowDown className="h-4 w-4 text-slate-600" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setRows(rows.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
              <datalist id="chemical-options">
                {chemicals.map((c) => (
                  <option key={c.id} value={c.chemical} />
                ))}
              </datalist>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Rates are pulled automatically from Chemical Prices.
            </p>
          </div>

          <div>
            <Label>Method of Preparation (one step per line)</Label>
            <Textarea rows={5} value={method} onChange={(e) => setMethod(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={upsert.isPending}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormulationModal;

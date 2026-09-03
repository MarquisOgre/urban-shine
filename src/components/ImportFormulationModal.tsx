import { useState } from "react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useUpsertRow, slugify } from "@/hooks/useCloudData";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const DUMMY_FORMULATION = `{
  "name": "Dish Wash Liquid",
  "category": "Household Cleaners",
  "description": "Concentrated dish washing liquid",
  "baseYield": 10,
  "costPer500MLBottle": 10.55,
  "costPer1LBottle": 14.25,
  "costPer5LBottle": 45,
  "ingredients": [
    { "slNo": 1, "particulars": "Water", "uom": "LTR", "qty": 8 },
    { "slNo": 2, "particulars": "SLES (Sodium Lauryl Ether Sulfate)", "uom": "KGS", "qty": 1.2 },
    { "slNo": 3, "particulars": "Acid Slurry", "uom": "KGS", "qty": 0.5 },
    { "slNo": 4, "particulars": "Color", "uom": "GMS", "qty": 2 }
  ],
  "methodOfPreparation": [
    "Take water in a clean vessel",
    "Add SLES slowly and stir until dissolved",
    "Add remaining chemicals one by one and mix well"
  ]
}`;

const PROMPT = `Give me a cleaning product formulation as RAW JSON ONLY (no markdown, no explanation), exactly in this format:\n\n${DUMMY_FORMULATION}`;

const ImportFormulationModal = ({ open, onClose }: Props) => {
  const upsert = useUpsertRow("formulations");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleImport = async () => {
    let parsed: any;
    try {
      const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return toast.error("Invalid JSON — paste the raw JSON from ChatGPT");
    }

    const items = Array.isArray(parsed) ? parsed : [parsed];
    const rows = [];
    for (const f of items) {
      if (!f?.name || !Array.isArray(f?.ingredients) || !f.ingredients.length) {
        return toast.error("Each formulation needs a name and at least one ingredient");
      }
      rows.push({
        name: String(f.name).trim(),
        slug: slugify(String(f.name)),
        category: String(f.category ?? "General").trim(),
        description: String(f.description ?? "").trim(),
        base_yield: Number(f.baseYield) || 10,
        ingredients: f.ingredients.map((ing: any, i: number) => ({
          slNo: Number(ing.slNo) || i + 1,
          particulars: String(ing.particulars ?? "").trim(),
          uom: String(ing.uom ?? "KGS").trim(),
          qty: Number(ing.qty) || 0,
        })),
        cost_per_500ml_bottle: f.costPer500MLBottle == null ? null : Number(f.costPer500MLBottle),
        cost_per_1l_bottle: f.costPer1LBottle == null ? null : Number(f.costPer1LBottle),
        cost_per_5l_bottle: f.costPer5LBottle == null ? null : Number(f.costPer5LBottle),
        method_of_preparation: Array.isArray(f.methodOfPreparation)
          ? f.methodOfPreparation.map((s: any) => String(s).trim()).filter(Boolean)
          : [],
      });
    }

    setSaving(true);
    try {
      for (const row of rows) await upsert.mutateAsync(row);
      toast.success(`Imported ${rows.length} formulation${rows.length > 1 ? "s" : ""}`);
      setText("");
      onClose();
    } catch (e: any) {
      toast.error(e.message ?? "Import failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Formulation from ChatGPT</DialogTitle>
          <DialogDescription>
            Copy the sample format below, ask ChatGPT for the formulation in that exact
            JSON format, then paste the result here. A JSON array of formulations also works.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Dummy format</span>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => copy(DUMMY_FORMULATION, "Sample JSON")}>
                <Copy className="h-3.5 w-3.5" /> Copy JSON
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => copy(PROMPT, "ChatGPT prompt")}>
                <Copy className="h-3.5 w-3.5" /> Copy ChatGPT prompt
              </Button>
            </div>
            <pre className="max-h-56 overflow-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
{DUMMY_FORMULATION}
            </pre>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Paste JSON here</span>
            <Textarea
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='{ "name": "...", "ingredients": [ ... ] }'
              className="font-mono text-xs"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleImport} disabled={saving}>
            {saving ? "Importing…" : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportFormulationModal;

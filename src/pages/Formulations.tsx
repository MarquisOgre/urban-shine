import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Beaker, Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormulationModal from "@/components/FormulationModal";
import { useAuth } from "@/contexts/AuthContext";
import { useFormulations, useDeleteRow } from "@/hooks/useCloudData";
import type { FormulationData } from "@/data/types";
import { getTelugu } from "@/data/teluguTranslations";
import { ensureTeluguBrowserFont, renderTeluguToPng } from "@/lib/teluguTextImage";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const loadLogoDataUrl = async (): Promise<string | null> => {
  try {
    const res = await fetch('/Logo.png');
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

const Formulations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useFormulations();
  const removeFormulation = useDeleteRow("formulations");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FormulationData | null>(null);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const formulations = useMemo(
    () => [...(data ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    [data]
  );

  useEffect(() => {
    setSelectedIds(formulations.map((f) => f.id));
  }, [formulations]);

  const handleDelete = async (id: string) => {
    try {
      await removeFormulation.mutateAsync(id);
      toast.success("Formulation removed");
    } catch (e: any) {
      toast.error(e.message ?? "Delete failed");
    }
  };


  const buildPDF = async (): Promise<jsPDF> => {
    const doc = new jsPDF('p', 'mm', 'a4');
    await ensureTeluguBrowserFont();
    const logoDataUrl = await loadLogoDataUrl();

    const pageW = 210;
    const pageH = 297;
    const marginX = 8;
    const halfH = pageH / 2;

    // Brand palette — refined for the card-framed halves
    const ACCENT: [number, number, number] = [31, 68, 182];
    const ACCENT_SOFT: [number, number, number] = [239, 244, 255];
    const INK: [number, number, number] = [30, 41, 59];
    const MUTED: [number, number, number] = [100, 116, 139];
    const LINE: [number, number, number] = [225, 231, 240];
    const ZEBRA: [number, number, number] = [249, 251, 254];
    const FINAL: [number, number, number] = [200, 30, 30];
    const SELL: [number, number, number] = [22, 128, 60];

    const ADDRESS = 'Flat No. 202, RK Residency, Haritha Royal City Colony, Ravalkole, Medchal - 501401';

    const drawSlotHeader = (slotTop: number) => {
      const headerH = 30;
      const centerY = slotTop + headerH / 2;
      // Logo — auto-scale keeping aspect ratio, height-capped
      if (logoDataUrl) {
        try {
          const props = (doc as any).getImageProperties(logoDataUrl);
          const targetH = 16;
          const ratio = props.width / props.height;
          const targetW = Math.min(44, targetH * ratio);
          const finalH = targetW / ratio;
          doc.addImage(
            logoDataUrl,
            'PNG',
            pageW / 2 - targetW / 2,
            centerY - finalH / 2 - 2,
            targetW,
            finalH,
          );
        } catch {}
      }
      doc.setFont(undefined, 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...MUTED);
      const lines = doc.splitTextToSize(ADDRESS, pageW - marginX * 2 - 8);
      const startY = slotTop + headerH - 4 - (lines.length - 1) * 3.2;
      lines.forEach((ln: string, i: number) => {
        doc.text(ln, pageW / 2, startY + i * 3.4, { align: 'center' });
      });
      doc.setTextColor(...INK);
    };

    const formatINR = (n: number) =>
      `Rs. ${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Sort into Big/Small pairs so summary panel never overlaps table
    const enriched = formulations as any[];


    const BIG_THRESHOLD = 8;
    const bigs = enriched.filter(f => (f.ingredients?.length ?? 0) >= BIG_THRESHOLD);
    const smalls = enriched.filter(f => (f.ingredients?.length ?? 0) < BIG_THRESHOLD);
    const ordered: any[] = [];
    while (bigs.length || smalls.length) {
      if (bigs.length) ordered.push(bigs.shift());
      if (smalls.length) ordered.push(smalls.shift());
    }

    const TELUGU_COL = 2;

    ordered.forEach((formulation, index) => {
      const slotIndex = index % 2;
      if (index > 0 && slotIndex === 0) {
        doc.addPage();
      }
      const slotTop = slotIndex === 0 ? 0 : halfH;

      // Card frame around each half
      const frameX = marginX;
      const frameY = slotTop + 3;
      const frameW = pageW - marginX * 2;
      const frameH = halfH - 6;
      doc.setDrawColor(...ACCENT);
      doc.setLineWidth(0.5);
      doc.roundedRect(frameX, frameY, frameW, frameH, 3, 3);

      // Half-page divider between the two slots
      if (slotIndex === 1) {
        doc.setDrawColor(...LINE);
        doc.setLineWidth(0.2);
        doc.line(marginX + 4, halfH, pageW - marginX - 4, halfH);
      }

      drawSlotHeader(slotTop);

      // Title bar
      const titleBarY = slotTop + 32;
      const titleBarH = 10;
      doc.setFillColor(...ACCENT);
      doc.rect(frameX, titleBarY, frameW, titleBarH, 'F');
      doc.setFont(undefined, 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text(formulation.name.toUpperCase(), pageW / 2, titleBarY + titleBarH / 2 + 1.8, { align: 'center' });
      doc.setTextColor(...INK);

      let yPosition = titleBarY + titleBarH + 3;

      const totalCost = formulation.ingredients?.reduce((sum: number, ing: any) => sum + parseFloat(ing.amount.toFixed(2)), 0) || 0;
      const baseYield = formulation.baseYield || 10;
      const costPerLiter = totalCost / baseYield;
      const costPer500ML = costPerLiter * 0.5;
      const costPer1L = costPerLiter;
      const bottle500MLCost = formulation.costPer500MLBottle || 10.55;
      const bottle1LCost = formulation.costPer1LBottle || 0;
      const totalCostPer500MLBottle = costPer500ML + bottle500MLCost;
      const totalCostPer1LBottle = costPer1L + bottle1LCost;

      const teluguByRow: string[] = [];
      const tableData = formulation.ingredients?.map((ing: any, idx: number) => {
        teluguByRow[idx] = getTelugu(ing.particulars) ?? '';
        return [
          ing.slNo,
          ing.particulars,
          '',
          ing.uom,
          parseFloat(ing.qty.toFixed(2)),
          parseFloat(ing.rate.toFixed(2)),
          parseFloat(ing.amount.toFixed(2))
        ];
      }) || [];

      // Horizontal summary panel: two rows (headers + values), full frame width
      const summaryH = 14;
      const slotBottomLimit = slotTop + halfH - 6;
      const tableBottomLimit = slotBottomLimit - summaryH - 3;

      // Fixed, consistent typography across all formulations
      const fontSize = 9;
      const rowH = 5.2;
      const padY = 1.2;

      autoTable(doc, {
        startY: yPosition,
        head: [['SL', 'PARTICULARS', 'PARTICULARS (TELUGU)', 'UOM', 'QTY', 'RATE', 'AMT']],
        body: tableData,
        theme: 'grid',
        styles: {
          fontSize,
          cellPadding: { top: padY, right: 2.4, bottom: padY, left: 2.4 },
          minCellHeight: rowH,
          textColor: INK,
          lineColor: LINE,
          lineWidth: 0.15,
          valign: 'middle',
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: ACCENT,
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 9.5,
          halign: 'center',
          cellPadding: { top: 2, right: 2.4, bottom: 2, left: 2.4 },
        },
        alternateRowStyles: { fillColor: ZEBRA },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 },
          1: { cellWidth: 55, fontStyle: 'bold' },
          2: { cellWidth: 52 },
          3: { halign: 'center', cellWidth: 14 },
          4: { halign: 'center', cellWidth: 15 },
          5: { halign: 'right', cellWidth: 17 },
          6: { halign: 'right', cellWidth: 20, fontStyle: 'bold' }
        },
        margin: { left: marginX + 2, right: marginX + 2, top: yPosition, bottom: pageH - tableBottomLimit },
        pageBreak: 'avoid',
        rowPageBreak: 'avoid',
        didDrawCell: (data) => {
          if (data.section !== 'body' || data.column.index !== TELUGU_COL) return;
          const text = teluguByRow[data.row.index];
          if (!text) return;
          const img = renderTeluguToPng(text, 44, true);
          if (!img) return;
          const cell = data.cell;
          const padX = 1.8;
          const padYImg = 0.6;
          const maxW = cell.width - padX * 2;
          const maxH = cell.height - padYImg * 2;
          const ratio = img.width / img.height;
          let h = maxH;
          let w = h * ratio;
          if (w > maxW) { w = maxW; h = w / ratio; }
          const x = cell.x + padX;
          const y = cell.y + (cell.height - h) / 2;
          try { doc.addImage(img.dataUrl, 'PNG', x, y, w, h); } catch {}
        }
      });

      // Horizontal cost summary — full-width table with headers on top, values below
      const summaryX = frameX + 2;
      const summaryW = frameW - 4;
      const summaryY = slotBottomLimit - summaryH;
      const headerH = 5.6;
      const valueH = summaryH - headerH;

      const cols = [
        { label: 'Cost / 500 ML', value: formatINR(costPer500ML), color: INK },
        { label: 'Bottle 500 ML', value: formatINR(bottle500MLCost), color: INK },
        { label: 'Total / 500 ML', value: formatINR(totalCostPer500MLBottle), color: FINAL },
        { label: 'Cost / 1 Ltr', value: formatINR(costPer1L), color: INK },
        { label: 'Bottle 1 Ltr', value: formatINR(bottle1LCost), color: INK },
        { label: 'Total / 1 Ltr', value: formatINR(totalCostPer1LBottle), color: SELL },
      ];
      const colW = summaryW / cols.length;

      // Outer panel border
      doc.setDrawColor(...LINE);
      doc.setLineWidth(0.2);
      doc.roundedRect(summaryX, summaryY, summaryW, summaryH, 1.5, 1.5, 'S');

      // Header bar
      doc.setFillColor(...ACCENT);
      doc.rect(summaryX, summaryY, summaryW, headerH, 'F');
      // Values row background
      doc.setFillColor(...ACCENT_SOFT);
      doc.rect(summaryX, summaryY + headerH, summaryW, valueH, 'F');

      cols.forEach((c, i) => {
        const cx = summaryX + colW * i;
        // Column divider
        if (i > 0) {
          doc.setDrawColor(...LINE);
          doc.setLineWidth(0.15);
          doc.line(cx, summaryY, cx, summaryY + summaryH);
        }
        // Header text
        doc.setFont(undefined, 'bold');
        doc.setFontSize(7.8);
        doc.setTextColor(255, 255, 255);
        doc.text(c.label, cx + colW / 2, summaryY + headerH / 2 + 1.4, { align: 'center' });
        // Value text
        const isGrand = c.color === FINAL || c.color === SELL;
        doc.setFont(undefined, isGrand ? 'bold' : 'normal');
        doc.setFontSize(isGrand ? 10 : 9);
        doc.setTextColor(...c.color);
        doc.text(c.value, cx + colW / 2, summaryY + headerH + valueH / 2 + 1.6, { align: 'center' });
      });
      doc.setTextColor(...INK);
    });

    return doc;
  };

  const exportToPDF = async () => {
    const doc = await buildPDF();
    doc.save('Formulations.pdf');
  };





  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="py-6 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Actions (Top Right)*/}
          <div className="flex justify-end gap-2 mb-6 sm:mb-8">
            {user && (
              <Button onClick={() => { setEditing(null); setModalOpen(true); }} className="gap-2">
                <Plus className="h-4 w-4" /> Add Formulation
              </Button>
            )}
            <Button
              onClick={exportToPDF}
              variant="outline"
              className="whitespace-nowrap"
              title="Export all formulations to PDF"
            >
              Export PDF
            </Button>
          </div>

          {/* Title + Description Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-3 sm:mb-4">
              Professional Cleaning Formulations
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto px-4">
              Comprehensive cleaning formulation management system
            </p>
          </div>

          {isLoading ? (
            <p className="text-center text-slate-500">Loading formulations…</p>
          ) : (
            <div
              id="formulations"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8 sm:mb-10"
            >
              {formulations.map((formulation) => (
                <Card
                  key={formulation.id}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border hover:border-blue-300"
                  onClick={() => navigate(`/formulation/${formulation.slug}`)}
                >
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="bg-blue-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-300">
                      <Beaker className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors text-sm">
                      {formulation.name}
                    </h3>
                    {user && (
                      <div className="flex justify-center gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setEditing(formulation); setModalOpen(true); }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(formulation.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <FormulationModal
            open={modalOpen}
            formulation={editing}
            onClose={() => { setModalOpen(false); setEditing(null); }}
          />

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Formulations;
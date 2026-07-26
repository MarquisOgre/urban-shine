import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Beaker, 
  Droplets, 
  Sparkles, 
  SprayCanIcon, 
  Home, 
  Utensils, 
  Shirt, 
  Bath, 
  Shield, 
  Leaf, 
  FlaskConical, 
  DollarSign,
  Package,
  Calculator,
  FileDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getFormulationBySlug } from "@/data/formulations";
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

  const formulations = [
    { id: 1, name: "Phenyl", slug: "phenyl", icon: Droplets, color: "bg-blue-500", description: "Disinfecting floor cleaner" },
    { id: 2, name: "Dish Wash Liquid", slug: "dish-wash-liquid", icon: Utensils, color: "bg-green-500", description: "Grease cutting formula" },
    { id: 3, name: "Copper Cleaning Liquid", slug: "copper-cleaning-liquid", icon: Sparkles, color: "bg-amber-500", description: "Metal surface cleaner" },
    { id: 4, name: "Toilet Cleaner", slug: "toilet-cleaner", icon: Bath, color: "bg-cyan-500", description: "Bathroom disinfectant" },
    { id: 5, name: "Acid", slug: "acid", icon: FlaskConical, color: "bg-red-500", description: "Industrial strength acid" },
    { id: 6, name: "Hand Wash Liquid", slug: "hand-wash-liquid", icon: SprayCanIcon, color: "bg-purple-500", description: "Gentle hand cleanser" },
    { id: 7, name: "Liquid Detergent", slug: "liquid-detergent", icon: Droplets, color: "bg-teal-500", description: "Liquid laundry formula" },
    { id: 8, name: "Floor Cleaning Liquid", slug: "floor-cleaning-liquid", icon: Home, color: "bg-slate-600", description: "All floor types cleaner" },
    { id: 9, name: "Detergent Powder", slug: "detergent-powder", icon: Shirt, color: "bg-indigo-500", description: "Laundry washing powder" },    
    { id: 10, name: "Rose Water", slug: "rose-water", icon: Leaf, color: "bg-pink-500", description: "Natural rose essence" },
    { id: 11, name: "Pain Relief Balm", slug: "pain-relief-balm", icon: Shield, color: "bg-orange-500", description: "Zandu Balm formula" },
    { id: 12, name: "White Petroleum Jelly", slug: "white-petroleum-jelly", icon: Beaker, color: "bg-gray-500", description: "Vaseline formula" },
    { id: 13, name: "Product Prices", slug: "product-prices", icon: DollarSign, color: "bg-emerald-600", description: "View all product prices" },
    { id: 14, name: "Packing Materials Cost", slug: "packing-materials", icon: Package, color: "bg-violet-600", description: "Bottle and packaging costs" },
    { id: 15, name: "Chemical Prices", slug: "chemical-prices", icon: Calculator, color: "bg-lime-600", description: "Raw material pricing" }
  ];

  const handleFormulationClick = (formulation: typeof formulations[0]) => {
    console.log(`Navigating to ${formulation.name} formulation`);
    
    // Handle special pages
    if (formulation.id === 13) {
      navigate('/product-prices');
      return;
    }
    if (formulation.id === 14) {
      navigate('/packing-materials');
      return;
    }
    if (formulation.id === 15) {
      navigate('/chemical-prices');
      return;
    }
    
    // Regular formulation pages - now using slug instead of ID
    navigate(`/formulation/${formulation.slug}`);
  };

  const exportToPDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    await ensureTeluguBrowserFont();
    const logoDataUrl = await loadLogoDataUrl();

    const pageW = 210;
    const pageH = 297;
    const marginX = 10;
    const halfH = pageH / 2;

    const drawSlotHeader = (slotTop: number) => {
      if (logoDataUrl) {
        try { doc.addImage(logoDataUrl, 'PNG', pageW / 2 - 15, slotTop + 3, 30, 15); } catch {}
      }
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.text('FLAT NO - 202, RK RESIDENCY, HARITHA ROYAL CITY COLONY, RAVALKOLE, MEDCHAL - 501401', pageW / 2, slotTop + 22, { align: 'center' });
    };

    const allFormulationsData = formulations
      .filter(f => f.id <= 12)
      .map(f => {
        const formData = getFormulationBySlug(f.slug);
        return formData ? { ...f, ...formData } : null;
      })
      .filter(Boolean);

    const TELUGU_COL = 2;

    allFormulationsData.forEach((formulation, index) => {
      const slotIndex = index % 2;
      if (index > 0 && slotIndex === 0) {
        doc.addPage();
      }
      const slotTop = slotIndex === 0 ? 0 : halfH;

      if (slotIndex === 1) {
        doc.setDrawColor(180);
        doc.setLineWidth(0.2);
        doc.line(marginX, halfH, pageW - marginX, halfH);
      }

      drawSlotHeader(slotTop);
      let yPosition = slotTop + 28;

      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text(formulation.name, pageW / 2, yPosition, { align: 'center' });
      yPosition += 3;

      const totalCost = formulation.ingredients?.reduce((sum, ing) => sum + parseFloat(ing.amount.toFixed(2)), 0) || 0;
      const baseYield = formulation.baseYield || 10;
      const costPerLiter = totalCost / baseYield;
      const costPer500ML = costPerLiter * 0.5;
      const costPer1L = costPerLiter;
      const bottle500MLCost = formulation.costPer500MLBottle || 10.55;
      const bottle1LCost = formulation.costPer1LBottle || 0;
      const totalCostPer500MLBottle = costPer500ML + bottle500MLCost;
      const totalCostPer1LBottle = costPer1L + bottle1LCost;

      const teluguByRow: string[] = [];
      const tableData = formulation.ingredients?.map((ing, idx) => {
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

      const slotBottomLimit = slotTop + halfH - 4;

      autoTable(doc, {
        startY: yPosition,
        head: [['SL', 'PARTICULARS', 'PARTICULARS (TELUGU)', 'UOM', 'QTY', 'RATE', 'AMT']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 1.2, minCellHeight: 5 },
        headStyles: { fillColor: [31, 68, 182], textColor: 255, fontStyle: 'bold', fontSize: 9 },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 },
          1: { cellWidth: 55 },
          2: { cellWidth: 50 },
          3: { halign: 'center', cellWidth: 15 },
          4: { halign: 'center', cellWidth: 15 },
          5: { halign: 'right', cellWidth: 17 },
          6: { halign: 'right', cellWidth: 18 }
        },
        margin: { left: marginX, right: marginX, bottom: pageH - slotBottomLimit },
        pageBreak: 'avoid',
        didDrawCell: (data) => {
          if (data.section !== 'body' || data.column.index !== TELUGU_COL) return;
          const text = teluguByRow[data.row.index];
          if (!text) return;
          const img = renderTeluguToPng(text, 40, true);
          if (!img) return;
          const cell = data.cell;
          const padX = 1.5;
          const padY = 0.5;
          const maxW = cell.width - padX * 2;
          const maxH = cell.height - padY * 2;
          const ratio = img.width / img.height;
          let h = maxH;
          let w = h * ratio;
          if (w > maxW) { w = maxW; h = w / ratio; }
          const x = cell.x + padX;
          const y = cell.y + (cell.height - h) / 2;
          try { doc.addImage(img.dataUrl, 'PNG', x, y, w, h); } catch {}
        }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 1;

      autoTable(doc, {
        startY: yPosition,
        body: [
          ['Cost / 500 ML Bottle', costPer500ML.toFixed(2), bottle500MLCost.toFixed(2), totalCostPer500MLBottle.toFixed(2)],
          ['Cost / 1 Ltr Bottle', costPer1L.toFixed(2), bottle1LCost.toFixed(2), totalCostPer1LBottle.toFixed(2)],
        ],
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 1.2 },
        columnStyles: {
          0: { cellWidth: 65, fontStyle: 'bold' },
          1: { cellWidth: 55, halign: 'center', fontStyle: 'bold' },
          2: { cellWidth: 30, halign: 'center' },
          3: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: marginX, right: marginX, bottom: pageH - slotBottomLimit },
        pageBreak: 'avoid',
      });
    });

    doc.save('Formulations.pdf');
  };





  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="py-6 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section & Export Button (Top Right)*/}
          <div className="flex justify-end gap-2 mb-6 sm:mb-8">
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

          {/* Dashboard Grid - Changed from 3x5 to 5x3 */}
          <div
            id="formulations"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8 sm:mb-10 max-h-[720px] overflow-y-auto pr-1"
          >
            {formulations.map((formulation) => {
              const IconComponent = formulation.icon;
              return (
                <Card
                  key={formulation.id}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border hover:border-blue-300"
                  onClick={() => handleFormulationClick(formulation)}
                >
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div
                      className={`${formulation.color} w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-300`}
                    >
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors text-sm">
                      {formulation.name}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Card className="text-center p-4 sm:p-6 bg-white/70 backdrop-blur-sm">
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">12+</h3>
              <p className="text-slate-600 text-sm sm:text-base">Product Formulations</p>
            </Card>
            <Card className="text-center p-4 sm:p-6 bg-white/70 backdrop-blur-sm">
              <h3 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">15</h3>
              <p className="text-slate-600 text-sm sm:text-base">Dashboard Categories</p>
            </Card>
            <Card className="text-center p-4 sm:p-6 bg-white/70 backdrop-blur-sm">
              <h3 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">99.9%</h3>
              <p className="text-slate-600 text-sm sm:text-base">Efficacy Rate</p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Formulations;
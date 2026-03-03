import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { productPricesData, packingMaterialsData, chemicalPrices } from "@/data/pricingData";

const ProductPrices = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="py-8 px-6">
        <div className="max-w-[1900px] mx-auto">
          {/* Header Section */}
          <div className="relative mb-10">
            <h1 className="text-3xl font-bold text-slate-800 text-center">
              All Prices
            </h1>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>

         {/* ===== Product Prices ===== */}
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Product Prices
          </h2>

          <div className="max-w-[1800px] mx-auto px-8 mb-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
              {productPricesData.map((product) => {
                const bulkPrice = product.bulkPrice100Gms ?? product.bulkPrice5Ltr;
                const bulkLabel = product.bulkPrice100Gms
                  ? "100Gms Bulk Price"
                  : "5 Ltr Price Bulk";

                return (
                  <Card
                    key={product.id}
                    className="w-full max-w-[520px] flex items-center bg-white rounded-2xl p-8 transition-all hover:shadow-xl"
                    style={{
                      boxShadow:
                        "inset 6px 0 0 0 #1F44B6, 0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  >
                    {/* Product Name */}
                    <div className="flex-1">
                      <span className="font-semibold text-slate-800 text-lg">
                        {product.product}
                      </span>
                    </div>

                    {/* Right Side Columns */}
                    <div className="flex items-center gap-10 ml-auto">
                      <div className="text-center">
                        <div className="text-xs text-slate-500">UOM</div>
                        <div className="font-medium text-slate-700 text-sm">
                          {product.uom}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-xs text-slate-500">Retail Price</div>
                        <div className="font-bold text-yellow-700 text-lg">
                          ₹ {product.retailPrice}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-xs text-slate-500">{bulkLabel}</div>
                        <div className="font-bold text-green-700 text-lg">
                          ₹ {bulkPrice}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>


          {/* ===== Packing Material Prices ===== */}
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Packing Bottles Prices
          </h2>

          <div className="max-w-[1800px] mx-auto px-8 mb-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {packingMaterialsData.map((material) => (
                <Card
                  key={material.id}
                  className="w-full max-w-[520px] p-4 flex items-center bg-white rounded-2xl transition-all hover:shadow-lg"
                  style={{
                    boxShadow:
                      "inset 6px 0 0 0 #1F44B6, 0 4px 10px rgba(0,0,0,0.08)",
                  }}
                >
                  <span className="font-semibold text-slate-800 truncate">
                    {material.product}
                  </span>

                  <div className="flex items-center gap-8 ml-auto">
                    <span className="text-slate-600 text-sm whitespace-nowrap">
                      UOM: {material.minimumOrder}
                    </span>
                    <span className="font-bold text-yellow-700 text-lg whitespace-nowrap">
                      ₹ {material.retailPrice}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>


          {/* ===== Chemical Prices ===== */}
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Chemical Prices
          </h2>

          <div className="max-w-[1800px] mx-auto px-8 mb-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {chemicalPrices.map((chemical) => (
                <Card
                  key={chemical.id}
                  className="w-full max-w-[520px] p-4 flex items-center bg-white rounded-2xl transition-all hover:shadow-lg"
                  style={{
                    boxShadow:
                      "inset 6px 0 0 0 #1F44B6, 0 4px 10px rgba(0,0,0,0.08)",
                  }}
                >
                  <span className="font-semibold text-slate-800 truncate">
                    {chemical.chemical}
                  </span>

                  <div className="flex items-center gap-8 ml-auto">
                    <span className="text-slate-600 text-sm whitespace-nowrap">
                      UOM: {chemical.uom}
                    </span>
                    <span className="font-bold text-yellow-700 text-lg whitespace-nowrap">
                      ₹ {chemical.rate}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPrices;

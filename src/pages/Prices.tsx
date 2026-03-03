import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formulationsData } from "@/data/formulations";

const Prices = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFormulations = formulationsData.filter((formulation) =>
    formulation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="py-6 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Product Prices
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              View 1 L pricing for all formulations
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-2xl text-slate-800">
                  Product Prices
                </CardTitle>
                <div className="relative flex-1 sm:w-64 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search formulations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredFormulations.map((formulation) => (
                  <Card
                    key={formulation.id}
                    className="border border-slate-200 shadow-sm"
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 truncate pr-2">
                        {formulation.name}
                      </span>
                      <span className="text-base font-semibold text-blue-700">
                        ₹
                        {formulation.costPer1L > 0
                          ? formulation.costPer1L.toFixed(2)
                          : "-"}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Prices;

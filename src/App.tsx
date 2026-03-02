import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Formulations from "./pages/Formulations";
import FormulationDetail from "./pages/FormulationDetail";
import ProductPrices from "./pages/ProductPrices";
import PackingMaterials from "./pages/PackingMaterials";
import ChemicalPrices from "./pages/ChemicalPrices";
import IndentSheet from "./pages/IndentSheet";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Prices from "./pages/Prices";
import Invoice from "./pages/Invoice";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Formulations />} />
            <Route path="/formulations" element={<Formulations />} />
            <Route path="/formulation/:slug" element={<FormulationDetail />} />
            <Route path="/indent-sheet" element={<IndentSheet />} />
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route path="/invoice" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
            <Route path="/prices" element={<ProtectedRoute><Prices /></ProtectedRoute>} />
            <Route path="/product-prices" element={<ProtectedRoute><ProductPrices /></ProtectedRoute>} />
            <Route path="/packing-materials" element={<ProtectedRoute><PackingMaterials /></ProtectedRoute>} />
            <Route path="/chemical-prices" element={<ProtectedRoute><ChemicalPrices /></ProtectedRoute>} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

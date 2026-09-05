import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const StoreHeader = () => {
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/Logo.png" alt="UltraShine" className="h-9 w-auto object-contain" />
          <span className="font-extrabold tracking-tight text-slate-900 text-lg sm:text-xl">
            Ultra<span className="text-blue-600">Shine</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Home
          </Link>
          <a href="/#products" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Shop
          </a>
          <button
            onClick={() => navigate("/cart")}
            className="relative inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-slate-900 text-[11px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default StoreHeader;

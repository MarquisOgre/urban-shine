import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

const StoreFooter = () => (
  <footer className="mt-16 bg-slate-900 text-slate-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3">
      <div>
        <div className="flex items-center gap-2">
          <img src="/Logo.png" alt="UltraShine" className="h-9 w-auto bg-white rounded-md p-1" />
          <span className="font-extrabold text-white text-lg">UltraShine</span>
        </div>
        <p className="mt-3 text-sm text-slate-400">
          Home, kitchen and personal care essentials made in small batches with
          honest ingredients and honest pricing.
        </p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Shop</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="/#products" className="hover:text-white">All Products</a></li>
          <li><Link to="/cart" className="hover:text-white">Your Cart</Link></li>
          <li><Link to="/checkout" className="hover:text-white">Guest Checkout</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Help</h4>
        <ul className="space-y-2 text-sm">
          <li>Delivery in 3-5 working days</li>
          <li>UPI payment on checkout</li>
          <li>
            <Link to="/login" className="inline-flex items-center gap-1 hover:text-white">
              <Lock className="h-3.5 w-3.5" /> Staff login
            </Link>
          </li>
        </ul>
      </div>
    </div>
    <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
      © 2026 UltraShine. Crafted with ❤️ by Dexorzo Creations.
    </div>
  </footer>
);

export default StoreFooter;

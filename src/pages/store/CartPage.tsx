import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import { useCart } from "@/contexts/CartContext";
import { getProductImage } from "@/data/productImages";
import { FREE_SHIPPING_ABOVE, SHIPPING_FEE } from "@/config/store";

const CartPage = () => {
  const { items, setQty, removeItem, subtotal } = useCart();
  const navigate = useNavigate();
  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;

  return (
    <div className="min-h-screen bg-slate-50">
      <StoreHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Your Cart</h1>

        {items.length === 0 ? (
          <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <ShoppingBag className="h-10 w-10 mx-auto text-slate-300" />
            <p className="mt-4 text-slate-600">Your cart is empty.</p>
            <Link
              to="/"
              className="mt-6 inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.slug}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 items-center"
                >
                  <img
                    src={getProductImage(item.slug)}
                    alt={item.name}
                    loading="lazy"
                    className="h-20 w-20 rounded-xl object-cover bg-slate-50"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.uom}</p>
                    <p className="text-sm font-bold text-slate-900 mt-1">₹{item.price}</p>
                  </div>
                  <div className="flex items-center border border-slate-300 rounded-lg">
                    <button onClick={() => setQty(item.slug, item.qty - 1)} className="p-2" aria-label="Decrease">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                    <button onClick={() => setQty(item.slug, item.qty + 1)} className="p-2" aria-label="Increase">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.slug)}
                    className="text-slate-400 hover:text-red-600 p-2"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <aside className="bg-white border border-slate-200 rounded-2xl p-6 h-fit">
              <h2 className="font-bold text-slate-900">Order Summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Subtotal</dt>
                  <dd className="font-semibold">₹{subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Shipping</dt>
                  <dd className="font-semibold">{shipping === 0 ? "Free" : `₹${shipping}`}</dd>
                </div>
                <div className="flex justify-between border-t pt-3 text-base">
                  <dt className="font-bold">Total</dt>
                  <dd className="font-extrabold">₹{(subtotal + shipping).toFixed(2)}</dd>
                </div>
              </dl>
              {subtotal < FREE_SHIPPING_ABOVE && (
                <p className="mt-3 text-xs text-slate-500">
                  Add ₹{(FREE_SHIPPING_ABOVE - subtotal).toFixed(2)} more for free delivery.
                </p>
              )}
              <button
                onClick={() => navigate("/checkout")}
                className="mt-5 w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700"
              >
                Checkout as Guest
              </button>
              <Link to="/" className="mt-3 block text-center text-sm text-slate-500 hover:text-blue-600">
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </main>
      <StoreFooter />
    </div>
  );
};

export default CartPage;

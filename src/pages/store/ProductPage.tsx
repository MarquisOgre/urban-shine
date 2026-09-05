import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, ChevronLeft, Minus, Plus, ShoppingCart, Truck } from "lucide-react";
import { toast } from "sonner";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import ProductCard from "@/components/store/ProductCard";
import { getProductImage } from "@/data/productImages";
import { useStoreProduct } from "@/hooks/useStoreProducts";
import { useCart } from "@/contexts/CartContext";

const galleryViews = [
  { label: "Front", className: "object-cover" },
  { label: "Label", className: "object-cover scale-150 object-center" },
  { label: "Top", className: "object-cover scale-125 object-top" },
];

const ProductPage = () => {
  const { slug } = useParams();
  const { product, isLoading, all } = useStoreProduct(slug);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [view, setView] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <StoreHeader />
        <div className="max-w-7xl mx-auto px-4 py-20 text-slate-500">Loading product…</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <StoreHeader />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Product not found</h1>
          <Link to="/" className="text-blue-600 font-semibold mt-4 inline-block">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const image = getProductImage(product.slug);
  const related = (all ?? []).filter((p) => p.slug !== product.slug).slice(0, 4);

  const add = () => {
    addItem(
      { slug: product.slug, name: product.name, uom: product.uom, price: product.price },
      qty
    );
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <StoreHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600">
          <ChevronLeft className="h-4 w-4" /> Back to products
        </Link>

        <div className="mt-6 grid lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <div>
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <img
                src={image}
                alt={`${product.name} ${galleryViews[view].label} view`}
                width={1024}
                height={1024}
                className={`w-full aspect-square transition-transform duration-300 ${galleryViews[view].className}`}
              />
            </div>
            <div className="mt-4 flex gap-3">
              {galleryViews.map((g, i) => (
                <button
                  key={g.label}
                  onClick={() => setView(i)}
                  className={`h-20 w-20 rounded-xl overflow-hidden border-2 bg-white ${
                    view === i ? "border-blue-600" : "border-slate-200"
                  }`}
                  aria-label={`${g.label} view`}
                >
                  <img src={image} alt={`${product.name} ${g.label}`} loading="lazy" className={`h-full w-full ${g.className}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-900">{product.name}</h1>
            <p className="text-slate-500 mt-1">{product.tagline}</p>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900">₹{product.price}</span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span className="text-slate-400 line-through">₹{product.mrp}</span>
                  <span className="text-green-600 text-sm font-semibold">
                    Save ₹{product.mrp - product.price}
                  </span>
                </>
              )}
              <span className="text-sm text-slate-500">/ {product.uom}</span>
            </div>

            <p className="mt-5 text-slate-600 leading-relaxed">{product.description}</p>

            <ul className="mt-5 space-y-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-slate-300 rounded-xl bg-white">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3" aria-label="Decrease quantity">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(99, q + 1))} className="p-3" aria-label="Increase quantity">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={add}
                className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </button>
              <button
                onClick={() => {
                  add();
                  navigate("/checkout");
                }}
                className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Buy Now
              </button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
              <Truck className="h-4 w-4" /> Delivered in 3-5 working days across India
            </div>

            <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-bold text-slate-900">How to use</h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {product.usageInstructions}
              </p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-extrabold text-slate-900">You may also like</h2>
            <div className="grid gap-5 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <StoreFooter />
    </div>
  );
};

export default ProductPage;

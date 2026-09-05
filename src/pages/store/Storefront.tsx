import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, ShieldCheck, Truck, Sparkles, ArrowRight } from "lucide-react";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import ProductCard from "@/components/store/ProductCard";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { getProductImage } from "@/data/productImages";

const Storefront = () => {
  const { data: products, isLoading } = useStoreProducts();
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set((products ?? []).map((p) => p.category)))],
    [products]
  );

  const visible = (products ?? []).filter(
    (p) => category === "All" || p.category === category
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <StoreHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> 13 everyday essentials
            </span>
            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold leading-tight">
              Cleaning &amp; care products that actually work
            </h1>
            <p className="mt-4 text-blue-100 text-base sm:text-lg max-w-xl">
              Factory-fresh dishwash, floor cleaners, hand wash, detergents and
              personal care — delivered to your door at honest prices. No account
              needed, checkout as a guest.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#products"
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
              >
                Shop all products <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 border border-white/40 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                View cart
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["dish-wash", "hand-wash", "floor-cleaner", "copper-cleaning-liquid", "rose-water", "detergent-powder"].map(
              (slug, i) => (
                <img
                  key={slug}
                  src={getProductImage(slug)}
                  alt={slug.replace(/-/g, " ")}
                  width={1024}
                  height={1024}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="rounded-2xl bg-white/90 aspect-square object-cover shadow-lg"
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: "Fast delivery", text: "3-5 working days" },
            { icon: ShieldCheck, title: "Quality tested", text: "Every batch checked" },
            { icon: Leaf, title: "Skin friendly", text: "Balanced formulations" },
            { icon: Sparkles, title: "Guest checkout", text: "No sign-up needed" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="bg-blue-50 text-blue-600 rounded-xl p-2.5">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{title}</p>
                <p className="text-xs text-slate-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Our Products
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {products?.length ?? 0} products across home, kitchen and personal care.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  category === c
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-5 mt-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-white animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 mt-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <StoreFooter />
    </div>
  );
};

export default Storefront;

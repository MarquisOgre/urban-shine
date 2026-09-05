import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { getProductImage } from "@/data/productImages";
import { useCart } from "@/contexts/CartContext";
import type { StoreProduct } from "@/hooks/useStoreProducts";

const ProductCard = ({ product }: { product: StoreProduct }) => {
  const { addItem } = useCart();

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col">
      <Link to={`/product/${product.slug}`} className="block relative bg-slate-50">
        <img
          src={getProductImage(product.slug)}
          alt={`${product.name} - ${product.tagline}`}
          loading="lazy"
          width={1024}
          height={1024}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 bg-blue-600/95 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
          {product.category}
        </span>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-bold text-slate-900 leading-tight hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.tagline}</p>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-slate-900">₹{product.price}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-xs text-slate-400 line-through">₹{product.mrp}</span>
          )}
          <span className="text-xs text-slate-500 ml-auto">{product.uom}</span>
        </div>

        <button
          onClick={() => {
            addItem({
              slug: product.slug,
              name: product.name,
              uom: product.uom,
              price: product.price,
            });
            toast.success(`${product.name} added to cart`);
          }}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white py-2.5 text-sm font-semibold hover:bg-blue-600 transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

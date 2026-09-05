import acid from "@/assets/products/acid.jpg";
import balm from "@/assets/products/balm.jpg";
import copper from "@/assets/products/copper-cleaning-liquid.jpg";
import detergentPowder from "@/assets/products/detergent-powder.jpg";
import dishWash from "@/assets/products/dish-wash.jpg";
import floorCleaner from "@/assets/products/floor-cleaner.jpg";
import handWash from "@/assets/products/hand-wash.jpg";
import liquidDetergent from "@/assets/products/liquid-detergent.jpg";
import phenyl from "@/assets/products/phenyl.jpg";
import roseWater from "@/assets/products/rose-water.jpg";
import soapOil from "@/assets/products/soap-oil.jpg";
import toiletCleaner from "@/assets/products/toilet-cleaner.jpg";
import vaseline from "@/assets/products/vaseline.jpg";

export const productImages: Record<string, string> = {
  acid,
  "zandu-balm": balm,
  "copper-cleaning-liquid": copper,
  "detergent-powder": detergentPowder,
  "dish-wash": dishWash,
  "floor-cleaner": floorCleaner,
  "hand-wash": handWash,
  "liquid-detergent": liquidDetergent,
  phenyl,
  "rose-water": roseWater,
  "soap-oil": soapOil,
  "toilet-cleaner": toiletCleaner,
  vaseline,
};

export const getProductImage = (slug: string) =>
  productImages[slug] ?? copper;

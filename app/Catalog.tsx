"use client";

import { useMemo, useState } from "react";

export interface Product {
  id: number;
  title: string;
  price: string;
  oldPrice?: string;
  image: string;
  affiliateLink: string;
  category: string;
}

// Converte "R$ 1.234,56" (ou "A partir de R$ 79,99") em número
function parseBRL(value: string): number | null {
  const match = value.match(/(\d{1,3}(?:\.\d{3})*|\d+),(\d{2})/);
  if (!match) return null;
  return Number(match[1].replace(/\./g, "") + "." + match[2]);
}

function discountPercent(price: string, oldPrice?: string): number | null {
  if (!oldPrice) return null;
  const now = parseBRL(price);
  const before = parseBRL(oldPrice);
  if (!now || !before || before <= now) return null;
  return Math.round((1 - now / before) * 100);
}

const NEW_COUNT = 4; // os produtos mais recentes (maior id) ganham o selo "Novo"

export default function Catalog({ products }: { products: Product[] }) {
  const [category, setCategory] = useState("Todos");

  const sorted = useMemo(
    () => [...products].sort((a, b) => b.id - a.id),
    [products]
  );
  const newIds = useMemo(
    () => new Set(sorted.slice(0, NEW_COUNT).map((p) => p.id)),
    [sorted]
  );
  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(sorted.map((p) => p.category)))],
    [sorted]
  );
  const visible =
    category === "Todos" ? sorted : sorted.filter((p) => p.category === category);

  return (
    <section>
      {/* Filtro por categoria */}
      <div className="-mx-4 px-4 mb-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible">
        {categories.map((cat) => {
          const active = cat === category;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "border-orange-500 bg-orange-500 text-slate-950"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-orange-500/60 hover:text-orange-400"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grade de produtos: 2 por linha no celular */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((product) => {
          const off = discountPercent(product.price, product.oldPrice);
          return (
            <a
              key={product.id}
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 transition-all duration-300 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10"
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <img
                  src={product.image}
                  alt={product.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
                  {newIds.has(product.id) && (
                    <span className="rounded-lg bg-orange-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                      Novo
                    </span>
                  )}
                  {off !== null && (
                    <span className="rounded-lg bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                      -{off}%
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-grow flex-col justify-between p-3 sm:p-4">
                <div>
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-orange-500">
                    {product.category}
                  </span>
                  <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-slate-100 transition-colors group-hover:text-orange-400 sm:text-base">
                    {product.title}
                  </h3>
                  {product.oldPrice && (
                    <p className="text-xs text-slate-500 line-through">
                      {product.oldPrice}
                    </p>
                  )}
                  <p className="mb-3 text-base font-black text-orange-500 sm:text-xl">
                    {product.price}
                  </p>
                </div>

                <span className="block w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2 text-center text-sm font-extrabold text-slate-950 shadow-lg shadow-orange-500/20 transition-all group-hover:from-orange-600 group-hover:to-amber-600 sm:py-3">
                  Ver na Shopee 🚀
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

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

export interface SocialLink {
  label: string;
  handle: string;
  href: string;
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

// Remove acentos para a busca achar "arvore" em "Árvore"
function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Ícone de cada categoria (categorias novas usam o ícone padrão)
const CATEGORY_ICONS: Record<string, string> = {
  Todos: "🛍️",
  "Beleza e Cabelo": "💇",
  "Powerbanks e Baterias": "🔋",
  "Decoração de Natal": "🎄",
  Brinquedos: "🧸",
  "Automotivo e Moto": "🚗",
  "Caixas de Som": "🔊",
  "Utensílios de Cozinha": "🍳",
  Construção: "🧱",
  "Casa e Cama": "🛏️",
  Ferramentas: "🔧",
  "Relógios Inteligentes": "⌚",
  "Tomadas Elétricas e Extensões": "🔌",
  "Cuidados Pessoais": "🪒",
};

const NEW_COUNT = 4; // os produtos mais recentes (maior id) ganham o selo "Novo"
const HIGHLIGHT_COUNT = 6; // quantos aparecem na faixa "Achados do dia"

function ProductCard({
  product,
  isNew,
  compact = false,
}: {
  product: Product;
  isNew: boolean;
  compact?: boolean;
}) {
  const off = discountPercent(product.price, product.oldPrice);
  return (
    <a
      href={product.affiliateLink}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group flex h-full flex-col overflow-hidden rounded-sm border border-transparent bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#ee4d2d] hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {isNew && (
          <span className="absolute left-0 top-2 rounded-r-sm bg-[#ee4d2d] px-1.5 py-0.5 text-[10px] font-semibold text-white">
            Novo
          </span>
        )}
        {off !== null && (
          <span className="absolute right-0 top-0 bg-[#ffd424] px-1.5 py-1 text-[11px] font-bold leading-none text-[#ee4d2d]">
            -{off}%
          </span>
        )}
      </div>

      <div className="flex flex-grow flex-col justify-between gap-2 p-2">
        <h3
          className={`line-clamp-2 text-[13px] leading-snug text-slate-800 ${
            compact ? "min-h-[2.4em]" : "min-h-[2.6em] sm:text-sm"
          }`}
        >
          {product.title}
        </h3>
        <div>
          {product.oldPrice && (
            <p className="text-[11px] text-slate-400 line-through">{product.oldPrice}</p>
          )}
          <p className="text-base font-semibold leading-tight text-[#ee4d2d]">
            {product.price}
          </p>
          {!compact && (
            <p className="mt-1 text-[11px] text-slate-500">{product.category}</p>
          )}
        </div>
      </div>
      {!compact && (
        <span className="bg-[#ee4d2d] py-1.5 text-center text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 max-sm:opacity-100">
          Ver oferta na Shopee
        </span>
      )}
    </a>
  );
}

export default function Catalog({
  products,
  socialLinks,
}: {
  products: Product[];
  socialLinks: SocialLink[];
}) {
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");

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
  // Primeiro os que têm desconto, depois os mais novos
  const highlights = useMemo(() => {
    const withDiscount = sorted.filter((p) => discountPercent(p.price, p.oldPrice) !== null);
    const rest = sorted.filter((p) => !withDiscount.includes(p));
    return [...withDiscount, ...rest].slice(0, HIGHLIGHT_COUNT);
  }, [sorted]);

  const term = normalize(query.trim());
  const visible = sorted.filter(
    (p) =>
      (category === "Todos" || p.category === category) &&
      (term === "" || normalize(`${p.title} ${p.category}`).includes(term))
  );
  const searching = term !== "" || category !== "Todos";

  function scrollToResults() {
    document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {/* Topo laranja */}
      <header className="sticky top-0 z-20 bg-gradient-to-b from-[#f53d2d] to-[#f63] text-white shadow">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <div className="hidden items-center justify-between py-1.5 text-[13px] sm:flex">
            <div className="flex items-center gap-3">
              <span>Siga-nos no</span>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/80"
                >
                  {s.label} <span className="text-white/75">{s.handle}</span>
                </a>
              ))}
            </div>
            <span className="text-white/90">🔥 Ofertas atualizadas diariamente</span>
          </div>

          <div className="flex items-center gap-3 py-3 sm:gap-8 sm:py-4">
            <a href="#" className="flex shrink-0 items-center gap-2" aria-label="Achados Legais – início">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg font-black text-[#ee4d2d] sm:h-11 sm:w-11 sm:text-xl">
                AL
              </span>
              <span className="hidden text-2xl font-semibold leading-none sm:block">
                Achados Legais
              </span>
            </a>

            <form
              className="flex flex-1 items-center rounded-sm bg-white p-1 shadow-sm"
              onSubmit={(e) => {
                e.preventDefault();
                scrollToResults();
              }}
            >
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar nos Achados Legais"
                aria-label="Buscar produtos"
                className="min-w-0 flex-1 px-2 py-1.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="rounded-sm bg-[#ee4d2d] px-4 py-1.5 text-white hover:bg-[#d73211] sm:px-6"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-4 px-3 py-4 sm:px-4 sm:py-6">
        {/* Banners */}
        {!searching && (
          <div className="grid gap-2 md:grid-cols-3">
            <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-[#ff7337] via-[#ee4d2d] to-[#d0011b] p-6 text-white md:col-span-2 md:p-10">
              <span className="inline-block rounded-sm bg-black px-2 py-1 text-xs font-black uppercase tracking-wider">
                Esquenta Black Friday
              </span>
              <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
                Achadinhos com
                <br />
                preço baixo 🔥
              </h2>
              <p className="mt-2 max-w-md text-sm text-white/90 sm:text-base">
                Selecionamos todo dia os melhores produtos e promoções da Shopee para você.
              </p>
              <button
                type="button"
                onClick={scrollToResults}
                className="mt-5 rounded-full bg-white px-5 py-2 text-sm font-bold text-[#ee4d2d] shadow hover:bg-orange-50"
              >
                Ver ofertas ▸
              </button>
              <span className="pointer-events-none absolute -bottom-10 -right-6 select-none text-[160px] leading-none opacity-20 sm:text-[200px]">
                🛍️
              </span>
            </div>
            <div className="hidden gap-2 md:grid md:grid-rows-2">
              <div className="flex flex-col justify-center rounded-sm bg-[#ee4d2d] p-5 text-center text-white">
                <p className="text-sm uppercase">Aproveite ofertas com</p>
                <p className="text-lg font-black uppercase leading-tight">Cupons de desconto e frete grátis</p>
              </div>
              <div className="flex flex-col justify-center rounded-sm bg-gradient-to-r from-[#d0011b] to-[#a1000f] p-5 text-center text-white">
                <p className="text-2xl">🆕</p>
                <p className="text-lg font-black uppercase leading-tight">Novidades todo dia</p>
                <p className="text-xs text-white/80">Siga nas redes para não perder nada</p>
              </div>
            </div>
          </div>
        )}

        {/* Categorias com ícone */}
        <section className="rounded-sm bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-sm font-medium uppercase text-slate-500">
            Categorias
          </h2>
          <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => {
              const active = cat === category;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex w-24 shrink-0 flex-col items-center gap-2 border-b-2 px-2 py-3 text-center text-xs leading-tight transition-colors sm:w-28 ${
                    active
                      ? "border-[#ee4d2d] text-[#ee4d2d]"
                      : "border-transparent text-slate-700 hover:text-[#ee4d2d]"
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${
                      active ? "bg-orange-100" : "bg-slate-100"
                    }`}
                  >
                    {CATEGORY_ICONS[cat] ?? "🏷️"}
                  </span>
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Achados do dia */}
        {!searching && (
          <section className="rounded-sm bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <h2 className="text-lg font-black uppercase italic text-[#ee4d2d] sm:text-xl">
                ⚡ Achados do dia
              </h2>
              <button
                type="button"
                onClick={scrollToResults}
                className="text-sm text-[#ee4d2d] hover:underline"
              >
                Ver tudo ›
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {highlights.map((p) => (
                <div key={p.id} className="w-36 shrink-0 sm:w-44">
                  <ProductCard product={p} isNew={newIds.has(p.id)} compact />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Todos os produtos */}
        <section id="produtos" className="scroll-mt-28">
          <div className="border-b-4 border-[#ee4d2d] bg-white px-4 py-3 text-center text-sm font-semibold uppercase text-[#ee4d2d] shadow-sm">
            {term !== ""
              ? `Resultados para "${query.trim()}"`
              : category !== "Todos"
                ? category
                : "Descobertas do dia"}
          </div>

          {visible.length === 0 ? (
            <div className="mt-2 rounded-sm bg-white px-4 py-12 text-center text-slate-500">
              <p className="text-4xl">🔎</p>
              <p className="mt-2">Nenhum produto encontrado.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("Todos");
                }}
                className="mt-4 rounded-sm bg-[#ee4d2d] px-4 py-2 text-sm text-white"
              >
                Ver todos os produtos
              </button>
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} isNew={newIds.has(p.id)} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

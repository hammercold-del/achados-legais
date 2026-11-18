import productsData from "./products.json";
import Catalog, { type Product } from "./Catalog";

const SOCIAL_LINKS = [
  { label: "Instagram", handle: "@heivariedades", href: "https://www.instagram.com/heivariedades/" },
  { label: "TikTok", handle: "@enderson.cs", href: "https://www.tiktok.com/@enderson.cs" },
];

export default function Home() {
  const products: Product[] = productsData;

  return (
    <main className="relative min-h-screen bg-slate-950 pb-16 text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* Faixa de Black Friday */}
      <div className="bg-gradient-to-r from-black via-slate-900 to-black border-b border-orange-500/30">
        <p className="mx-auto max-w-7xl px-4 py-2.5 text-center text-sm font-bold text-white">
          🖤 <span className="text-orange-400">Esquenta Black Friday</span> — achadinhos com preço baixo, selecionados todo dia
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <header className="mb-10 text-center">
          <span className="mb-3 inline-block rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-400">
            🔥 Ofertas atualizadas diariamente
          </span>
          <h1 className="mb-3 text-4xl font-black tracking-tight text-white">
            Achados Legais <span className="text-orange-500">Shopee</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-slate-400">
            Os melhores achadinhos, promoções e produtos virais da Shopee selecionados para você.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-orange-500 hover:text-orange-400"
              >
                Siga no {s.label} <span className="text-slate-500">{s.handle}</span>
              </a>
            ))}
          </div>
        </header>

        <Catalog products={products} />

        {/* Rodapé */}
        <footer className="mt-20 space-y-2 border-t border-slate-900 pt-8 text-center text-sm text-slate-500">
          <p>
            Preços e disponibilidade podem mudar a qualquer momento na Shopee. Confira o valor final antes de comprar.
          </p>
          <p>
            © {new Date().getFullYear()} Achados Legais. Participamos do programa de afiliados da Shopee e podemos receber comissão pelas compras feitas pelos links.
          </p>
        </footer>
      </div>
    </main>
  );
}

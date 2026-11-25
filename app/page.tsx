import productsData from "./products.json";
import Catalog, { type Product, type SocialLink } from "./Catalog";

const SOCIAL_LINKS: SocialLink[] = [
  { label: "Instagram", handle: "@heivariedades", href: "https://www.instagram.com/heivariedades/" },
  { label: "TikTok", handle: "@enderson.cs", href: "https://www.tiktok.com/@enderson.cs" },
];

export default function Home() {
  const products: Product[] = productsData;

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-slate-800 selection:bg-[#ee4d2d] selection:text-white">
      <Catalog products={products} socialLinks={SOCIAL_LINKS} />

      {/* Rodapé */}
      <footer className="mt-8 border-t-4 border-[#ee4d2d] bg-white">
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-8 text-center text-sm text-slate-500">
          <div className="flex flex-wrap justify-center gap-3">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm border border-slate-200 px-4 py-2 font-medium text-slate-700 transition-colors hover:border-[#ee4d2d] hover:text-[#ee4d2d]"
              >
                Siga no {s.label} <span className="text-slate-400">{s.handle}</span>
              </a>
            ))}
          </div>
          <p>
            Preços e disponibilidade podem mudar a qualquer momento na Shopee. Confira o valor final antes de comprar.
          </p>
          <p>
            © {new Date().getFullYear()} Achados Legais. Participamos do programa de afiliados da Shopee e podemos receber comissão pelas compras feitas pelos links. Este site não é a loja oficial da Shopee.
          </p>
        </div>
      </footer>
    </main>
  );
}

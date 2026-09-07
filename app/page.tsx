import productsData from "./products.json";

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  affiliateLink: string;
  category: string;
  featured?: boolean;
}

export default function Home() {
  const products: Product[] = productsData;

  // Separa os 4 primeiros produtos para os destaques principais
  const mainProducts = products.slice(0, 4); 
  
  // Para o garimpo relâmpago: se houver mais de 4 produtos no JSON, exibe eles. 
  // Caso contrário, reutiliza os produtos para que o garimpo exiba as fotos reais dinamicamente!
  const sideProducts = products.length > 4 ? products.slice(4) : products;

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 pb-16 overflow-hidden selection:bg-orange-500 selection:text-white">
      
      {/* Marca d'água de fundo */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10 overflow-hidden">
        <img 
          src="/promocao9.9.png" 
          alt="Marca d'água 9.9" 
          className="w-[800px] md:w-[1000px] h-auto object-contain opacity-5 blur-[1px] scale-125 select-none"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Cabeçalho */}
        <header className="text-center mb-12">
          <span className="bg-orange-500/10 text-orange-400 text-xs font-semibold px-4 py-1.5 rounded-full border border-orange-500/20 uppercase tracking-widest inline-block mb-3">
            🔥 Ofertas Atualizadas Diariamente
          </span>
          <h1 className="text-4xl font-black tracking-tight text-white mb-3">
            Achados Legais <span className="text-orange-500">Shopee</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Os melhores achadinhos, promoções e produtos virais da Shopee selecionados exclusivamente para você.
          </p>
        </header>

        {/* ESTRUTURA DE DUAS COLUNAS: 70% (Principal) e 30% (Lista Lateral) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUNA PRINCIPAL (70% - 4 Destaques) */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              ⭐ Produtos em Destaque
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {mainProducts.map((product) => (
                <div
                  key={`main-${product.id}`}
                  className="group bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col"
                >
                  <div className="relative overflow-hidden bg-slate-800 h-56">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-xl uppercase tracking-wider shadow-lg">
                      {product.category}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-orange-400 transition-colors line-clamp-2 mb-2">
                        {product.title}
                      </h3>
                      <p className="text-xl font-black text-orange-500 mb-4">
                        {product.price}
                      </p>
                    </div>

                    <a
                      href={product.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 hover:scale-[1.02]"
                    >
                      Aproveite agora Link na Bios 🚀
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUNA LATERAL DE ACHADOS RÁPIDOS (30%) */}
          <div className="lg:col-span-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
              ⚡ Garimpo Relâmpago
            </h2>

            <div className="space-y-4">
              {sideProducts.map((product) => (
                <a
                  key={`side-${product.id}`}
                  href={product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-slate-900 border border-slate-800/60 p-3 rounded-2xl hover:border-orange-500/50 transition-all group"
                >
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-16 h-16 object-cover rounded-xl bg-slate-800 flex-shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-grow min-w-0">
                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wide block">
                      {product.category}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-200 truncate group-hover:text-orange-400 transition-colors">
                      {product.title}
                    </h4>
                    <p className="text-sm font-black text-orange-500 mt-1">
                      {product.price}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-500">Novos achados adicionados toda semana.</p>
            </div>
          </div>

        </div>

        {/* Rodapé */}
        <footer className="mt-20 text-center text-slate-500 text-sm border-t border-slate-900 pt-8">
          <p>© {new Date().getFullYear()} Achados Legais. Todos os direitos reservados. Participamos do programa de afiliados da Shopee.</p>
        </footer>
      </div>
    </main>
  );
}
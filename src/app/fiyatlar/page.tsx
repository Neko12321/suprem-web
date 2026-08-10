import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

function formatPrice(priceInKurus: number): string {
  if (priceInKurus === 0) return "İletişime Geçin";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(priceInKurus / 100);
}

export default async function PricesPage() {
  const allProducts = await db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(asc(products.sortOrder));

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-white mb-2">FİYATLAR</h1>
          <div className="gradient-purple-line w-24 mb-8"></div>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl">
            Hizmetlerimizin fiyatlarını inceleyin ve size uygun paketi seçin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#121218] rounded-lg border border-purple-900/20 hover:border-purple-500/40 transition-all overflow-hidden flex flex-col"
              >
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-white font-bold text-lg mb-2">{product.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 flex-1">{product.description}</p>
                  <div className="mb-4">
                    <span className="text-purple-400 text-2xl font-bold">
                      {formatPrice(product.price)}
                    </span>
                    {product.deposit && product.deposit > 0 && (
                      <p className="text-gray-600 text-sm mt-1">
                        Kapora: {formatPrice(product.deposit)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/randevu?product=${product.id}&type=appointment`}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Randevu Al
                    </Link>
                    <Link
                      href={`/randevu?product=${product.id}&type=info`}
                      className="flex-1 border border-purple-600 hover:bg-purple-600/10 text-purple-400 text-center py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Bilgi Al
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

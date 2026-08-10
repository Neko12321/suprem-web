import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { services } from "@/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const allServices = await db.select().from(services).orderBy(asc(services.sortOrder));

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-white mb-2">HİZMETLERİMİZ</h1>
          <div className="gradient-purple-line w-24 mb-8"></div>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl">
            Suprem Record olarak, müzik prodüksiyonunun her aşamasında profesyonel hizmetler sunuyoruz.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allServices.map((service) => (
              <div
                key={service.id}
                className="bg-[#121218] p-8 rounded-lg border border-purple-900/20 hover:border-purple-500/40 transition-all group"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-purple-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/randevu"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold tracking-wider transition-colors"
            >
              RANDEVU AL <span>→</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

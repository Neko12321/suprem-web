import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";

export const dynamic = "force-dynamic";

async function getSettings() {
  const rows = await db.select().from(siteSettings);
  const map: Record<string, string> = {};
  rows.forEach((r) => { map[r.key] = r.value; });
  return map;
}

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-white mb-2">HAKKIMIZDA</h1>
          <div className="gradient-purple-line w-24 mb-8"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <img
                src="/images/studio.jpg"
                alt="Suprem Record Studio"
                className="rounded-lg w-full h-80 object-cover"
              />
            </div>
            <div>
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                {settings.about_text || ""}
              </p>
              <p className="text-gray-400 leading-relaxed">
                {settings.about_full || ""}
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-[#121218] p-8 rounded-lg border border-purple-900/20">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-white font-bold text-lg mb-2">Vizyonumuz</h3>
              <p className="text-gray-500 text-sm">Türkiye&apos;nin en yaratıcı ve yenilikçi müzik prodüksiyon merkezi olmak.</p>
            </div>
            <div className="bg-[#121218] p-8 rounded-lg border border-purple-900/20">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-white font-bold text-lg mb-2">Misyonumuz</h3>
              <p className="text-gray-500 text-sm">Sanatçılara en kaliteli prodüksiyon hizmetlerini sunarak müzik endüstrisini şekillendirmek.</p>
            </div>
            <div className="bg-[#121218] p-8 rounded-lg border border-purple-900/20">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-white font-bold text-lg mb-2">Değerlerimiz</h3>
              <p className="text-gray-500 text-sm">Kalite, yaratıcılık, profesyonellik ve sanatçıya saygı temel değerlerimizdir.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

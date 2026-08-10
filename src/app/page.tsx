import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { services, siteSettings, blogPosts } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function getSettings() {
  const rows = await db.select().from(siteSettings);
  const map: Record<string, string> = {};
  rows.forEach((r) => { map[r.key] = r.value; });
  return map;
}

export default async function HomePage() {
  const settings = await getSettings();
  const allServices = await db.select().from(services).orderBy(asc(services.sortOrder));
  const latestPosts = await db.select().from(blogPosts).where(eq(blogPosts.isPublished, true)).limit(3);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img src="/images/hero-bg.jpg" alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="text-white">MÜZİK.</span><br />
                <span className="text-white">VİZYON.</span><br />
                <span className="text-purple-500 purple-glow">SUPREM.</span>
              </h1>
              <p className="text-gray-400 mt-6 text-lg max-w-md">
                {settings.site_description || "Suprem Record, müzikte sınırları zorlayan sanatçılar için yaratıcı prodüksiyon çözümleri sunar."}
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href="/hizmetler"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold tracking-wider transition-colors"
                >
                  HİZMETLERİMİZ <span>→</span>
                </Link>
                <Link
                  href="/randevu"
                  className="inline-flex items-center gap-2 border border-gray-600 hover:border-purple-500 text-white px-6 py-3 rounded-lg font-semibold tracking-wider transition-colors"
                >
                  RANDEVU AL
                </Link>
              </div>
            </div>

            {/* Right side decorative */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 rounded-full bg-purple-600/10 animate-pulse"></div>
                <div className="absolute inset-4 rounded-full bg-purple-600/5 border border-purple-600/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl font-bold text-purple-500/30">SR</div>
                    <div className="text-purple-400 tracking-[0.5em] text-sm mt-2">SUPREM</div>
                    <div className="flex items-center gap-2 justify-center mt-1">
                      <div className="h-px w-8 bg-purple-500/50"></div>
                      <span className="text-purple-300/60 text-xs tracking-[0.3em]">RECORD</span>
                      <div className="h-px w-8 bg-purple-500/50"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Strip */}
      <section className="relative z-10 bg-[#0d0d14] border-y border-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {allServices.map((service) => (
              <div key={service.id} className="flex items-start gap-4">
                <div className="text-3xl">{service.icon}</div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-wider uppercase">{service.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="/images/studio.jpg"
                alt="Studio"
                className="rounded-lg w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0f]/50 rounded-lg"></div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">HAKKIMIZDA</h2>
              <p className="text-gray-400 leading-relaxed">
                {settings.about_text || "Suprem Record, müzik prodüksiyonu, kayıt, mix & mastering ve dijital dağıtım alanlarında profesyonel çözümler sunan bir plak şirketi ve prodüksiyon stüdyosudur."}
              </p>
              <Link
                href="/hakkimizda"
                className="inline-flex items-center gap-2 border border-gray-600 hover:border-purple-500 text-white px-6 py-3 rounded-lg font-semibold tracking-wider transition-colors mt-8"
              >
                DEVAMINI OKU <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0d0d14]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Projenizi Hayata Geçirelim</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Profesyonel ekibimizle müzik projenizi bir üst seviyeye taşıyın.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/randevu"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold tracking-wider transition-colors"
            >
              RANDEVU AL <span>→</span>
            </Link>
            <Link
              href="/fiyatlar"
              className="inline-flex items-center gap-2 border border-purple-600 hover:bg-purple-600/10 text-purple-400 px-8 py-3 rounded-lg font-semibold tracking-wider transition-colors"
            >
              FİYATLARI GÖR
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {latestPosts.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">BLOG</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-[#121218] rounded-lg border border-purple-900/20 hover:border-purple-500/40 transition-all overflow-hidden group"
                >
                  <div className="p-6">
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{post.excerpt}</p>
                    <span className="text-purple-400 text-sm mt-4 inline-block">Devamını Oku →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}

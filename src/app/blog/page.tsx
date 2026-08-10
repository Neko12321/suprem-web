import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.isPublished, true))
    .orderBy(desc(blogPosts.createdAt));

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-white mb-2">BLOG</h1>
          <div className="gradient-purple-line w-24 mb-8"></div>

          {posts.length === 0 ? (
            <p className="text-gray-500">Henüz blog yazısı bulunmuyor.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-[#121218] rounded-lg border border-purple-900/20 hover:border-purple-500/40 transition-all overflow-hidden group"
                >
                  {post.imageUrl && (
                    <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <h2 className="text-white font-bold text-xl mb-2 group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-400 text-sm">Devamını Oku →</span>
                      <span className="text-gray-600 text-xs">
                        {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

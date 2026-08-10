import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  const post = posts[0];

  if (!post || !post.isPublished) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="text-purple-400 hover:text-purple-300 text-sm mb-6 inline-block">
            ← Blog&apos;a Dön
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
          <p className="text-gray-600 text-sm mb-8">
            {new Date(post.createdAt).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {post.imageUrl && (
            <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-8" />
          )}
          <div className="prose prose-invert max-w-none">
            {post.content.split("\n").map((para, i) => (
              <p key={i} className="text-gray-300 leading-relaxed mb-4">
                {para}
              </p>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Product {
  id: number;
  title: string;
  price: number;
  deposit: number | null;
}

function AppointmentForm() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product") || "";
  const requestType = searchParams.get("type") || "appointment";

  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    productId: productId,
    preferredDate: "",
    message: "",
    type: requestType,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (productId) setForm((f) => ({ ...f, productId }));
    if (requestType) setForm((f) => ({ ...f, type: requestType }));
  }, [productId, requestType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } catch {
      setError("Bağlantı hatası.");
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="bg-[#121218] p-12 rounded-lg border border-purple-900/20 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {form.type === "info" ? "Bilgi Talebiniz Alındı!" : "Randevunuz Alındı!"}
        </h2>
        <p className="text-gray-400">En kısa sürede sizinle iletişime geçeceğiz.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#121218] p-8 rounded-lg border border-purple-900/20 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        {form.type === "info" ? "Bilgi Talebi Formu" : "Randevu Formu"}
      </h2>

      {/* Type toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setForm({ ...form, type: "appointment" })}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            form.type === "appointment"
              ? "bg-purple-600 text-white"
              : "border border-gray-600 text-gray-400 hover:border-purple-500"
          }`}
        >
          Randevu Al
        </button>
        <button
          type="button"
          onClick={() => setForm({ ...form, type: "info" })}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            form.type === "info"
              ? "bg-purple-600 text-white"
              : "border border-gray-600 text-gray-400 hover:border-purple-500"
          }`}
        >
          Bilgi Al
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Ad Soyad *</label>
          <input
            type="text"
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">E-posta *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Telefon *</label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Hizmet</label>
          <select
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
            className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="">Seçiniz</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {form.type === "appointment" && (
        <div>
          <label className="block text-gray-400 text-sm mb-1">Tercih Edilen Tarih</label>
          <input
            type="date"
            value={form.preferredDate}
            onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
            className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
          />
        </div>
      )}

      <div>
        <label className="block text-gray-400 text-sm mb-1">Mesajınız</label>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none resize-none"
        ></textarea>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold tracking-wider transition-colors"
      >
        {submitting ? "Gönderiliyor..." : form.type === "info" ? "BİLGİ TALEBİ GÖNDER" : "RANDEVU AL"}
      </button>
    </form>
  );
}

export default function AppointmentPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-white mb-2">RANDEVU AL</h1>
          <div className="gradient-purple-line w-24 mb-8"></div>
          <p className="text-gray-400 text-lg mb-8">
            Formu doldurarak randevu alabilir veya hizmetlerimiz hakkında bilgi isteyebilirsiniz.
          </p>
          <Suspense fallback={<div className="text-gray-400">Yükleniyor...</div>}>
            <AppointmentForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

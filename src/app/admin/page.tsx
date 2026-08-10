"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("admin_token", data.token);
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Giriş başarısız");
      }
    } catch {
      setError("Bağlantı hatası");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-white text-2xl mx-auto mb-4">
            SR
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Paneli</h1>
          <p className="text-gray-500 text-sm mt-1">Suprem Record Yönetim</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#121218] p-8 rounded-lg border border-purple-900/20 space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Kullanıcı Adı</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold tracking-wider transition-colors"
          >
            {loading ? "Giriş Yapılıyor..." : "GİRİŞ YAP"}
          </button>
        </form>
      </div>
    </div>
  );
}

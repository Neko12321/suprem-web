"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type Tab = "dashboard" | "appointments" | "products" | "blog" | "services" | "settings";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  deposit: number;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

interface Appointment {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  message: string | null;
  preferredDate: string | null;
  status: string;
  type: string;
  createdAt: string;
  productId: number | null;
  productTitle: string | null;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  createdAt: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string | null;
  sortOrder: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [token, setToken] = useState("");

  // Data states
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [blogList, setBlogList] = useState<BlogPost[]>([]);
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  // Edit states
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [editBlog, setEditBlog] = useState<Partial<BlogPost> | null>(null);
  const [editService, setEditService] = useState<Partial<Service> | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (!t) {
      router.push("/admin");
      return;
    }
    setToken(t);
  }, [router]);

  const headers = useCallback(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }), [token]);

  const loadData = useCallback(async () => {
    if (!token) return;
    try {
      const [apRes, prRes, blRes, svRes, stRes] = await Promise.all([
        fetch("/api/admin/appointments", { headers: headers() }),
        fetch("/api/admin/products", { headers: headers() }),
        fetch("/api/admin/blog", { headers: headers() }),
        fetch("/api/admin/services", { headers: headers() }),
        fetch("/api/admin/settings", { headers: headers() }),
      ]);

      if (apRes.status === 401) {
        localStorage.removeItem("admin_token");
        router.push("/admin");
        return;
      }

      setAppointmentsList(await apRes.json());
      setProductsList(await prRes.json());
      setBlogList(await blRes.json());
      setServicesList(await svRes.json());
      setSettings(await stRes.json());
    } catch {
      // ignore
    }
  }, [token, headers, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const logout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin");
  };

  // ===== APPOINTMENTS =====
  const updateAppointmentStatus = async (id: number, status: string) => {
    await fetch("/api/admin/appointments", {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ id, status }),
    });
    loadData();
  };

  const deleteAppointment = async (id: number) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await fetch("/api/admin/appointments", {
      method: "DELETE",
      headers: headers(),
      body: JSON.stringify({ id }),
    });
    loadData();
  };

  // ===== PRODUCTS =====
  const saveProduct = async () => {
    if (!editProduct) return;
    const method = editProduct.id ? "PUT" : "POST";
    await fetch("/api/admin/products", {
      method,
      headers: headers(),
      body: JSON.stringify(editProduct),
    });
    setEditProduct(null);
    loadData();
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: headers(),
      body: JSON.stringify({ id }),
    });
    loadData();
  };

  // ===== BLOG =====
  const saveBlog = async () => {
    if (!editBlog) return;
    const method = editBlog.id ? "PUT" : "POST";
    await fetch("/api/admin/blog", {
      method,
      headers: headers(),
      body: JSON.stringify(editBlog),
    });
    setEditBlog(null);
    loadData();
  };

  const deleteBlog = async (id: number) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await fetch("/api/admin/blog", {
      method: "DELETE",
      headers: headers(),
      body: JSON.stringify({ id }),
    });
    loadData();
  };

  // ===== SERVICES =====
  const saveService = async () => {
    if (!editService) return;
    const method = editService.id ? "PUT" : "POST";
    await fetch("/api/admin/services", {
      method,
      headers: headers(),
      body: JSON.stringify(editService),
    });
    setEditService(null);
    loadData();
  };

  const deleteService = async (id: number) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await fetch("/api/admin/services", {
      method: "DELETE",
      headers: headers(),
      body: JSON.stringify({ id }),
    });
    loadData();
  };

  // ===== SETTINGS =====
  const saveSettings = async () => {
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(settings),
    });
    alert("Ayarlar kaydedildi!");
  };

  const statusColor = (s: string) => {
    if (s === "confirmed") return "text-green-400 bg-green-900/30";
    if (s === "cancelled") return "text-red-400 bg-red-900/30";
    return "text-yellow-400 bg-yellow-900/30";
  };

  const statusText = (s: string) => {
    if (s === "confirmed") return "Onaylandı";
    if (s === "cancelled") return "İptal";
    return "Beklemede";
  };

  const sidebarItems: { key: Tab; label: string; icon: string }[] = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "appointments", label: "Randevular", icon: "📅" },
    { key: "products", label: "Ürünler/Fiyatlar", icon: "💰" },
    { key: "blog", label: "Blog Yazıları", icon: "📝" },
    { key: "services", label: "Hizmetler", icon: "⚙️" },
    { key: "settings", label: "Site Ayarları", icon: "🔧" },
  ];

  return (
    <div className="min-h-screen flex bg-[#0a0a0f]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d0d14] border-r border-purple-900/20 flex flex-col min-h-screen">
        <div className="p-4 border-b border-purple-900/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-purple-600 flex items-center justify-center font-bold text-white text-sm">
              SR
            </div>
            <span className="text-white font-bold text-sm">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 py-4 admin-sidebar">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 text-sm transition-colors hover:bg-purple-900/10 ${
                tab === item.key ? "active bg-purple-900/20 border-l-3 border-purple-500 text-purple-400" : "text-gray-400"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-purple-900/20">
          <button
            onClick={logout}
            className="w-full text-left text-red-400 text-sm hover:text-red-300 transition-colors flex items-center gap-2"
          >
            🚪 Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Dashboard */}
        {tab === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#121218] p-6 rounded-lg border border-purple-900/20">
                <p className="text-gray-500 text-sm">Toplam Randevu</p>
                <p className="text-3xl font-bold text-purple-400 mt-2">{appointmentsList.length}</p>
              </div>
              <div className="bg-[#121218] p-6 rounded-lg border border-purple-900/20">
                <p className="text-gray-500 text-sm">Bekleyen Randevu</p>
                <p className="text-3xl font-bold text-yellow-400 mt-2">
                  {appointmentsList.filter((a) => a.status === "pending").length}
                </p>
              </div>
              <div className="bg-[#121218] p-6 rounded-lg border border-purple-900/20">
                <p className="text-gray-500 text-sm">Aktif Ürün</p>
                <p className="text-3xl font-bold text-green-400 mt-2">
                  {productsList.filter((p) => p.isActive).length}
                </p>
              </div>
              <div className="bg-[#121218] p-6 rounded-lg border border-purple-900/20">
                <p className="text-gray-500 text-sm">Blog Yazıları</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">{blogList.length}</p>
              </div>
            </div>

            {/* Recent appointments */}
            <h2 className="text-xl font-bold text-white mt-10 mb-4">Son Randevular</h2>
            <div className="bg-[#121218] rounded-lg border border-purple-900/20 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-900/20">
                    <th className="text-left px-4 py-3 text-gray-500 text-sm">Ad Soyad</th>
                    <th className="text-left px-4 py-3 text-gray-500 text-sm">Tür</th>
                    <th className="text-left px-4 py-3 text-gray-500 text-sm">Durum</th>
                    <th className="text-left px-4 py-3 text-gray-500 text-sm">Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsList.slice(0, 5).map((a) => (
                    <tr key={a.id} className="border-b border-purple-900/10">
                      <td className="px-4 py-3 text-white text-sm">{a.fullName}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{a.type === "info" ? "Bilgi" : "Randevu"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded ${statusColor(a.status)}`}>
                          {statusText(a.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {new Date(a.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Appointments */}
        {tab === "appointments" && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-8">Randevular</h1>
            <div className="bg-[#121218] rounded-lg border border-purple-900/20 overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-purple-900/20">
                    <th className="text-left px-4 py-3 text-gray-500 text-sm">Ad Soyad</th>
                    <th className="text-left px-4 py-3 text-gray-500 text-sm">E-posta</th>
                    <th className="text-left px-4 py-3 text-gray-500 text-sm">Telefon</th>
                    <th className="text-left px-4 py-3 text-gray-500 text-sm">Hizmet</th>
                    <th className="text-left px-4 py-3 text-gray-500 text-sm">Tür</th>
                    <th className="text-left px-4 py-3 text-gray-500 text-sm">Tarih</th>
                    <th className="text-left px-4 py-3 text-gray-500 text-sm">Durum</th>
                    <th className="text-left px-4 py-3 text-gray-500 text-sm">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsList.map((a) => (
                    <tr key={a.id} className="border-b border-purple-900/10">
                      <td className="px-4 py-3 text-white text-sm">{a.fullName}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{a.email}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{a.phone}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{a.productTitle || "-"}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{a.type === "info" ? "Bilgi" : "Randevu"}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{a.preferredDate || "-"}</td>
                      <td className="px-4 py-3">
                        <select
                          value={a.status}
                          onChange={(e) => updateAppointmentStatus(a.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded bg-transparent border border-purple-900/30 ${statusColor(a.status)}`}
                        >
                          <option value="pending">Beklemede</option>
                          <option value="confirmed">Onaylandı</option>
                          <option value="cancelled">İptal</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteAppointment(a.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {appointmentsList.length === 0 && (
                <p className="text-gray-500 text-center py-8">Henüz randevu yok.</p>
              )}
            </div>
          </div>
        )}

        {/* Products */}
        {tab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">Ürünler / Fiyatlar</h1>
              <button
                onClick={() => setEditProduct({ title: "", description: "", price: 0, deposit: 0, isActive: true, sortOrder: 0 })}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                + Yeni Ürün
              </button>
            </div>

            {editProduct && (
              <div className="bg-[#121218] p-6 rounded-lg border border-purple-500/40 mb-8 space-y-4">
                <h3 className="text-white font-bold">{editProduct.id ? "Ürün Düzenle" : "Yeni Ürün"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Başlık</label>
                    <input
                      value={editProduct.title || ""}
                      onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })}
                      className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Fiyat (kuruş)</label>
                    <input
                      type="number"
                      value={editProduct.price || 0}
                      onChange={(e) => setEditProduct({ ...editProduct, price: parseInt(e.target.value) })}
                      className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Kapora (kuruş)</label>
                    <input
                      type="number"
                      value={editProduct.deposit || 0}
                      onChange={(e) => setEditProduct({ ...editProduct, deposit: parseInt(e.target.value) })}
                      className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Sıra</label>
                    <input
                      type="number"
                      value={editProduct.sortOrder || 0}
                      onChange={(e) => setEditProduct({ ...editProduct, sortOrder: parseInt(e.target.value) })}
                      className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Açıklama</label>
                  <textarea
                    value={editProduct.description || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                    className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Görsel URL</label>
                  <input
                    value={editProduct.imageUrl || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, imageUrl: e.target.value })}
                    className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <label className="flex items-center gap-2 text-gray-400 text-sm">
                  <input
                    type="checkbox"
                    checked={editProduct.isActive ?? true}
                    onChange={(e) => setEditProduct({ ...editProduct, isActive: e.target.checked })}
                    className="accent-purple-600"
                  />
                  Aktif
                </label>
                <div className="flex gap-2">
                  <button onClick={saveProduct} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Kaydet
                  </button>
                  <button onClick={() => setEditProduct(null)} className="border border-gray-600 text-gray-400 px-4 py-2 rounded-lg text-sm transition-colors hover:border-gray-500">
                    İptal
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {productsList.map((p) => (
                <div key={p.id} className="bg-[#121218] p-4 rounded-lg border border-purple-900/20 flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-bold">{p.title}</h3>
                    <p className="text-gray-500 text-sm">
                      Fiyat: {p.price === 0 ? "İletişime Geçin" : `${(p.price / 100).toLocaleString("tr-TR")} ₺`}
                      {p.deposit > 0 && ` | Kapora: ${(p.deposit / 100).toLocaleString("tr-TR")} ₺`}
                    </p>
                    <span className={`text-xs ${p.isActive ? "text-green-400" : "text-red-400"}`}>
                      {p.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditProduct(p)}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blog */}
        {tab === "blog" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">Blog Yazıları</h1>
              <button
                onClick={() => setEditBlog({ title: "", slug: "", content: "", excerpt: "", isPublished: false })}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                + Yeni Yazı
              </button>
            </div>

            {editBlog && (
              <div className="bg-[#121218] p-6 rounded-lg border border-purple-500/40 mb-8 space-y-4">
                <h3 className="text-white font-bold">{editBlog.id ? "Yazı Düzenle" : "Yeni Yazı"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Başlık</label>
                    <input
                      value={editBlog.title || ""}
                      onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })}
                      className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Slug</label>
                    <input
                      value={editBlog.slug || ""}
                      onChange={(e) => setEditBlog({ ...editBlog, slug: e.target.value })}
                      className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
                      placeholder="Boş bırakılırsa otomatik oluşturulur"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Özet</label>
                  <input
                    value={editBlog.excerpt || ""}
                    onChange={(e) => setEditBlog({ ...editBlog, excerpt: e.target.value })}
                    className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">İçerik</label>
                  <textarea
                    value={editBlog.content || ""}
                    onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })}
                    className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none resize-none"
                    rows={8}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Görsel URL</label>
                  <input
                    value={editBlog.imageUrl || ""}
                    onChange={(e) => setEditBlog({ ...editBlog, imageUrl: e.target.value })}
                    className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <label className="flex items-center gap-2 text-gray-400 text-sm">
                  <input
                    type="checkbox"
                    checked={editBlog.isPublished ?? false}
                    onChange={(e) => setEditBlog({ ...editBlog, isPublished: e.target.checked })}
                    className="accent-purple-600"
                  />
                  Yayınla
                </label>
                <div className="flex gap-2">
                  <button onClick={saveBlog} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Kaydet
                  </button>
                  <button onClick={() => setEditBlog(null)} className="border border-gray-600 text-gray-400 px-4 py-2 rounded-lg text-sm transition-colors hover:border-gray-500">
                    İptal
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {blogList.map((b) => (
                <div key={b.id} className="bg-[#121218] p-4 rounded-lg border border-purple-900/20 flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-bold">{b.title}</h3>
                    <p className="text-gray-500 text-sm">/{b.slug}</p>
                    <span className={`text-xs ${b.isPublished ? "text-green-400" : "text-yellow-400"}`}>
                      {b.isPublished ? "Yayında" : "Taslak"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditBlog(b)}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => deleteBlog(b.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services */}
        {tab === "services" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">Hizmetler</h1>
              <button
                onClick={() => setEditService({ title: "", description: "", icon: "🎵", sortOrder: 0 })}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                + Yeni Hizmet
              </button>
            </div>

            {editService && (
              <div className="bg-[#121218] p-6 rounded-lg border border-purple-500/40 mb-8 space-y-4">
                <h3 className="text-white font-bold">{editService.id ? "Hizmet Düzenle" : "Yeni Hizmet"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Başlık</label>
                    <input
                      value={editService.title || ""}
                      onChange={(e) => setEditService({ ...editService, title: e.target.value })}
                      className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">İkon (emoji)</label>
                    <input
                      value={editService.icon || ""}
                      onChange={(e) => setEditService({ ...editService, icon: e.target.value })}
                      className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Sıra</label>
                    <input
                      type="number"
                      value={editService.sortOrder || 0}
                      onChange={(e) => setEditService({ ...editService, sortOrder: parseInt(e.target.value) })}
                      className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Açıklama</label>
                  <textarea
                    value={editService.description || ""}
                    onChange={(e) => setEditService({ ...editService, description: e.target.value })}
                    className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none resize-none"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={saveService} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Kaydet
                  </button>
                  <button onClick={() => setEditService(null)} className="border border-gray-600 text-gray-400 px-4 py-2 rounded-lg text-sm transition-colors hover:border-gray-500">
                    İptal
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {servicesList.map((s) => (
                <div key={s.id} className="bg-[#121218] p-4 rounded-lg border border-purple-900/20 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <h3 className="text-white font-bold">{s.title}</h3>
                      <p className="text-gray-500 text-sm">{s.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditService(s)}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => deleteService(s.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        {tab === "settings" && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-8">Site Ayarları</h1>
            <div className="bg-[#121218] p-6 rounded-lg border border-purple-900/20 space-y-6">
              {[
                { key: "site_name", label: "Site Adı" },
                { key: "site_tagline", label: "Slogan" },
                { key: "site_description", label: "Açıklama" },
                { key: "about_text", label: "Hakkımızda (Kısa)" },
                { key: "about_full", label: "Hakkımızda (Detay)" },
                { key: "contact_email", label: "E-posta" },
                { key: "contact_phone", label: "Telefon" },
                { key: "contact_address", label: "Adres" },
                { key: "instagram_url", label: "Instagram URL" },
                { key: "youtube_url", label: "YouTube URL" },
                { key: "spotify_url", label: "Spotify URL" },
                { key: "logo_text", label: "Logo Yazısı" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-gray-400 text-sm mb-1">{field.label}</label>
                  {field.key.includes("full") || field.key.includes("description") ? (
                    <textarea
                      value={settings[field.key] || ""}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none resize-none"
                      rows={3}
                    />
                  ) : (
                    <input
                      value={settings[field.key] || ""}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-lg px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
                    />
                  )}
                </div>
              ))}
              <button
                onClick={saveSettings}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Ayarları Kaydet
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

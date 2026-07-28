import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Trash2, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";

const TABS = ["Overview", "Leads", "Proposals", "Subscribers", "Content"];
const RES_TYPES = ["blog", "whitepaper", "press", "event", "webinar"];

function StatCard({ label, value }) {
  return (
    <div className="border border-ink/10 bg-surface p-6">
      <div className="font-mono text-4xl font-semibold text-signal">{value ?? "—"}</div>
      <div className="text-ink2 text-sm mt-2">{label}</div>
    </div>
  );
}

function Table({ cols, rows, render }) {
  return (
    <div className="border border-ink/10 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink/10 bg-surface">
            {cols.map((c) => <th key={c} className="text-left font-mono text-[10px] uppercase tracking-wider text-ink3 px-4 py-3">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={cols.length} className="px-4 py-10 text-center text-ink3">No records yet.</td></tr>
          ) : rows.map((r, i) => render(r, i))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Overview");
  const [stats, setStats] = useState({});
  const [leads, setLeads] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [subs, setSubs] = useState([]);
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "blog", title: "", category: "", excerpt: "", body: "", date_label: "", read_time: "", image: "", external_url: "" });

  useEffect(() => {
    if (!loading && (!user || !user.role)) navigate("/admin/login");
  }, [user, loading, navigate]);

  const loadAll = useCallback(async () => {
    try {
      const [s, l, p, su, r] = await Promise.all([
        api.get("/admin/stats"), api.get("/leads"), api.get("/proposals"), api.get("/newsletter"), api.get("/resources"),
      ]);
      setStats(s.data); setLeads(l.data); setProposals(p.data); setSubs(su.data); setResources(r.data);
    } catch { /* handled by interceptor / auth */ }
  }, []);

  useEffect(() => { if (user && user.role) loadAll(); }, [user, loadAll]);

  const createResource = async (e) => {
    e.preventDefault();
    try {
      await api.post("/resources", { ...form, tags: [] });
      toast.success("Content published.");
      setShowForm(false);
      setForm({ type: "blog", title: "", category: "", excerpt: "", body: "", date_label: "", read_time: "", image: "", external_url: "" });
      loadAll();
    } catch { toast.error("Could not save."); }
  };

  const deleteResource = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await api.delete(`/resources/${id}`);
    toast.success("Deleted.");
    loadAll();
  };

  if (loading || !user) return <div className="min-h-screen bg-bg flex items-center justify-center text-ink3 font-mono text-sm">Loading…</div>;

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-ink/10 sticky top-0 bg-ink/60 backdrop-blur-xl z-10">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-signal" />
            <span className="font-display text-xl font-extrabold">Snowkap</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink3 ml-2">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={loadAll} className="text-ink2 hover:text-ink flex items-center gap-1.5 text-sm"><RefreshCw className="w-4 h-4" /> Refresh</button>
            <button onClick={() => { logout(); navigate("/admin/login"); }} data-testid="admin-logout" className="text-ink2 hover:text-ink flex items-center gap-1.5 text-sm"><LogOut className="w-4 h-4" /> Sign out</button>
          </div>
        </div>
      </header>

      <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-10">
        <div className="flex gap-1 border-b border-ink/10 mb-10 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} data-testid={`admin-tab-${t.toLowerCase()}`}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${tab === t ? "border-signal text-ink" : "border-transparent text-ink2 hover:text-ink"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "Overview" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4" data-testid="admin-overview">
            <StatCard label="Total leads" value={stats.leads} />
            <StatCard label="Proposal requests" value={stats.proposals} />
            <StatCard label="Newsletter subscribers" value={stats.subscribers} />
            <StatCard label="CBAM calculations" value={stats.cbam_calcs} />
            <StatCard label="Published content" value={stats.resources} />
            <StatCard label="Dossiers opened" value={stats.dossiers} />
          </div>
        )}

        {tab === "Leads" && (
          <Table cols={["Type", "Name", "Email", "Company", "Reference", "Date"]} rows={leads}
            render={(r) => (
              <tr key={r.id} className="border-b border-ink/5">
                <td className="px-4 py-3"><span className="font-mono text-[10px] uppercase text-signal">{r.kind}</span></td>
                <td className="px-4 py-3">{r.name || "—"}</td>
                <td className="px-4 py-3 text-ink2">{r.email}</td>
                <td className="px-4 py-3 text-ink2">{r.company || "—"}</td>
                <td className="px-4 py-3 text-ink2">{r.reference || "—"}</td>
                <td className="px-4 py-3 text-ink3 font-mono text-xs">{(r.created_at || "").slice(0, 10)}</td>
              </tr>
            )} />
        )}

        {tab === "Proposals" && (
          <Table cols={["Name", "Company", "Package", "Items", "Email", "Date"]} rows={proposals}
            render={(r) => (
              <tr key={r.id} className="border-b border-ink/5">
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3 text-ink2">{r.company || "—"}</td>
                <td className="px-4 py-3"><span className="font-mono text-[10px] uppercase text-signal">{r.package || "Custom"}</span></td>
                <td className="px-4 py-3 text-ink2">{(r.items || []).length}</td>
                <td className="px-4 py-3 text-ink2">{r.email}</td>
                <td className="px-4 py-3 text-ink3 font-mono text-xs">{(r.created_at || "").slice(0, 10)}</td>
              </tr>
            )} />
        )}

        {tab === "Subscribers" && (
          <Table cols={["Email", "Name", "Company", "Role", "Date"]} rows={subs}
            render={(r) => (
              <tr key={r.id} className="border-b border-ink/5">
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3 text-ink2">{r.name || "—"}</td>
                <td className="px-4 py-3 text-ink2">{r.company || "—"}</td>
                <td className="px-4 py-3"><span className="font-mono text-[10px] uppercase text-signal">{r.role}</span></td>
                <td className="px-4 py-3 text-ink3 font-mono text-xs">{(r.created_at || "").slice(0, 10)}</td>
              </tr>
            )} />
        )}

        {tab === "Content" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl font-bold">Resources ({resources.length})</h3>
              <button onClick={() => setShowForm((v) => !v)} data-testid="admin-new-resource" className="flex items-center gap-2 bg-signal text-bg px-4 py-2.5 font-bold text-sm hover:bg-signal-hover transition-colors">
                <Plus className="w-4 h-4" /> New content
              </button>
            </div>

            {showForm && (
              <form onSubmit={createResource} className="border border-ink/10 bg-surface p-6 mb-8 grid md:grid-cols-2 gap-4" data-testid="admin-resource-form">
                <label className="text-sm md:col-span-1">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-ink3 mb-2">Type</span>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full bg-ink/5 border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-signal">
                    {RES_TYPES.map((t) => <option key={t} value={t} className="bg-surface">{t}</option>)}
                  </select>
                </label>
                <label className="text-sm">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-ink3 mb-2">Category</span>
                  <input data-testid="admin-res-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-ink/5 border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-signal" />
                </label>
                <label className="text-sm md:col-span-2">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-ink3 mb-2">Title</span>
                  <input required data-testid="admin-res-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-ink/5 border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-signal" />
                </label>
                <label className="text-sm">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-ink3 mb-2">Date label</span>
                  <input value={form.date_label} onChange={(e) => setForm({ ...form, date_label: e.target.value })} placeholder="Jun 2026" className="w-full bg-ink/5 border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-signal" />
                </label>
                <label className="text-sm">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-ink3 mb-2">Read time</span>
                  <input value={form.read_time} onChange={(e) => setForm({ ...form, read_time: e.target.value })} placeholder="6 min read" className="w-full bg-ink/5 border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-signal" />
                </label>
                <label className="text-sm">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-ink3 mb-2">Thumbnail image URL</span>
                  <input data-testid="admin-res-image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://…/image.jpg" className="w-full bg-ink/5 border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-signal" />
                </label>
                <label className="text-sm">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-ink3 mb-2">External link (opens on snowkap.com)</span>
                  <input data-testid="admin-res-external" value={form.external_url} onChange={(e) => setForm({ ...form, external_url: e.target.value })} placeholder="https://snowkap.com/…" className="w-full bg-ink/5 border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-signal" />
                </label>
                <label className="text-sm md:col-span-2">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-ink3 mb-2">Excerpt</span>
                  <input data-testid="admin-res-excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full bg-ink/5 border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-signal" />
                </label>
                <label className="text-sm md:col-span-2">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-ink3 mb-2">Body</span>
                  <textarea rows={4} data-testid="admin-res-body" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="w-full bg-ink/5 border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-signal resize-none" />
                </label>
                <div className="md:col-span-2 flex gap-3">
                  <button type="submit" data-testid="admin-resource-save" className="bg-signal text-bg px-6 py-2.5 font-bold text-sm hover:bg-signal-hover transition-colors">Publish</button>
                  <button type="button" onClick={() => setShowForm(false)} className="border border-ink/20 px-6 py-2.5 text-sm">Cancel</button>
                </div>
              </form>
            )}

            <Table cols={["Type", "Title", "Category", "Actions"]} rows={resources}
              render={(r) => (
                <tr key={r.id} className="border-b border-ink/5">
                  <td className="px-4 py-3"><span className="font-mono text-[10px] uppercase text-signal">{r.type}</span></td>
                  <td className="px-4 py-3 max-w-md truncate">{r.title}</td>
                  <td className="px-4 py-3 text-ink2">{r.category || "—"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteResource(r.id)} data-testid={`admin-delete-${r.id}`} className="text-ink3 hover:text-terracotta"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              )} />
          </div>
        )}
      </div>
    </div>
  );
}

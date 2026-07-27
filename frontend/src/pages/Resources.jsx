import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Download, Calendar, PlayCircle, Clock } from "lucide-react";
import Layout from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { useApp } from "@/context/AppContext";
import api from "@/lib/api";

const TABS = [
  { key: "blog", label: "Blog" },
  { key: "whitepaper", label: "Whitepapers" },
  { key: "press", label: "Press" },
  { key: "event", label: "Events" },
  { key: "webinar", label: "Webinars" },
];

export default function Resources() {
  const [tab, setTab] = useState("blog");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setLeadModal } = useApp();

  useEffect(() => {
    setLoading(true);
    api.get(`/resources?type=${tab}`).then((r) => setItems(r.data)).finally(() => setLoading(false));
  }, [tab]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <Layout>
      <section className="pt-40 pb-20 border-b border-white/10 grid-lines">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal mb-5">Resources</div>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tighter max-w-3xl">Everything we know, in one place.</h1>
          <p className="text-ink2 text-lg mt-6 max-w-2xl">Research, regulation trackers, and field notes from advisory engagements across six sectors and every region we operate in.</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <div className="flex flex-wrap gap-2 mb-14 border-b border-white/10 pb-5">
            {TABS.map((t) => (
              <button
                key={t.key} onClick={() => setTab(t.key)}
                data-testid={`resources-tab-${t.key}`}
                className={`px-5 py-2.5 text-sm font-medium border transition-colors ${tab === t.key ? "bg-signal text-bg border-signal" : "border-white/15 text-ink2 hover:border-white/40"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-ink3 font-mono text-sm py-20">Loading…</div>
          ) : items.length === 0 ? (
            <div className="text-ink3 font-mono text-sm py-20">Nothing here yet.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="resources-grid">
              {items.map((r, i) => (
                <Reveal key={r.id} i={i % 3}>
                  <div className="h-full border border-white/10 bg-surface/40 p-7 flex flex-col hover:border-signal/40 transition-colors">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-signal mb-4">{r.category || r.type}</div>
                    <h3 className="font-display text-xl font-semibold leading-snug mb-3">{r.title}</h3>
                    <p className="text-ink2 text-sm leading-relaxed mb-6 flex-1">{r.excerpt}</p>

                    <div className="flex items-center gap-3 flex-wrap text-ink3 font-mono text-[11px] mb-5">
                      {r.date_label && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{r.date_label}</span>}
                      {r.read_time && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{r.read_time}</span>}
                      {r.location && <span>{r.location}</span>}
                      {r.status_label && <span className="uppercase text-signal">{r.status_label}</span>}
                    </div>

                    {tab === "blog" && (
                      <Link to={`/resources/${r.slug}`} data-testid={`resource-read-${r.slug}`} className="group flex items-center gap-1.5 text-signal text-sm font-semibold">
                        Read <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    )}
                    {tab === "whitepaper" && (
                      <button onClick={() => setLeadModal({ kind: "whitepaper", title: "Download whitepaper", reference: r.title })} className="group flex items-center gap-1.5 text-signal text-sm font-semibold">
                        <Download className="w-4 h-4" /> Download
                      </button>
                    )}
                    {tab === "event" && (
                      <button onClick={() => setLeadModal({ kind: "event", title: "Register for event", reference: r.title })} className="group flex items-center gap-1.5 text-signal text-sm font-semibold">
                        <Calendar className="w-4 h-4" /> Register
                      </button>
                    )}
                    {tab === "webinar" && (
                      <button onClick={() => setLeadModal({ kind: "webinar", title: "Access webinar", reference: r.title })} className="group flex items-center gap-1.5 text-signal text-sm font-semibold">
                        <PlayCircle className="w-4 h-4" /> {r.status_label === "upcoming" ? "Register" : "Watch"}
                      </button>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

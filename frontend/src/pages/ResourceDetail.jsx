import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/site/Layout";
import { useApp } from "@/context/AppContext";
import api from "@/lib/api";

export default function ResourceDetail() {
  const { slug } = useParams();
  const [r, setR] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { setLeadModal } = useApp();

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/resources/${slug}`).then((res) => setR(res.data)).catch(() => setNotFound(true));
  }, [slug]);

  return (
    <Layout>
      <article className="pt-40 pb-24 min-h-[70vh]">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <Link to="/resources" className="inline-flex items-center gap-2 text-ink2 hover:text-white text-sm mb-10">
            <ArrowLeft className="w-4 h-4" /> All resources
          </Link>
          {notFound ? (
            <p className="text-ink3">Article not found.</p>
          ) : !r ? (
            <p className="text-ink3 font-mono text-sm">Loading…</p>
          ) : (
            <div data-testid="resource-detail">
              <div className="font-mono text-[11px] uppercase tracking-wider text-signal mb-5">{r.category} · {r.date_label} {r.read_time ? `· ${r.read_time}` : ""}</div>
              <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05] mb-8">{r.title}</h1>
              <p className="text-xl text-ink2 leading-relaxed mb-6 border-l-2 border-signal pl-5">{r.excerpt}</p>
              <div className="text-ink2 leading-relaxed whitespace-pre-line text-lg">{r.body}</div>

              <div className="mt-14 border border-white/10 bg-surface/50 p-8">
                <h3 className="font-display text-2xl font-bold mb-3">Bring this to your supply chain.</h3>
                <p className="text-ink2 mb-6">Talk to an advisor about what this means for your sector and region.</p>
                <button onClick={() => setLeadModal({ kind: "advisor", title: "Talk to an Advisor", reference: r.title })} className="bg-signal text-bg px-6 py-3 font-bold hover:bg-signal-hover transition-colors">
                  Talk to an Advisor
                </button>
              </div>
            </div>
          )}
        </div>
      </article>
    </Layout>
  );
}

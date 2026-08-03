import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { TrendingDown, Info } from "lucide-react";
import SectionHeader from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";
import api, { formatApiError } from "@/lib/api";
import { toast } from "sonner";

const SECTORS = [
  { name: "Iron & Steel", factor: 1.9 },
  { name: "Aluminium", factor: 8.6 },
  { name: "Cement", factor: 0.9 },
  { name: "Fertilisers", factor: 2.1 },
  { name: "Hydrogen", factor: 10.0 },
  { name: "Electricity", factor: 0.45 },
];
const PRICE = 75.36;

export default function CbamCalculator() {
  const [sector, setSector] = useState("Iron & Steel");
  const [tonnes, setTonnes] = useState(10000);
  const [result, setResult] = useState(null);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const timer = useRef(null);

  const compute = useCallback(async (withEmail = false) => {
    try {
      const payload = { sector, annual_tonnes: Number(tonnes), certificate_price: PRICE };
      if (withEmail) { payload.email = email; payload.company = company; }
      const { data } = await api.post("/cbam/calculate", payload);
      setResult(data);
      return data;
    } catch (e) {
      if (withEmail) toast.error(formatApiError(e.response?.data?.detail));
    }
  }, [sector, tonnes, email, company]);

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => compute(false), 350);
    return () => clearTimeout(timer.current);
  }, [sector, tonnes]); // eslint-disable-line

  const emailReport = async (e) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    const data = await compute(true);
    setBusy(false);
    if (data) { setSent(true); toast.success("Report sent to your inbox."); }
  };

  const fmt = (n) => (n == null ? 0 : Math.round(n));

  return (
    <section id="calculator" className="py-20 md:py-24 bg-surface border-t border-ink/10" data-testid="cbam-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-14">
          {/* Sticky explanation */}
          <div className="lg:sticky lg:top-28 h-fit">
            <SectionHeader
              eyebrow="Free tool · Lead magnet"
              title="CBAM Exposure Calculator"
              lede="Software can send a questionnaire — but the math is what moves a CFO. Estimate your annual CBAM liability, and see what verified primary data saves you against default values."
            />
            <div className="border border-ink/10 p-6 bg-bg/50">
              <div className="flex items-center gap-2 text-signal font-mono text-[11px] uppercase tracking-wider mb-3">
                <Info className="w-4 h-4" /> How it works
              </div>
              <p className="text-ink2 text-sm leading-relaxed">
                EU CBAM lets importers surrender certificates on verified emissions — or accept punitive
                <b className="text-ink"> default values</b>. At the Q1 2026 price of
                <b className="text-ink"> €{PRICE}/tCO₂e</b>, the gap between the two is real money, every year.
              </p>
            </div>
          </div>

          {/* Interactive panel */}
          <Reveal>
            <div className="bg-ink/5 backdrop-blur-2xl border border-ink/10 p-7 md:p-9">
              {/* sector */}
              <label className="block font-mono text-[11px] uppercase tracking-wider text-ink2 mb-3">CBAM Sector</label>
              <div className="flex flex-wrap gap-2 mb-8">
                {SECTORS.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSector(s.name)}
                    data-testid={`cbam-sector-${s.name.replace(/[^a-z]/gi, "").toLowerCase()}`}
                    className={`px-3.5 py-2 text-sm border transition-colors ${sector === s.name ? "bg-signal text-bg border-signal font-semibold" : "border-ink/15 text-ink2 hover:border-ink/40"}`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              {/* tonnes */}
              <div className="flex items-baseline justify-between mb-3">
                <label className="font-mono text-[11px] uppercase tracking-wider text-ink2">Annual import volume (tonnes)</label>
                <input
                  type="number"
                  value={tonnes}
                  min={0}
                  onChange={(e) => setTonnes(Math.max(0, Number(e.target.value)))}
                  data-testid="cbam-tonnes-input"
                  className="w-32 bg-transparent border-b border-ink/20 focus:border-signal text-right font-mono text-lg outline-none pb-1"
                />
              </div>
              <input
                type="range" min={100} max={200000} step={100} value={Math.min(tonnes, 200000)}
                onChange={(e) => setTonnes(Number(e.target.value))}
                data-testid="cbam-tonnes-slider"
                className="w-full accent-signal mb-10 cursor-pointer"
              />

              {/* results */}
              <div className="grid grid-cols-2 gap-px bg-ink/10 border border-ink/10 mb-6">
                <div className="bg-bg p-5">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink3 mb-2">Cost on default values</div>
                  <div className="font-mono text-2xl md:text-3xl font-semibold text-terracotta">
                    €<NumberFlow value={fmt(result?.default_cost)} />
                  </div>
                </div>
                <div className="bg-bg p-5">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink3 mb-2">Cost on verified data</div>
                  <div className="font-mono text-2xl md:text-3xl font-semibold text-ink">
                    €<NumberFlow value={fmt(result?.verified_cost)} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border border-signal/40 bg-signal/10 p-5 mb-8" data-testid="cbam-savings">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-5 h-5 text-signal" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-ink2">Potential annual saving</span>
                </div>
                <div className="font-mono text-2xl md:text-3xl font-bold text-signal">
                  €<NumberFlow value={fmt(result?.annual_savings)} />
                </div>
              </div>

              {/* email capture */}
              {sent ? (
                <div className="text-center py-4 border border-ink/10" data-testid="cbam-sent">
                  <p className="text-signal font-semibold">Your report is on its way.</p>
                  <p className="text-ink2 text-sm mt-1">Check your inbox for the full CBAM exposure breakdown.</p>
                </div>
              ) : (
                <form onSubmit={emailReport} className="space-y-3">
                  <p className="text-ink2 text-sm">Get the full breakdown, benchmarked to your sector, in your inbox.</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="email" required placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)}
                      data-testid="cbam-email"
                      className="bg-ink/5 border border-ink/10 focus:border-signal px-4 py-3 text-sm outline-none transition-colors"
                    />
                    <input
                      placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)}
                      data-testid="cbam-company"
                      className="bg-ink/5 border border-ink/10 focus:border-signal px-4 py-3 text-sm outline-none transition-colors"
                    />
                  </div>
                  <button disabled={busy} data-testid="cbam-email-submit" className="w-full bg-signal text-bg py-3.5 font-bold hover:bg-signal-hover transition-colors disabled:opacity-50">
                    {busy ? "Sending…" : "Email me the full report"}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

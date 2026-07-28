import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

// The programme spans two pages — build it on the homepage dossier, review it on
// /pricing — and visitors reload, deep-link, and open things in new tabs. Held
// only in memory, a half-built programme would silently vanish. Storage can
// throw (private mode, blocked cookies), so every access is guarded.
const KEY = "snowkap_programme_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    return v && typeof v === "object" ? v : null;
  } catch {
    return null;
  }
}

export function AppProvider({ children }) {
  const saved = loadState();

  const [tray, setTray] = useState(() => (Array.isArray(saved?.tray) ? saved.tray : [])); // {name, type}
  const [trayOpen, setTrayOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(() => saved?.selectedPackage ?? null);
  const [dossier, setDossier] = useState(() => saved?.dossier ?? null); // {sector, region, stage, company_size, recommended_package}

  // lead modal: { kind, reference, title } or null
  const [leadModal, setLeadModal] = useState(null);
  // proposal modal open
  const [proposalOpen, setProposalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ tray, selectedPackage, dossier }));
    } catch {
      /* storage unavailable — the session still works, it just won't persist */
    }
  }, [tray, selectedPackage, dossier]);

  const addItem = useCallback((name, type) => {
    setTray((prev) => (prev.find((i) => i.name === name) ? prev : [...prev, { name, type }]));
    setTrayOpen(true);
  }, []);

  const removeItem = useCallback((name) => {
    setTray((prev) => prev.filter((i) => i.name !== name));
  }, []);

  const choosePackage = useCallback((id) => {
    setSelectedPackage(id);
    setTrayOpen(true);
  }, []);

  const clearTray = useCallback(() => {
    setTray([]);
    setSelectedPackage(null);
  }, []);

  const value = {
    tray, trayOpen, setTrayOpen, addItem, removeItem, clearTray,
    selectedPackage, choosePackage, setSelectedPackage,
    dossier, setDossier,
    leadModal, setLeadModal,
    proposalOpen, setProposalOpen,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

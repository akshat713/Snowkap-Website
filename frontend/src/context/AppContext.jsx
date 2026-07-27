import React, { createContext, useContext, useState, useCallback } from "react";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [tray, setTray] = useState([]); // array of {name, type}
  const [trayOpen, setTrayOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [dossier, setDossier] = useState(null); // {sector, region, stage, company_size, recommended_package}

  // lead modal: { kind, reference, title } or null
  const [leadModal, setLeadModal] = useState(null);
  // proposal modal open
  const [proposalOpen, setProposalOpen] = useState(false);

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

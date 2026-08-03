import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import "@/App.css";
import SmoothScroll from "@/components/site/SmoothScroll";
import SeoManager from "@/components/site/SeoManager";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import TranslationProvider from "@/i18n/TranslationProvider";
import Home from "@/pages/Home";
import Platform from "@/pages/Platform";
import Services from "@/pages/Services";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import CbamTool from "@/pages/CbamTool";
import Resources from "@/pages/Resources";
import ResourceDetail from "@/pages/ResourceDetail";
import Pricing from "@/pages/Pricing";
import Customers from "@/pages/Customers";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        {/* Outside the router: the language choice outlives navigation, and the
            DOM pass is global rather than per-route. */}
        <TranslationProvider>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <SeoManager />
          <SmoothScroll>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/platform" element={<Platform />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/tools/cbam" element={<CbamTool />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:slug" element={<ResourceDetail />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </SmoothScroll>
        </BrowserRouter>
        </TranslationProvider>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: { background: "#101010", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: 0 },
          }}
        />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;

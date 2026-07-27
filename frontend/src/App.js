import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import "@/App.css";
import SmoothScroll from "@/components/site/SmoothScroll";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import Home from "@/pages/Home";
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
        <BrowserRouter>
          <SmoothScroll>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:slug" element={<ResourceDetail />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </SmoothScroll>
        </BrowserRouter>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: { background: "#111216", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: 0 },
          }}
        />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;

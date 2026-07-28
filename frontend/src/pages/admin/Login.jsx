import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";

export default function AdminLogin() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { if (user && user.role) navigate("/admin"); }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail) || "Login failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-signal" />
          <span className="font-display text-2xl font-extrabold">Snowkap</span>
        </div>
        <div className="border border-ink/10 bg-surface p-8">
          <h1 className="font-display text-2xl font-bold mb-1">Admin sign in</h1>
          <p className="text-ink3 text-sm mb-7">Manage leads, subscribers and content.</p>
          <form onSubmit={submit} className="space-y-4">
            <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              data-testid="admin-email" className="w-full bg-ink/5 border border-ink/10 focus:border-signal px-4 py-3 text-sm outline-none transition-colors" />
            <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              data-testid="admin-password" className="w-full bg-ink/5 border border-ink/10 focus:border-signal px-4 py-3 text-sm outline-none transition-colors" />
            {error && <p className="text-terracotta text-sm" data-testid="admin-error">{error}</p>}
            <button disabled={busy} data-testid="admin-login-submit" className="w-full bg-signal text-bg py-3 font-bold hover:bg-signal-hover transition-colors disabled:opacity-50">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

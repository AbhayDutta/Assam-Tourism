"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register(email, password, name);
    }

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "Operation failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] via-[var(--background)]/95 to-[var(--background)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-xl">
          {/* Header */}
          <div className="border-b border-[var(--border)] bg-gradient-to-r from-[var(--accent-warm)] to-[var(--accent-warm-hover)] p-6 text-center">
            <div className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full bg-white flex items-center justify-center">
              <div className="text-3xl font-bold text-[var(--accent-warm)]">🏛️</div>
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-sm text-white/90">
              {isLogin ? "Login to Assam Tourism Portal" : "Join Assam Tourism Community"}
            </p>
          </div>

          {/* Login/Register Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {!isLogin && (
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--muted)] focus:border-[var(--accent-warm)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-warm)]/20"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--muted)] focus:border-[var(--accent-warm)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-warm)]/20"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--muted)] focus:border-[var(--accent-warm)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-warm)]/20"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[var(--accent-warm)] px-4 py-3 font-medium text-white transition-colors hover:bg-[var(--accent-warm-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (isLogin ? "Logging in..." : "Creating account...") : (isLogin ? "Login" : "Register")}
              </button>
            </form>

            {/* Toggle between Login/Register */}
            <div className="mt-6 text-center">
              <p className="text-sm text-[var(--muted)]">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-[var(--accent-warm)] hover:text-[var(--accent-warm-hover)] font-medium"
                >
                  {isLogin ? "Register here" : "Login here"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

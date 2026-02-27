"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
      <div style={{ background: "white", padding: "2rem", borderRadius: "8px", width: "100%", maxWidth: "400px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", textAlign: "center" }}>
          {isSignUp ? "Create Account" : "Sign In"}
        </h1>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
            style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", border: "1px solid #ddd", borderRadius: "6px", fontSize: "1rem", boxSizing: "border-box" }} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
            style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", border: "1px solid #ddd", borderRadius: "6px", fontSize: "1rem", boxSizing: "border-box" }} />
          {error && <p style={{ color: "red", marginBottom: "1rem", fontSize: "0.875rem" }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "0.75rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", fontSize: "1rem", cursor: "pointer" }}>
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.875rem" }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setIsSignUp(!isSignUp)} style={{ color: "#3b82f6", cursor: "pointer" }}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function AuthPages() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email?.trim() || !password) {
      const msg = "Email aur password Required";
      setError(msg);
      toast.error(msg);
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      setError("");
      toast.success("Login successful");
    } catch (err) {
      const msg = err?.data?.message || err?.message || "Login fail.  check your email/password ";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 border-t-4 border-t-primary shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <span className="text-2xl font-heading font-extrabold text-foreground tracking-tight italic">MicroPe</span>
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Sign In</h1>
            <p className="text-muted-foreground text-sm mt-2 font-medium">
              Admin / Manager dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                placeholder="admin@micrope.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Secure Login"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-3">
            <p className="text-[11px] text-muted-foreground flex items-center gap-2 uppercase tracking-[0.2em] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-success" /> Encrypted Session
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 px-4 leading-relaxed">
          Authorized personnel only. Backend se connect hai.
        </p>
      </motion.div>
    </div>
  );
}

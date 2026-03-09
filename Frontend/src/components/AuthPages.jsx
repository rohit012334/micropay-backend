import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthPages({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, signup } = useAuth();

  // Admin only: managers are added by admin from dashboard and given access
  const role = "admin";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all required fields");
      return;
    }

    if (!isLogin) {
      if (!name) { setError("Please enter your full name"); return; }
      if (password !== confirmPassword) { setError("Passwords do not match"); return; }
      signup(name, email, password, role);
    } else {
      login(email, password, role);
    }
    onAuth();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        key={isLogin ? "login" : "signup"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-heading font-bold text-foreground">MicroPe</span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isLogin ? "Sign in to your dashboard" : "Get started with your dashboard"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                placeholder="you@example.com"
              />
            </div>
            <div className="relative">
              <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition pr-10"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {!isLogin && (
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  placeholder="••••••••"
                />
              </div>
            )}
            {isLogin && (
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" className="rounded border-border bg-secondary" />
                Remember me
              </label>
            )}
            {error && <p className="text-destructive text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-primary hover:underline font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

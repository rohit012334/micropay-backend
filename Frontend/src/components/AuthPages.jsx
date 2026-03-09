import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldCheck, ArrowRight, UserCog, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function AuthPages({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("admin"); // 'admin' or 'manager'
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    // In a real app, the backend would verify credentials and return the role.
    // For now, we use the selectedRole for demo purposes.
    login(email, password, selectedRole);
    toast.success(`Logged in as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`);
    onAuth();
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
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>

          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <span className="text-2xl font-heading font-extrabold text-foreground tracking-tight italic">MicroPe</span>
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Sign In</h1>
            <p className="text-muted-foreground text-sm mt-2 font-medium">
              Access your administrative dashboard
            </p>
          </div>

          {/* Role Switcher */}
          <div className="flex p-1.5 bg-secondary/50 rounded-xl mb-8 border border-border">
            <button
              onClick={() => setSelectedRole("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${selectedRole === "admin"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </button>
            <button
              onClick={() => setSelectedRole("manager")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${selectedRole === "manager"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <UserCog className="w-4 h-4" />
              Manager
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                placeholder="admin@micrope.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                <button type="button" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Forgot?</button>
              </div>
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

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-border bg-secondary text-primary focus:ring-primary/20 cursor-pointer" />
                <span className="group-hover:text-foreground transition-colors">Remember device</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              Secure Login
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-3">
            <p className="text-[11px] text-muted-foreground flex items-center gap-2 uppercase tracking-[0.2em] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-success" /> Encypted Session
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 px-4 leading-relaxed">
          Authorized personnel only. All access attempts are logged and monitored.
          Contact system administrator for credential recovery.
        </p>
      </motion.div>
    </div>
  );
}

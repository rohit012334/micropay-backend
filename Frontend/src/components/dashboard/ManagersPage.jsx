import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus, Mail, Key, Trash2, ShieldCheck, CheckCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { managersApi } from "@/lib/api";

const PERMISSION_OPTIONS = [
  { id: "canManageUsers", label: "Users Management", desc: "View and manage users" },
  { id: "canManageCards", label: "Cards Management", desc: "View and manage cards" },
  { id: "canViewBills", label: "Bill Payments", desc: "View bill payments" },
  { id: "canViewTaxes", label: "Tax Payments", desc: "View tax payments" },
  { id: "canManageBanners", label: "Banners", desc: "Manage banners" },
  { id: "canManageFAQs", label: "FAQ Management", desc: "Manage FAQs" },
  { id: "canSendNotifications", label: "Send Notifications", desc: "Send notifications to users" },
];

function staffToPermissions(staff) {
  return PERMISSION_OPTIONS.filter((opt) => staff[opt.id]).map((opt) => opt.id);
}

export default function ManagersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [addSuccess, setAddSuccess] = useState(false);

  const fetchManagers = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const res = await managersApi.list();
      setManagers(res.data || []);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Managers load nahi ho paye");
      setManagers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, [isAdmin]);

  const togglePermission = (id) => {
    setPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleAddManager = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error("Sirf Admin naye manager add kar sakta hai");
      return;
    }
    if (!email.trim() || !password.trim()) {
      toast.error("Email aur password zaroori hain");
      return;
    }
    const body = {
      name: name.trim() || email.split("@")[0],
      email: email.trim(),
      password,
      canManageUsers: permissions.includes("canManageUsers"),
      canManageCards: permissions.includes("canManageCards"),
      canViewBills: permissions.includes("canViewBills"),
      canViewTaxes: permissions.includes("canViewTaxes"),
      canManageBanners: permissions.includes("canManageBanners"),
      canManageFAQs: permissions.includes("canManageFAQs"),
      canSendNotifications: permissions.includes("canSendNotifications"),
    };
    try {
      await managersApi.create(body);
      setEmail("");
      setPassword("");
      setName("");
      setPermissions([]);
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
      toast.success("Manager add ho gaya");
      fetchManagers();
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Manager add nahi ho paya");
    }
  };

  const removeManager = async (id) => {
    if (!isAdmin) return;
    try {
      await managersApi.delete(id);
      setManagers((prev) => prev.filter((m) => m.id !== id));
      toast.success("Manager remove ho gaya");
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Remove fail");
    }
  };

  if (!isAdmin) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-muted-foreground">Manager list sirf Admin dekh sakta hai.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <UserPlus className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-heading font-semibold text-foreground">Add Manager</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Naya manager banao. Wo email aur password se login karega.
        </p>

        <form onSubmit={handleAddManager} className="space-y-5 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@example.com"
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 flex items-center gap-2">
                <Key className="w-4 h-4" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Display Name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul (Marketing)"
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-3 block flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Permissions
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PERMISSION_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition cursor-pointer ${
                    permissions.includes(opt.id)
                      ? "bg-primary/5 border-primary/30"
                      : "bg-secondary/20 border-border hover:bg-secondary/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={permissions.includes(opt.id)}
                    onChange={() => togglePermission(opt.id)}
                    className="rounded border-border bg-secondary text-primary focus:ring-primary/50"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{opt.label}</p>
                    <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!email.trim() || !password.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            <UserPlus className="w-4 h-4" />
            Create Manager Account
          </button>
        </form>

        {addSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-lg bg-success/10 border border-success/20 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
            <p className="text-sm font-medium text-success">Manager account create ho gaya!</p>
          </motion.div>
        )}
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          Active Managers ({managers.length})
        </h3>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {managers.map((m) => (
              <motion.div
                key={m.id}
                layout
                className="flex flex-col gap-4 p-4 rounded-xl bg-secondary/20 border border-border hover:bg-secondary/30 transition shadow-sm group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {(m.name || m.email || "?").charAt(0)}
                      </div>
                      <p className="text-sm font-bold text-foreground truncate">{m.name || m.email}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {m.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeManager(m.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition opacity-0 group-hover:opacity-100"
                    title="Remove manager"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
                  {staffToPermissions(m).length ? (
                    staffToPermissions(m).map((pid) => {
                      const opt = PERMISSION_OPTIONS.find((o) => o.id === pid);
                      return (
                        <span
                          key={pid}
                          className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider"
                        >
                          {opt?.label?.split(" ")[0] || pid}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                      No permissions
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

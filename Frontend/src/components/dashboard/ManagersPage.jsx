import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Mail, Phone, Trash2, ShieldCheck, CheckCircle } from "lucide-react";

const PERMISSION_OPTIONS = [
  { id: "users", label: "Users Management", desc: "View and manage users" },
  { id: "cards", label: "Cards Management", desc: "View and manage cards" },
  { id: "bills", label: "Bill Payments", desc: "View bill payments" },
  { id: "tax", label: "Tax Payments", desc: "View tax payments" },
  { id: "notifications", label: "Send Notifications", desc: "Send notifications to users" },
];

export default function ManagersPage() {
  const [managers, setManagers] = useState([
    { id: 1, email: "manager1@example.com", phone: "", name: "Raj Manager", permissions: ["users", "cards"] },
  ]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [addSuccess, setAddSuccess] = useState(false);

  const togglePermission = (id) => {
    setPermissions((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const handleAddManager = (e) => {
    e.preventDefault();
    const contact = email.trim() || phone.trim();
    if (!contact) return;
    const newManager = {
      id: Date.now(),
      email: email.trim() || "—",
      phone: phone.trim() || "—",
      name: name.trim() || (email.trim() ? email.split("@")[0] : "Manager"),
      permissions: [...permissions],
    };
    setManagers((prev) => [...prev, newManager]);
    setEmail("");
    setPhone("");
    setName("");
    setPermissions([]);
    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 3000);
  };

  const removeManager = (id) => {
    setManagers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Add Manager form */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <UserPlus className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-heading font-semibold text-foreground">Add Manager</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Add a manager by Email ID or Phone number. Set what they can do in the dashboard.
        </p>

        <form onSubmit={handleAddManager} className="space-y-5 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email ID
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@example.com"
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Add at least one: Email ID or Phone number</p>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Manager name"
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-3 block flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              What can this manager do?
            </label>
            <div className="space-y-2">
              {PERMISSION_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={permissions.includes(opt.id)}
                    onChange={() => togglePermission(opt.id)}
                    className="rounded border-border bg-secondary text-primary focus:ring-primary/50"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!email.trim() && !phone.trim()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4" />
            Add Manager
          </button>
        </form>

        {addSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-lg bg-success/10 border border-success/20 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
            <p className="text-sm font-medium text-success">Manager added. They can sign in with the email/phone you provided.</p>
          </motion.div>
        )}
      </div>

      {/* List of managers */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Added Managers ({managers.length})</h3>
        <div className="space-y-3">
          {managers.map((m) => (
            <motion.div
              key={m.id}
              layout
              className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-secondary/30 border border-border"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{m.name}</p>
                <p className="text-xs text-muted-foreground">
                  {m.email !== "—" && <span className="flex items-center gap-1"><Mail className="w-3 h-3 inline" /> {m.email}</span>}
                  {m.email !== "—" && m.phone !== "—" && " · "}
                  {m.phone !== "—" && <span className="flex items-center gap-1"><Phone className="w-3 h-3 inline" /> {m.phone}</span>}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {m.permissions.length ? (
                    m.permissions.map((pid) => {
                      const opt = PERMISSION_OPTIONS.find((o) => o.id === pid);
                      return (
                        <span key={pid} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">
                          {opt?.label || pid}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-xs text-muted-foreground">No permissions</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeManager(m.id)}
                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                title="Remove manager"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

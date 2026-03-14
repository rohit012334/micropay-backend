// src/pages/admin/OverviewPage.jsx

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, UserCheck, CreditCard, FileWarning } from "lucide-react";
import { DUMMY_USERS, DUMMY_BILLS } from "@/data/dummyData";
import ExportButton from "@/lib/ExportButton";

function CountUp({ target, duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [target, duration]);

  return <>{count.toLocaleString()}</>;
}

const stats = [
  { label: "Total Users", value: 1284, trend: "+12% this month", up: true, icon: Users, color: "text-primary" },
  { label: "Verified Users", value: 986, trend: "76.7% of total", up: true, icon: UserCheck, color: "text-success" },
  { label: "Total Cards Saved", value: 3421, trend: "+8%", up: true, icon: CreditCard, color: "text-primary" },
  { label: "Pending Bills", value: 47, trend: "-3 from yesterday", up: false, icon: FileWarning, color: "text-warning" },
];

const recentSignups = DUMMY_USERS.slice(0, 5);
const recentTransactions = DUMMY_BILLS.slice(0, 5);

// ── Column Definitions for Export ─────────────────────────────────────────────
const userColumns = [
  { header: "Name",        key: "name" },
  { header: "Email",       key: "email" },
  { header: "Phone",       key: "phone" },
  { header: "Signup Date", key: "signupDate" },
  { header: "Verified",    key: "isVerified" },
];

const transactionColumns = [
  { header: "User",     key: "userName" },
  { header: "Category", key: "category" },
  { header: "Amount",   key: "amount" },
  { header: "Status",   key: "status" },
  { header: "Date",     key: "date" },
];

export default function OverviewPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* ── Page Header with Export ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Dashboard summary — {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
          </p>
        </div>

        {/* Export all data button */}
        <ExportButton
          data={[
            ...DUMMY_USERS.map((u) => ({ ...u, _type: "user" })),
          ]}
          filename={`micropay-overview-${new Date().toISOString().split("T")[0]}`}
          title="MicroPay — Overview Report"
          columns={[
            { header: "Name",        key: "name" },
            { header: "Email",       key: "email" },
            { header: "Signup Date", key: "signupDate" },
            { header: "Verified",    key: "isVerified" },
          ]}
        />
      </div>

      {/* ── Stat Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-3xl font-heading font-bold text-foreground mt-1">
                  <CountUp target={s.value} />
                </p>
              </div>
              <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs">
              {s.up
                ? <TrendingUp className="w-3 h-3 text-success" />
                : <TrendingDown className="w-3 h-3 text-warning" />}
              <span className={s.up ? "text-success" : "text-warning"}>{s.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Tables ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Signups */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-foreground">Recent Signups</h3>
            <ExportButton
              data={DUMMY_USERS}
              filename="recent-signups"
              title="MicroPay — Recent Signups"
              columns={userColumns}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-left border-b border-border">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSignups.map((u) => (
                  <tr key={u.id} className="table-row-striped border-b border-border/30">
                    <td className="py-3 text-foreground">{u.name}</td>
                    <td className="py-3 text-muted-foreground">{u.email}</td>
                    <td className="py-3 text-muted-foreground">{u.signupDate}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.isVerified ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                        {u.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-foreground">Recent Transactions</h3>
            <ExportButton
              data={DUMMY_BILLS}
              filename="recent-transactions"
              title="MicroPay — Recent Transactions"
              columns={transactionColumns}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-left border-b border-border">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((b) => (
                  <tr key={b.id} className="table-row-striped border-b border-border/30">
                    <td className="py-3 text-foreground">{b.userName}</td>
                    <td className="py-3 text-muted-foreground">{b.category}</td>
                    <td className="py-3 text-foreground font-medium">₹{b.amount.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        b.status === "Success"  ? "bg-success/10 text-success" :
                        b.status === "Pending"  ? "bg-warning/10 text-warning" :
                                                  "bg-destructive/10 text-destructive"
                      }`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

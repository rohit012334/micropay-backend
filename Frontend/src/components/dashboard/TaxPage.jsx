import { useState } from "react";
import { motion } from "framer-motion";
import { Search, AlertTriangle } from "lucide-react";
import { DUMMY_TAXES } from "@/data/dummyData";

export default function TaxPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = DUMMY_TAXES.filter((t) => {
    const userName = t.userName ?? t.name ?? "";
    const matchSearch = userName.toLowerCase().includes(search.toLowerCase()) || (t.taxType || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const overdueCount = DUMMY_TAXES.filter(t => t.status === "Overdue").length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

      <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by user or tax type..." className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none">
          <option value="all">All Status</option>
          <option value="Filed">Filed</option>
          <option value="Due Soon">Due Soon</option>
          <option value="Overdue">Overdue</option>
          <option value="Processing">Processing</option>
        </select>
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-left border-b border-border">
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Tax Type</th>
              <th className="p-4 font-medium">AY</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Filed On</th>
              <th className="p-4 font-medium">Due Date</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Ref No.</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="table-row-striped border-b border-border/30">
                <td className="p-4 text-foreground font-medium">{t.userName ?? t.name}</td>
                <td className="p-4 text-muted-foreground">{t.taxType}</td>
                <td className="p-4 text-muted-foreground">{t.assessmentYear}</td>
                <td className="p-4 text-foreground font-medium">₹{t.amount.toLocaleString()}</td>
                <td className="p-4 text-muted-foreground">{t.filedOn || "—"}</td>
                <td className="p-4 text-muted-foreground">{t.dueDate}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.status === "Filed" ? "bg-success/10 text-success" :
                      t.status === "Due Soon" ? "bg-warning/10 text-warning" :
                        t.status === "Overdue" ? "bg-destructive/10 text-destructive" :
                          "bg-primary/10 text-primary"
                    }`}>
                    {t.status === "Filed" ? "✅" : t.status === "Due Soon" ? "⚠️" : t.status === "Overdue" ? "🔴" : "🔄"} {t.status}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground font-mono text-xs">{t.refNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

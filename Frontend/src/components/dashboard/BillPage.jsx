import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { DUMMY_BILLS } from "@/data/dummyData";

export default function BillsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = DUMMY_BILLS.filter((b) => {
    const matchSearch = b.userName.toLowerCase().includes(search.toLowerCase()) || b.billerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPaid = DUMMY_BILLS.filter(b => b.status === "Success").reduce((s, b) => s + b.amount, 0);
  const successCount = DUMMY_BILLS.filter(b => b.status === "Success").length;
  const pendingCount = DUMMY_BILLS.filter(b => b.status === "Pending").length;
  const failedCount = DUMMY_BILLS.filter(b => b.status === "Failed").length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Paid", value: `₹${totalPaid.toLocaleString()}`, color: "text-foreground" },
          { label: "Success", value: successCount, color: "text-success" },
          { label: "Pending", value: pendingCount, color: "text-warning" },
          { label: "Failed", value: failedCount, color: "text-destructive" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-xl font-heading font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by user or biller..." className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none">
          <option value="all">All Status</option>
          <option value="Success">Success</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-left border-b border-border">
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Biller</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Gateway</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="table-row-striped border-b border-border/30">
                <td className="p-4 text-foreground font-medium">{b.userName}</td>
                <td className="p-4 text-muted-foreground">{b.billerName}</td>
                <td className="p-4 text-muted-foreground">{b.category}</td>
                <td className="p-4 text-foreground font-medium">₹{b.amount.toLocaleString()}</td>
                <td className="p-4 text-muted-foreground">{b.paymentDate}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${b.status === "Success" ? "bg-success/10 text-success" :
                      b.status === "Pending" ? "bg-warning/10 text-warning" :
                        "bg-destructive/10 text-destructive"
                    }`}>{b.status === "Success" ? "✅" : b.status === "Pending" ? "🔄" : "❌"} {b.status}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${b.gateway === "Razorpay" ? "bg-primary/10 text-primary" : "bg-primary/10 text-primary"}`}>{b.gateway}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

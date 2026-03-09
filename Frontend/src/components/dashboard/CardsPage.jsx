import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { DUMMY_CARDS } from "@/data/dummyData";

export default function CardsPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = DUMMY_CARDS.filter((c) => {
    const matchSearch = c.userName.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || c.cardType === filterType;
    const matchBrand = filterBrand === "all" || c.brand === filterBrand;
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchType && matchBrand && matchStatus;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by user..." className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none">
          <option value="all">All Types</option>
          <option value="Credit">Credit</option>
          <option value="Debit">Debit</option>
        </select>
        <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none">
          <option value="all">All Brands</option>
          <option value="Visa">Visa</option>
          <option value="Mastercard">Mastercard</option>
          <option value="Rupay">Rupay</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none">
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-left border-b border-border">
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Card Type</th>
              <th className="p-4 font-medium">Card Number</th>
              <th className="p-4 font-medium">Brand</th>
              <th className="p-4 font-medium">Added On</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="table-row-striped border-b border-border/30">
                <td className="p-4 text-foreground font-medium">{c.userName}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.cardType === "Credit" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"}`}>
                    {c.cardType}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground font-mono text-xs">{c.maskedNumber}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded-md bg-secondary text-foreground text-xs font-medium">{c.brand}</span>
                </td>
                <td className="p-4 text-muted-foreground">{c.addedOn}</td>
                <td className="p-4">
                  <span className={`text-xs font-medium ${c.isPrimary ? "text-primary" : "text-muted-foreground"}`}>
                    {c.isPrimary ? "Primary" : "Secondary"}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.status === "Active" ? "bg-success/10 text-success" :
                      c.status === "Expired" ? "bg-warning/10 text-warning" :
                        "bg-destructive/10 text-destructive"
                    }`}>{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

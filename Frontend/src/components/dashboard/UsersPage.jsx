import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, ChevronLeft, ChevronRight, X, FileText, CreditCard, ZoomIn } from "lucide-react";
import { DUMMY_USERS, DUMMY_CARDS, getUserDocuments } from "@/data/dummyData";

const ITEMS_PER_PAGE = 6;

function DocumentModal({ user, onClose }) {
  const documents = getUserDocuments(user?.id);
  const [fullImage, setFullImage] = useState(null);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative glass-card w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Documents — {user?.name}
            </h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto space-y-4">
            <p className="text-sm text-muted-foreground mb-1">User-uploaded KYC & financial documents (Aadhaar, PAN, etc.) — click image to zoom</p>
            {documents.map((doc, i) => (
              <div key={i} className="rounded-lg bg-secondary/30 border border-border overflow-hidden">
                <div className="flex gap-4 p-3 flex-wrap sm:flex-nowrap">
                  {/* Document image thumbnail */}
                  <div className="flex-shrink-0">
                    {doc.imageUrl ? (
                      <button
                        type="button"
                        onClick={() => setFullImage(doc.imageUrl)}
                        className="relative block w-24 h-32 sm:w-28 sm:h-36 rounded-lg overflow-hidden border-2 border-border hover:border-primary/50 transition focus:outline-none focus:ring-2 focus:ring-primary/50 group"
                      >
                        <img
                          src={doc.imageUrl}
                          alt={doc.type}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                          <ZoomIn className="w-6 h-6 text-white" />
                        </span>
                      </button>
                    ) : (
                      <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-lg bg-muted/50 border border-border flex items-center justify-center">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-sm font-medium text-foreground">{doc.type}</p>
                    <p className="text-xs text-muted-foreground">Ref: {doc.ref} · Uploaded: {doc.uploadedAt}</p>
                    <span className={`mt-2 inline-flex w-fit px-2.5 py-1 rounded-full text-xs font-medium ${doc.status === "Verified" ? "bg-success/10 text-success" : doc.status === "Pending" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Full-size image overlay */}
        <AnimatePresence>
          {fullImage && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setFullImage(null)}
              >
                <button type="button" className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition" onClick={() => setFullImage(null)}>
                  <X className="w-6 h-6" />
                </button>
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  src={fullImage}
                  alt="Document"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState(() => [...DUMMY_USERS]);
  const [search, setSearch] = useState("");
  const [filterVerified, setFilterVerified] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [viewUser, setViewUser] = useState(null);

  const cardCountByUserId = useMemo(() => {
    const map = {};
    DUMMY_CARDS.forEach((c) => { map[c.userId] = (map[c.userId] || 0) + 1; });
    return map;
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchVerified = filterVerified === "all" || (filterVerified === "verified" ? u.isVerified : !u.isVerified);
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    return matchSearch && matchVerified && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const setUserStatus = (userId, status) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select value={filterVerified} onChange={(e) => { setFilterVerified(e.target.value); setPage(1); }} className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none">
          <option value="all">All Verification</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none">
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="inActive">inActive</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-left border-b border-border">
              <th className="p-4 font-medium">#</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Phone</th>
              <th className="p-4 font-medium">Signup Date</th>
              <th className="p-4 font-medium">Verified</th>
              <th className="p-4 font-medium">Cards</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((u, i) => (
              <tr key={u.id} className="table-row-striped border-b border-border/30">
                <td className="p-4 text-muted-foreground">{(page - 1) * ITEMS_PER_PAGE + i + 1}</td>
                <td className="p-4 text-foreground font-medium">{u.name}</td>
                <td className="p-4 text-muted-foreground">{u.email}</td>
                <td className="p-4 text-muted-foreground">{u.phone}</td>
                <td className="p-4 text-muted-foreground">{u.signupDate}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.isVerified ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    {u.isVerified ? "✅ Verified" : "❌ Unverified"}
                  </span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    <CreditCard className="w-3.5 h-3.5" />
                    {cardCountByUserId[u.id] ?? 0} card{(cardCountByUserId[u.id] ?? 0) !== 1 ? "s" : ""}
                  </span>
                </td>
                <td className="p-4">
                  <select
                    value={u.status}
                    onChange={(e) => setUserStatus(u.id, e.target.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 ${u.status === "Active" ? "border-success/30 text-success" : "border-destructive/30 text-destructive"}`}
                  >
                    <option value="Active">Active</option>
                    <option value="inActive">inActive</option>
                  </select>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => setViewUser(u)}
                    className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition"
                    title="View documents"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing {paginated.length} of {filtered.length} users</p>
        <div className="flex gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-lg bg-secondary/50 border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-medium transition ${page === i + 1 ? "bg-primary text-primary-foreground" : "bg-secondary/50 border border-border text-muted-foreground hover:text-foreground"}`}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-lg bg-secondary/50 border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {viewUser && <DocumentModal user={viewUser} onClose={() => setViewUser(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}

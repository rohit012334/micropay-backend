import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle, Plus, Trash2, Edit2, Save, X, Check,
  ChevronDown, ChevronUp, Search, MessageSquarePlus, ListOrdered
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { faqApi } from "@/lib/api";

export default function FAQPage() {
  const { user } = useAuth();
  const canManage = user?.permissions?.canManageFAQs ?? false;

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFaqs, setNewFaqs] = useState([{ question: "", answer: "" }]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ question: "", answer: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await faqApi.list();
      setFaqs(res.data || []);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "FAQs load nahi ho paye");
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const addMoreRow = () => {
    setNewFaqs([...newFaqs, { question: "", answer: "" }]);
  };

  const removeRow = (index) => {
    if (newFaqs.length === 1) return;
    setNewFaqs(newFaqs.filter((_, i) => i !== index));
  };

  const updateNewFaq = (index, field, value) => {
    const updated = [...newFaqs];
    updated[index][field] = value;
    setNewFaqs(updated);
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!canManage) {
      toast.error("Aapko FAQ edit karne ki permission nahi hai");
      return;
    }
    const validFaqs = newFaqs.filter((f) => f.question.trim() && f.answer.trim());
    if (validFaqs.length === 0) {
      toast.error("Kam se kam ek Q&A pair bhariye");
      return;
    }
    try {
      await faqApi.bulkCreate(validFaqs);
      setNewFaqs([{ question: "", answer: "" }]);
      toast.success(`${validFaqs.length} FAQ add ho gaye`);
      fetchFaqs();
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "FAQ add nahi ho paye");
    }
  };

  const handleDelete = async (id) => {
    if (!canManage) return;
    try {
      await faqApi.delete(id);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      toast.success("FAQ delete ho gaya");
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Delete fail");
    }
  };

  const startEdit = (faq) => {
    if (!canManage) return;
    setEditingId(faq.id);
    setEditData({ question: faq.question, answer: faq.answer });
  };

  const handleUpdate = async () => {
    if (!canManage) return;
    if (!editData.question.trim() || !editData.answer.trim()) {
      toast.error("Question aur Answer khali nahi ho sakte");
      return;
    }
    try {
      const updated = await faqApi.update(editingId, editData);
      setFaqs((prev) => prev.map((f) => (f.id === editingId ? updated.data : f)));
      setEditingId(null);
      toast.success("FAQ update ho gaya");
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Update fail");
    }
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">FAQ Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Backend se FAQs manage karein.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search FAQs..."
            className="pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {canManage && (
          <div className="lg:col-span-12 xl:col-span-4">
            <div className="glass-card p-6 space-y-6 sticky top-24">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MessageSquarePlus className="w-5 h-5 text-primary" />
                Add Multiple FAQs
              </h3>
              <form onSubmit={handleBulkSubmit} className="space-y-6">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {newFaqs.map((row, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-xl border border-border bg-secondary/20 relative group"
                    >
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Question {index + 1}</label>
                          <input
                            type="text"
                            placeholder="What is...?"
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                            value={row.question}
                            onChange={(e) => updateNewFaq(index, "question", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Answer</label>
                          <textarea
                            placeholder="The answer is..."
                            rows={2}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                            value={row.answer}
                            onChange={(e) => updateNewFaq(index, "answer", e.target.value)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={addMoreRow}
                    className="w-full py-2 border-2 border-dashed border-primary/30 text-primary text-sm font-medium rounded-lg hover:border-primary/60 hover:bg-primary/5 transition flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add More Row
                  </button>
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save All FAQs
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className={`space-y-4 ${canManage ? "lg:col-span-12 xl:col-span-8" : "lg:col-span-12"}`}>
          <div className="glass-card p-6 min-h-[600px]">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-primary" />
              Existing FAQs ({filteredFaqs.length})
            </h3>

            {loading ? (
              <p className="text-muted-foreground py-8">Loading...</p>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredFaqs.map((faq) => (
                    <motion.div
                      key={faq.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className={`rounded-xl border transition-all overflow-hidden ${
                        editingId === faq.id ? "border-primary bg-primary/5" : "border-border bg-secondary/10"
                      }`}
                    >
                      {editingId === faq.id ? (
                        <div className="p-4 space-y-4">
                          <div className="space-y-3">
                            <input
                              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none font-semibold"
                              value={editData.question}
                              onChange={(e) => setEditData({ ...editData, question: e.target.value })}
                            />
                            <textarea
                              rows={3}
                              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                              value={editData.answer}
                              onChange={(e) => setEditData({ ...editData, answer: e.target.value })}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-secondary transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleUpdate}
                              className="px-4 py-1.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition flex items-center gap-2"
                            >
                              <Check className="w-4 h-4" /> Update
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 group">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-foreground flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                                {faq.question}
                              </h4>
                              <p className="mt-2 text-muted-foreground text-sm leading-relaxed pl-6">
                                {faq.answer}
                              </p>
                            </div>
                            {canManage && (
                              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                                <button
                                  type="button"
                                  onClick={() => startEdit(faq)}
                                  className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(faq.id)}
                                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredFaqs.length === 0 && !loading && (
                  <div className="py-20 text-center">
                    <HelpCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">No FAQs found.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

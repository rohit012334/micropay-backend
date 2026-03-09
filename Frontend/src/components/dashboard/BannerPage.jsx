import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Upload, Save, Trash2, Layout, Edit2, X, Check, Megaphone } from "lucide-react";
import { toast } from "sonner";

export default function BannerPage() {
    const [banners, setBanners] = useState([
        { id: 1, type: "Hero", title: "Welcome to MicroPe", description: "Your all-in-one payment solution.", image: null },
    ]);

    const [formData, setFormData] = useState({
        type: "Hero",
        title: "",
        description: "",
        image: null
    });

    const [editingId, setEditingId] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.description.trim()) {
            toast.error("Please fill in both title and description");
            return;
        }

        if (editingId) {
            // Update existing
            setBanners(banners.map(b =>
                b.id === editingId ? { ...b, ...formData } : b
            ));
            toast.success("Banner updated successfully");
            setEditingId(null);
        } else {
            // Add new
            const newBanner = {
                id: Date.now(),
                ...formData
            };
            setBanners([newBanner, ...banners]);
            toast.success("Banner added successfully");
        }

        // Reset form
        setFormData({ type: "Hero", title: "", description: "", image: null });
    };

    const handleEdit = (banner) => {
        setEditingId(banner.id);
        setFormData({
            type: banner.type,
            title: banner.title,
            description: banner.description,
            image: banner.image
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        setBanners(banners.filter(b => b.id !== id));
        toast.success("Banner removed");
        if (editingId === id) {
            setEditingId(null);
            setFormData({ type: "Hero", title: "", description: "", image: null });
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ type: "Hero", title: "", description: "", image: null });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-foreground">Banner Management</h2>
                    <p className="text-sm text-muted-foreground mt-1">Configure promotional and informational banners for the mobile app.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            {editingId ? <Edit2 className="w-5 h-5 text-warning" /> : <Layout className="w-5 h-5 text-primary" />}
                            {editingId ? "Edit Banner" : "Create New Banner"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Banner Type</label>
                                <select
                                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="Hero">Hero Banner (Main)</option>
                                    <option value="Promotional">Promotional</option>
                                    <option value="Offer">Special Offer</option>
                                    <option value="Informational">Informational</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Title</label>
                                <input
                                    type="text"
                                    placeholder="Catchy headline"
                                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Description</label>
                                <textarea
                                    placeholder="Detailed message..."
                                    rows={3}
                                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Banner Image</label>
                                <div className="relative border-2 border-dashed border-border rounded-xl p-4 transition-colors hover:border-primary/50 group">
                                    {formData.image ? (
                                        <div className="relative aspect-video rounded-lg overflow-hidden">
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, image: null })}
                                                className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full hover:bg-destructive/90 transition shadow-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center gap-2 cursor-pointer py-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                                <Upload className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-medium text-muted-foreground">Upload banner asset</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="flex-1 py-2.5 bg-secondary text-foreground font-medium rounded-lg hover:bg-secondary/80 transition flex items-center justify-center gap-2"
                                    >
                                        <X className="w-4 h-4" /> Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className={`flex-[2] py-2.5 font-medium rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${editingId
                                            ? "bg-warning text-warning-foreground shadow-warning/20 hover:bg-warning/90"
                                            : "bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90"
                                        }`}
                                >
                                    {editingId ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                    {editingId ? "Update Banner" : "Save Banner"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Preview List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Megaphone className="w-5 h-5 text-primary" />
                            Live Banners
                        </h3>
                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {banners.map((banner) => (
                                    <motion.div
                                        key={banner.id}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className={`flex flex-col sm:flex-row gap-4 p-4 rounded-xl border transition-all group ${editingId === banner.id ? "border-warning bg-warning/5" : "border-border bg-secondary/20 hover:bg-secondary/30"
                                            }`}
                                    >
                                        <div className="w-full sm:w-40 aspect-video rounded-lg bg-secondary/50 flex-shrink-0 flex items-center justify-center overflow-hidden border border-border">
                                            {banner.image ? (
                                                <img src={banner.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${banner.type === 'Hero' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
                                                    }`}>
                                                    {banner.type}
                                                </span>
                                                <h4 className="font-bold text-foreground truncate">{banner.title}</h4>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{banner.description}</p>
                                        </div>
                                        <div className="flex sm:flex-col gap-2 justify-end sm:justify-start">
                                            <button
                                                onClick={() => handleEdit(banner)}
                                                className="p-2.5 text-muted-foreground hover:text-warning hover:bg-warning/10 rounded-lg transition-colors"
                                                title="Edit Banner"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(banner.id)}
                                                className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                title="Delete Banner"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {banners.length === 0 && (
                                <div className="py-12 text-center border-2 border-dashed border-border rounded-xl">
                                    <ImageIcon className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                                    <p className="text-muted-foreground">No banners active. Create one to get started.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

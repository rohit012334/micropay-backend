import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, ShoppingBag, Terminal, X, Check } from "lucide-react";
import { toast } from "sonner";

export default function ServicesPage() {
    const [services, setServices] = useState([
        { id: 1, title: "Bill Payments", image: null },
        { id: 2, title: "Tax Payments", image: null },
    ]);

    const [formData, setFormData] = useState({
        title: "",
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
        if (!formData.title.trim()) {
            toast.error("Please enter a service title");
            return;
        }

        if (editingId) {
            // Update existing
            setServices(services.map(s =>
                s.id === editingId ? { ...s, ...formData } : s
            ));
            toast.success("Service updated successfully");
            setEditingId(null);
        } else {
            // Add new
            const newService = {
                id: Date.now(),
                ...formData
            };
            setServices([newService, ...services]);
            toast.success("Service added successfully");
        }

        // Reset form
        setFormData({ title: "", image: null });
    };

    const handleEdit = (service) => {
        setEditingId(service.id);
        setFormData({ title: service.title, image: service.image });
        // Scroll to form or top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        setServices(services.filter(s => s.id !== id));
        toast.success("Service deleted");
        if (editingId === id) {
            setEditingId(null);
            setFormData({ title: "", image: null });
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ title: "", image: null });
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
                    <h2 className="text-2xl font-heading font-bold text-foreground">Services (Our Product)</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage the products and services displayed on the app.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Form Card */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 space-y-4 sticky top-24">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            {editingId ? <Edit2 className="w-5 h-5 text-warning" /> : <ShoppingBag className="w-5 h-5 text-primary" />}
                            {editingId ? "Edit Service" : "Add New Service"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Service Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Mobile Recharge"
                                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Service Image</label>
                                <div className="relative border-2 border-dashed border-border rounded-xl p-4 transition-colors hover:border-primary/50 group">
                                    {formData.image ? (
                                        <div className="relative aspect-square rounded-lg overflow-hidden">
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
                                                <Plus className="w-6 h-6" />
                                            </div>
                                            <span className="text-xs font-medium text-muted-foreground">Upload Icon</span>
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
                                    {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    {editingId ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Existing Services Grid */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <AnimatePresence mode="popLayout">
                            {services.map((service) => (
                                <motion.div
                                    key={service.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`glass-card group relative p-6 flex flex-col items-center justify-center text-center transition-all border-2 ${editingId === service.id ? "border-warning bg-warning/5" : "hover:border-primary/50"
                                        }`}
                                >
                                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="p-2 text-muted-foreground hover:text-warning hover:bg-warning/10 rounded-lg transition"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 shadow-xl ${editingId === service.id ? "bg-warning/20 text-warning" : "bg-primary/10 text-primary group-hover:scale-110 shadow-primary/10"
                                        }`}>
                                        {service.image ? (
                                            <img src={service.image} alt="" className="w-full h-full object-cover rounded-2xl" />
                                        ) : (
                                            <Terminal className="w-10 h-10" />
                                        )}
                                    </div>

                                    <h4 className="font-bold text-foreground text-lg mb-1">{service.title}</h4>
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
                                        {editingId === service.id ? "Editing Mode" : "Available Product"}
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {services.length === 0 && (
                            <div className="col-span-full py-20 text-center glass-card border-dashed border-2">
                                <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-muted-foreground">No services added yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

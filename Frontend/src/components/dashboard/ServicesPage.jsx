import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Trash2,
    Edit2,
    Image as ImageIcon,
    Upload,
    Save,
    Search,
    Filter,
    ChevronRight,
    ChevronDown,
    Tag,
    Package,
    IndianRupee,
    Loader2,
    X,
    Check,
    ShoppingBag
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export default function ServicesPage() {
    const [activeTab, setActiveTab] = useState("categories");
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form States
    const [categoryForm, setCategoryForm] = useState({ name: "", imageUrl: "" });
    const [productForm, setProductForm] = useState({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        categoryId: ""
    });

    const [editingCategory, setEditingCategory] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedCats, setExpandedCats] = useState({});

    const toggleCat = (id) => {
        setExpandedCats(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [catRes, prodRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/master/categories`),
                axios.get(`${API_BASE_URL}/master/products`)
            ]);
            setCategories(catRes.data.data || []);
            setProducts(prodRes.data.data || []);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'category') {
                    setCategoryForm({ ...categoryForm, imageUrl: reader.result });
                } else {
                    setProductForm({ ...productForm, imageUrl: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Category Handlers
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        if (!categoryForm.name.trim()) return toast.error("Category name is required");

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("staffToken");
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (editingCategory) {
                await axios.put(`${API_BASE_URL}/staff/categories/${editingCategory.id}`, categoryForm, config);
                toast.success("Category updated");
            } else {
                await axios.post(`${API_BASE_URL}/staff/categories`, categoryForm, config);
                toast.success("Category created");
            }
            setCategoryForm({ name: "", imageUrl: "" });
            setEditingCategory(null);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteCategory = async (id) => {
        if (!confirm("Delete this category? All products in it will be removed.")) return;
        try {
            const token = localStorage.getItem("staffToken");
            await axios.delete(`${API_BASE_URL}/staff/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Category deleted");
            fetchData();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    // Product Handlers
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        if (!productForm.name || !productForm.categoryId || !productForm.price) {
            return toast.error("Please fill required fields");
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("staffToken");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { ...productForm, price: parseFloat(productForm.price) };

            if (editingProduct) {
                await axios.put(`${API_BASE_URL}/staff/products/${editingProduct.id}`, payload, config);
                toast.success("Product updated");
            } else {
                await axios.post(`${API_BASE_URL}/staff/products`, payload, config);
                toast.success("Product added");
            }
            setProductForm({ name: "", description: "", price: "", imageUrl: "", categoryId: "" });
            setEditingProduct(null);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteProduct = async (id) => {
        if (!confirm("Delete this product?")) return;
        try {
            const token = localStorage.getItem("staffToken");
            await axios.delete(`${API_BASE_URL}/staff/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Product deleted");
            fetchData();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-foreground">Our Products & Services</h2>
                    <p className="text-sm text-muted-foreground mt-1">Add product categories (Air Purifier, etc.) and their products.</p>
                </div>

                <div className="flex bg-secondary/50 p-1 rounded-xl border border-border">
                    <button
                        onClick={() => setActiveTab("categories")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "categories" ? "bg-primary text-primary-foreground shadow-lg font-bold" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                    >
                        Categories
                    </button>
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "products" ? "bg-primary text-primary-foreground shadow-lg font-bold" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                    >
                        Products
                    </button>
                </div>
            </div>

            <motion.div
                key="management-tab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 sticky top-24">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                            {activeTab === "categories" ? (
                                <Tag className="w-5 h-5 text-primary" />
                            ) : (
                                <Package className="w-5 h-5 text-primary" />
                            )}
                            {activeTab === "categories"
                                ? (editingCategory ? "Edit Category" : "New Category")
                                : (editingProduct ? "Edit Product" : "New Product")
                            }
                        </h3>

                        {activeTab === "categories" ? (
                            <form onSubmit={handleCategorySubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Category Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Air Purifiers"
                                        className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                                        value={categoryForm.name}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Category Image</label>
                                    <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors">
                                        {categoryForm.imageUrl ? (
                                            <div className="relative aspect-square">
                                                <img src={categoryForm.imageUrl} className="w-full h-full object-cover rounded-lg" />
                                                <button
                                                    type="button"
                                                    onClick={() => setCategoryForm({ ...categoryForm, imageUrl: "" })}
                                                    className="absolute -top-2 -right-2 p-1 bg-destructive text-white rounded-full shadow-lg"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer">
                                                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                                <span className="text-xs text-muted-foreground">Upload Image</span>
                                                <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'category')} />
                                            </label>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    {editingCategory && (
                                        <button
                                            type="button"
                                            onClick={() => { setEditingCategory(null); setCategoryForm({ name: "", imageUrl: "" }); }}
                                            className="flex-1 py-2 bg-secondary text-foreground rounded-lg font-medium"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingCategory ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                        {editingCategory ? "Update" : "Create"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleProductSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Category</label>
                                    <select
                                        className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                                        value={productForm.categoryId}
                                        onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Product Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Sharp Air Purifier"
                                        className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                                        value={productForm.name}
                                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Price (₹)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full bg-secondary/30 border border-border rounded-lg pl-9 pr-3 py-2 text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                                            value={productForm.price}
                                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Description</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Product description..."
                                        className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                                        value={productForm.description}
                                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Product Image</label>
                                    <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors">
                                        {productForm.imageUrl ? (
                                            <div className="relative aspect-video">
                                                <img src={productForm.imageUrl} className="w-full h-full object-cover rounded-lg" />
                                                <button
                                                    type="button"
                                                    onClick={() => setProductForm({ ...productForm, imageUrl: "" })}
                                                    className="absolute -top-2 -right-2 p-1 bg-destructive text-white rounded-full shadow-lg"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer">
                                                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                                <span className="text-xs text-muted-foreground">Upload Photo</span>
                                                <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'product')} />
                                            </label>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    {editingProduct && (
                                        <button
                                            type="button"
                                            onClick={() => { setEditingProduct(null); setProductForm({ name: "", description: "", price: "", imageUrl: "", categoryId: "" }); }}
                                            className="flex-1 py-2 bg-secondary text-foreground rounded-lg font-medium"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingProduct ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                        {editingProduct ? "Update Product" : "Save Product"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence mode="wait">
                        {activeTab === "categories" ? (
                            <motion.div
                                key="cat-list"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                {categories.map((cat) => (
                                    <div key={cat.id} className="glass-card p-4 flex items-center gap-4 group hover:ring-2 hover:ring-primary/20 transition-all">
                                        <div className="w-16 h-16 rounded-xl bg-secondary/50 overflow-hidden flex-shrink-0 border border-border">
                                            {cat.imageUrl ? (
                                                <img src={cat.imageUrl} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                                    <Tag className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-foreground">{cat.name}</h4>
                                            <p className="text-xs text-muted-foreground">{cat.products?.length || 0} Products</p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingCategory(cat);
                                                    setCategoryForm({ name: cat.name, imageUrl: cat.imageUrl });
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteCategory(cat.id)}
                                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {categories.length === 0 && (
                                    <div className="col-span-full py-12 text-center glass-card border-dashed bg-secondary/10">
                                        <Tag className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                                        <p className="text-muted-foreground">No categories found. Start by adding one.</p>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="prod-list"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                {categories.map((cat) => {
                                    const isExpanded = expandedCats[cat.id];
                                    return (
                                        <div key={cat.id} className="space-y-4 pt-4 first:pt-0">
                                            <button
                                                onClick={() => toggleCat(cat.id)}
                                                className="w-full flex items-center justify-between border-b border-border pb-2 sticky top-[100px] bg-background/80 backdrop-blur-sm z-[5] group cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                                                        {cat.imageUrl ? (
                                                            <img src={cat.imageUrl} className="w-full h-full object-cover rounded-xl" />
                                                        ) : (
                                                            <Tag className="w-5 h-5 text-primary" />
                                                        )}
                                                    </div>
                                                    <div className="text-left">
                                                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                                                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                                                            {cat.products?.length || 0} {cat.products?.length === 1 ? 'Product' : 'Products'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <motion.div
                                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="p-2 text-muted-foreground group-hover:text-primary"
                                                >
                                                    <ChevronDown className="w-5 h-5" />
                                                </motion.div>
                                            </button>

                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="grid grid-cols-1 gap-4 pb-4">
                                                            {cat.products?.map((prod) => (
                                                                <div key={prod.id} className="glass-card p-4 flex flex-col sm:flex-row gap-4 group hover:ring-2 hover:ring-primary/20 transition-all">
                                                                    <div className="w-full sm:w-32 aspect-video sm:aspect-square rounded-xl bg-secondary/50 overflow-hidden flex-shrink-0 border border-border">
                                                                        {prod.imageUrl ? (
                                                                            <img src={prod.imageUrl} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                                                                <Package className="w-8 h-8" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-start justify-between">
                                                                            <div className="flex-1">
                                                                                <div className="flex items-center gap-2 mb-1">
                                                                                    <h4 className="font-bold text-foreground truncate">{prod.name}</h4>
                                                                                </div>
                                                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2 leading-relaxed">{prod.description}</p>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <p className="text-lg font-bold text-primary">₹{prod.price}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex justify-end gap-2 mt-2">
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setEditingProduct(prod);
                                                                                    setProductForm({
                                                                                        name: prod.name,
                                                                                        description: prod.description || "",
                                                                                        price: prod.price.toString(),
                                                                                        imageUrl: prod.imageUrl || "",
                                                                                        categoryId: prod.categoryId
                                                                                    });
                                                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                                }}
                                                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20"
                                                                            >
                                                                                <Edit2 className="w-3.5 h-3.5" /> Edit
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    deleteProduct(prod.id);
                                                                                }}
                                                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-transparent hover:border-destructive/20"
                                                                            >
                                                                                <Trash2 className="w-3.5 h-3.5" /> Delete
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {(!cat.products || cat.products.length === 0) && (
                                                                <div className="py-8 text-center border-2 border-dashed border-border rounded-2xl bg-secondary/5">
                                                                    <Package className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                                                                    <p className="text-xs text-muted-foreground italic">No products added in this category yet.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}

                                {categories.length === 0 && (
                                    <div className="py-12 text-center glass-card border-dashed bg-secondary/10">
                                        <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                                        <p className="text-muted-foreground">No categories found. Add categories first to see products.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}

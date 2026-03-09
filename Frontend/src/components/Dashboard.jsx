import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, Users, CreditCard, Receipt, Landmark, Settings, LogOut,
  ChevronLeft, ChevronRight, Search, Bell, ShieldCheck, UserCog
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import OverviewPage from "./dashboard/OverviewPage";
import UsersPage from "./dashboard/UsersPage";
import CardsPage from "./dashboard/CardsPage";
import BillPage from "./dashboard/BillPage";
import TaxPage from "./dashboard/TaxPage";
import SettingsPage from "./dashboard/SettingsPage";
import NotificationsPage from "./dashboard/NotificationsPage";
import ManagersPage from "./dashboard/ManagersPage";

const allNavItems = [
  { id: "overview", label: "Overview", icon: BarChart3, adminOnly: false },
  { id: "users", label: "Users", icon: Users, adminOnly: false },
  { id: "cards", label: "Cards", icon: CreditCard, adminOnly: false },
  { id: "bills", label: "Bill Payments", icon: Receipt, adminOnly: true },
  { id: "tax", label: "Tax Payments", icon: Landmark, adminOnly: true },
  { id: "notifications", label: "Notifications", icon: Bell, adminOnly: true },
  { id: "managers", label: "Add Manager", icon: UserCog, adminOnly: true },
  { id: "settings", label: "Settings", icon: Settings, adminOnly: false },
];

const pageComponents = {
  overview: OverviewPage,
  users: UsersPage,
  cards: CardsPage,
  bills: BillPage,
  tax: TaxPage,
  notifications: NotificationsPage,
  managers: ManagersPage,
  settings: SettingsPage,
};

const pageTitles = {
  overview: "Overview",
  users: "Users Management",
  cards: "Cards Management",
  bills: "Bill Payments",
  tax: "Tax Payments",
  notifications: "Send Notifications",
  managers: "Add Manager",
  settings: "Settings",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);


  if (!user) return null;

  const navItems = allNavItems.filter(item => user.role === "admin" || !item.adminOnly);
  const ActiveComponent = pageComponents[activePage];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-screen sticky top-0 flex flex-col border-r border-sidebar-border bg-sidebar overflow-hidden"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-3 font-heading font-bold text-foreground whitespace-nowrap"
              >
                MicroPe Dashboard
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activePage === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="px-2 pb-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
          </button>
        </div>

        {/* User info */}
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${user.role === "admin" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"}`}>
                    {user.role === "admin" ? "Admin" : "Manager"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && (
              <button onClick={logout} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-xl font-heading font-bold text-foreground">{pageTitles[activePage]}</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-secondary transition">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg border border-border">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm text-foreground font-medium hidden sm:inline">{user.name}</span>
              {user.role === "admin" ? <ShieldCheck className="w-4 h-4 text-warning" /> : <UserCog className="w-4 h-4 text-primary" />}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
}

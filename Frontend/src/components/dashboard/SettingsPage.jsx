import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Lock, Palette, Globe, Eye, EyeOff } from "lucide-react";
import { staffApi } from "@/lib/api";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordMessage, setPasswordMessage] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("Please fill all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage("New password and confirm password do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessage("New password must be at least 8 characters.");
      return;
    }
    try {
      await staffApi.changePassword({ currentPassword, newPassword, confirmPassword });
      setPasswordMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage(error.message || "Failed to change password.");
    }
  };

  const items = [
    { id: "security", icon: Lock, label: "Security", desc: "Password and 2FA settings" },
    { id: "appearance", icon: Palette, label: "Appearance", desc: "Theme and display options" },
    { id: "language", icon: Globe, label: "Language", desc: "Language and region settings" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-heading font-semibold text-foreground">Settings</h2>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="space-y-3">
              <div
                onClick={() => setActiveSection(activeSection === item.id ? null : item.id)}
                className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 border border-border/30 hover:bg-secondary/50 transition cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>

              {/* Change password – right below Security */}
              {item.id === "security" && activeSection === "security" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="pl-4 ml-2 border-l-2 border-primary/30"
                >
                  <h3 className="text-sm font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Change password
                  </h3>
                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
                    <div className="relative">
                      <label className="text-sm text-muted-foreground mb-1.5 block">Current password</label>
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 pr-10"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPasswords((s) => ({ ...s, current: !s.current }))} className="absolute right-3 top-9 text-muted-foreground hover:text-foreground">
                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="relative">
                      <label className="text-sm text-muted-foreground mb-1.5 block">New password</label>
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 pr-10"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPasswords((s) => ({ ...s, new: !s.new }))} className="absolute right-3 top-9 text-muted-foreground hover:text-foreground">
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="relative">
                      <label className="text-sm text-muted-foreground mb-1.5 block">Confirm new password</label>
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 pr-10"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPasswords((s) => ({ ...s, confirm: !s.confirm }))} className="absolute right-3 top-9 text-muted-foreground hover:text-foreground">
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordMessage && (
                      <p className={`text-sm ${passwordMessage === "Password changed successfully." ? "text-success" : "text-destructive"}`}>
                        {passwordMessage}
                      </p>
                    )}
                    <button type="submit" className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition">
                      Update password
                    </button>
                  </form>
                </motion.div>
              )}

              {item.id !== "security" && activeSection === item.id && (
                <p className="text-xs text-muted-foreground pl-4 ml-2 border-l-2 border-border">This section is for display. Configure in app later.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

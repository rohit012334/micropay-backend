import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Send, Users, CheckCircle } from "lucide-react";
import { DUMMY_USERS } from "@/data/dummyData";

export default function NotificationsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [sent, setSent] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-heading font-semibold text-foreground">Send notification to all users</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          This notification will be sent to every registered user ({DUMMY_USERS.length} users).
        </p>

        <form onSubmit={handleSend} className="space-y-4 max-w-xl">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title"
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message to all users..."
              rows={4}
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
              <option value="alert">Alert</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={!title.trim() || !message.trim()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Send to all {DUMMY_USERS.length} users
          </button>
        </form>

        {sent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-lg bg-success/10 border border-success/20 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-success">Notification sent</p>
              <p className="text-xs text-muted-foreground">Delivered to all {DUMMY_USERS.length} registered users. (Demo – integrate with backend for real delivery)</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="glass-card p-4">
        <h3 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Recipients ({DUMMY_USERS.length} users)
        </h3>
        <div className="flex flex-wrap gap-2">
          {DUMMY_USERS.map((u) => (
            <span key={u.id} className="px-2.5 py-1 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground">
              {u.name} ({u.email})
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

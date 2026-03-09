import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import AuthPages from "@/components/AuthPages";
import Dashboard from "@/components/Dashboard";

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }
  if (!user) {
    return <AuthPages />;
  }
  return <Dashboard />;
}

const index = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default index;

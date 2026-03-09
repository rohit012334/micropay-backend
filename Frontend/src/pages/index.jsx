import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import AuthPages from "@/components/AuthPages";
import Dashboard from "@/components/Dashboard";

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <AuthPages onAuth={() => {}} />;
  }

  return <Dashboard />;
}

const Index = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default Index;

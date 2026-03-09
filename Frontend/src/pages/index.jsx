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

const index = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default index;

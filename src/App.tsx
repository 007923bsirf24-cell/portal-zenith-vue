import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReconProvider } from "@/contexts/ReconContext";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Dashboards from "./pages/Dashboards";
import DashboardViewer from "./pages/DashboardViewer";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import IntercompanyReconciliation from "./pages/IntercompanyReconciliation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <AuthProvider>
        <ReconProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/" element={<Index />} />
                <Route path="/dashboards" element={<Dashboards />} />
                <Route path="/dashboard/:id" element={<DashboardViewer />} />
                <Route
                  path="/intercompany-reconciliation"
                  element={
                    <ProtectedRoute>
                      <IntercompanyReconciliation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute requirePermission="manage_settings">
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </ReconProvider>
      </AuthProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;

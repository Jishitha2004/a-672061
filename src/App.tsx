
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import CreateMemePage from "./pages/CreateMemePage";
import ProfilePage from "./pages/ProfilePage";
import MemeDetailsPage from "./pages/MemeDetailsPage";
import NotFound from "./pages/NotFound";
import { MemeProvider } from "./contexts/MemeContext";
import { AuthProvider } from "./contexts/AuthContext";

// Create query client with enhanced configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Application main component with properly nested providers
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemeProvider>
          <BrowserRouter>
            <TooltipProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/create" element={<CreateMemePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/meme/:id" element={<MemeDetailsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </TooltipProvider>
          </BrowserRouter>
          <Toaster position="top-right" />
        </MemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

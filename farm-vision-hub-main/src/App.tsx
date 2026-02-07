import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import StorageRoom from "./pages/StorageRoom";
import MandiRates from "./pages/MandiRates";
import LeafHealth from "./pages/LeafHealth";
import NotFound from "./pages/NotFound";
import { SensorDataProvider } from "./hooks/useSensorData";
import { ActuatorsProvider } from "./hooks/useActuators";
import { StorageBatchesProvider } from "./hooks/useStorageBatches";
import GovtSchemes from "./pages/GovtSchemes";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SensorDataProvider>
        <ActuatorsProvider>
          <StorageBatchesProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/storage" element={<StorageRoom />} />
                  <Route path="/mandi" element={<MandiRates />} />
                  <Route path="/leaf-health" element={<LeafHealth />} />
                  <Route path="/schemes" element={<GovtSchemes />} />

                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </StorageBatchesProvider>
        </ActuatorsProvider>
      </SensorDataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

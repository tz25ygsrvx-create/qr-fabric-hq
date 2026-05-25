import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ScanPage from "./pages/ScanPage";
import RollDetail from "./pages/RollDetail";
import SKUList from "./pages/SKUList";
import SKUDetail from "./pages/SKUDetail";
import IssuePage from "./pages/IssuePage";
import AddRollPage from "./pages/AddRollPage";
import SKUEditPage from "./pages/SKUEditPage";
import MovePage from "./pages/MovePage";
import RollsListPage from "./pages/RollsListPage";
import LocationsPage from "./pages/LocationsPage";
import ReportsPage from "./pages/ReportsPage";
import FromQuotePage from "./pages/FromQuotePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/roll/:rollId" element={<RollDetail />} />
          <Route path="/sku" element={<SKUList />} />
          <Route path="/sku/new" element={<SKUEditPage />} />
          <Route path="/sku/:skuCode" element={<SKUDetail />} />
          <Route path="/sku/:skuCode/edit" element={<SKUEditPage />} />
          <Route path="/issue" element={<IssuePage />} />
          <Route path="/add-roll" element={<AddRollPage />} />
          <Route path="/move" element={<MovePage />} />
          <Route path="/rolls" element={<RollsListPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

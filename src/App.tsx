
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { MigrationStatus } from "@/components/MigrationStatus";
import Index from "./pages/Index";
import SchoolDetail from "./pages/SchoolDetail";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import CookiesPolicy from "./pages/CookiesPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <MigrationStatus />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/escuela/:slug" element={<SchoolDetail />} />
            <Route path="/school/:slug" element={<SchoolDetail />} />
            
            {/* About Us routes */}
            <Route path="/sobre-nosotros" element={<AboutUs />} />
            <Route path="/about-us" element={<AboutUs />} />
            
            {/* Contact routes */}
            <Route path="/contacto" element={<Contact />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Legal pages */}
            <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/politica-cookies" element={<CookiesPolicy />} />
            <Route path="/cookies-policy" element={<CookiesPolicy />} />
            <Route path="/terminos-uso" element={<TermsOfUse />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

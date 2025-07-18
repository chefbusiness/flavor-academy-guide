
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Index from "./pages/Index";
import SchoolDetail from "./pages/SchoolDetail";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import CookiesPolicy from "./pages/CookiesPolicy";
import NotFound from "./pages/NotFound";
import ImageManager from "./pages/ImageManager";
import Auth from "./pages/Auth";
import AdminSetup from "./pages/AdminSetup";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageProvider>
            <AuthProvider>
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
            
            {/* Image Manager */}
            <Route path="/image-manager" element={<ImageManager />} />
            
            {/* Authentication */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            
            {/* Admin Setup */}
            <Route path="/admin/setup" element={<AdminSetup />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AuthProvider>
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

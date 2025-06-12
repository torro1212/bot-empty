import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AccessibilityButton from "./components/AccessibilityButton";
import AccessibilityAnnouncer from "./components/AccessibilityAnnouncer";
import AccessibilityStatement from "./components/AccessibilityStatement";
import SplashScreenVariations from "./components/SplashScreenVariations";
import SplashScreenTest from "./components/SplashScreenTest";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <SplashScreenVariations 
        onComplete={handleSplashComplete}
        logoUrl="/placeholder.svg" // הוסף כאן את הנתיב ללוגו שלך
        variant="brands" // אפשר לבחור: 'gradient', 'particles', 'minimalist', 'rotating', 'brands'
      />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AccessibilityAnnouncer />
        <Toaster />
        <Sonner />
        <AccessibilityButton />
        <AccessibilityStatement />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

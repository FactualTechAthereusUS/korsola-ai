import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalHeader } from "@/components/GlobalHeader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { lazy, Suspense, useEffect } from "react";

// Lazy-load every page — only downloaded when the user actually navigates there
const Index               = lazy(() => import("./pages/Index.tsx"));
const Generator           = lazy(() => import("./pages/Generator.tsx"));
const Video               = lazy(() => import("./pages/Video.tsx"));
const SpacesProjects      = lazy(() => import("./pages/SpacesProjects.tsx"));
const MarketingStudio     = lazy(() => import("./pages/MarketingStudio.tsx"));
const MarketingStudioProject = lazy(() => import("./pages/MarketingStudioProject.tsx"));
const NotFound            = lazy(() => import("./pages/NotFound.tsx"));
const Auth                = lazy(() => import("./pages/Auth.tsx"));
const Landingpage         = lazy(() => import("./pages/Landingpage.tsx"));
const Paywall             = lazy(() => import("./pages/Paywall.tsx"));

const queryClient = new QueryClient();

// Routes where the GlobalHeader (app nav) should NOT render
const HIDE_GLOBAL_HEADER = ["/home", "/auth", "/onboarding/paywall"];

/**
 * Hard paywall gate — wraps all app routes that require an active subscription.
 * Flow: unauthenticated → /auth → after login → /onboarding/paywall → Stripe → /create
 */
function RequireSubscription({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isActive, loading: subLoading } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authLoading || subLoading) return;

    if (!user) {
      // Not logged in → /auth, come back here after login
      navigate("/auth", { state: { from: location.pathname }, replace: true });
      return;
    }

    if (!isActive) {
      // Logged in but no active subscription → paywall
      navigate("/onboarding/paywall", { replace: true });
    }
  }, [user, isActive, authLoading, subLoading, navigate, location.pathname]);

  // Show nothing while checking (avoid flash)
  if (authLoading || subLoading) return null;
  if (!user || !isActive) return null;

  return <>{children}</>;
}

/**
 * After Stripe redirects to /create?subscribed=true — just renders the page normally.
 * The webhook will have already granted credits by then.
 */
function AppInner() {
  const { pathname } = useLocation();
  const showHeader = !HIDE_GLOBAL_HEADER.some(p => pathname.startsWith(p));
  return (
    <>
      <SmoothScroll />
      {showHeader && <GlobalHeader />}
      <Suspense fallback={null}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<Landingpage />} />
          <Route path="/onboarding/paywall" element={<Paywall />} />

          {/* Protected routes — require active subscription */}
          <Route path="/create" element={<RequireSubscription><Generator /></RequireSubscription>} />
          <Route path="/create/:slug" element={<RequireSubscription><Generator /></RequireSubscription>} />
          <Route path="/image" element={<Navigate to="/create" replace />} />
          <Route path="/generator" element={<Navigate to="/create" replace />} />
          <Route path="/video" element={<RequireSubscription><Video /></RequireSubscription>} />
          <Route path="/spaces-projects" element={<RequireSubscription><SpacesProjects /></RequireSubscription>} />
          <Route path="/spaces" element={<RequireSubscription><Index /></RequireSubscription>} />
          <Route path="/marketingstudio" element={<RequireSubscription><MarketingStudio /></RequireSubscription>} />
          <Route path="/marketingstudio/:slug" element={<RequireSubscription><MarketingStudioProject /></RequireSubscription>} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppInner />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

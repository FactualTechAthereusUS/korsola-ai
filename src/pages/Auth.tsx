import { useEffect, useState } from "react";
import logoLight from "@/assets/logo-light.png";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/integrations/firebase/client";
import { useAuth } from "@/hooks/useAuth";
import { LpGradientCTA } from "@/components/marketing/lp/LpGradientCTA";

type Slide = {
  src: string;
  type: "image" | "video";
  badge?: string;
  title: string;
  subtitle: string;
};

const SLIDES: Slide[] = [
  {
    src: "/auth/slide-1.png",
    type: "image",
    badge: "With Reference",
    title: "NANO BANANA PRO",
    subtitle: "Generate hyper-real images from a prompt or any reference photo.",
  },
  {
    src: "/auth/v-kling.mp4",
    type: "video",
    badge: "With Audio",
    title: "KLING 3.0",
    subtitle: "Cinematic motion, sound, and polish that feels real.",
  },
  {
    src: "/auth/v2.mp4",
    type: "video",
    badge: "Seedance 2.0",
    title: "SEEDANCE 2.0",
    subtitle: "Reference-to-video with full creative control.",
  },
  {
    src: "/auth/v6.mp4",
    type: "video",
    badge: "Try-On",
    title: "UGC VIRTUAL TRY-ON",
    subtitle: "Put your product on any avatar in any setting — instantly.",
  },
  {
    src: "/auth/v1.mp4",
    type: "video",
    badge: "Unboxing",
    title: "UNBOXING",
    subtitle: "Cinematic product reveals with motion and sound.",
  },
  {
    src: "/auth/v4.mp4",
    type: "video",
    badge: "Marketing Studio",
    title: "REAL UGC ADS",
    subtitle: "Creator-style ads for any product — generated, not filmed.",
  },
  {
    src: "/auth/v5.mp4",
    type: "video",
    badge: "Avatar",
    title: "PODCAST & TALKING HEAD",
    subtitle: "Lifelike avatars that talk, react, and host like a real creator.",
  },
];

export default function Auth() {
  const [slide, setSlide] = useState(0);
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  // After login always go to paywall — RequireSubscription will forward to /create if already subscribed
  const from = (location.state as { from?: string } | null)?.from ?? "/onboarding/paywall";

  useEffect(() => {
    const t = window.setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5500);
    return () => window.clearInterval(t);
  }, []);

  if (!loading && user) return <Navigate to={from} replace />;

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!email || password.length < 6) {
      toast.error("Enter a valid email and 6+ char password");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "signup") {
        await signUpWithEmail(email, password);
        toast.success("Welcome to Korsola");
      } else {
        await signInWithEmail(email, password);
        toast.success("Welcome back");
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err?.message ?? "Google sign-in failed");
    } finally {
      setSubmitting(false);
    }
  };

  const current = SLIDES[slide] ?? SLIDES[0];

  const formContent = (dark: boolean) => (
    <>
      <div className="flex items-center justify-center gap-2.5 mb-6">
        <img src={logoLight} alt="Korsola" className="w-9 h-9 object-contain" />
        <span className="text-[16px] font-display font-extrabold tracking-[0.14em] text-white">KORSOLA</span>
      </div>
      <h1 className="text-center text-[24px] sm:text-[28px] font-semibold leading-tight tracking-tight text-white">
        Welcome to Korsola
      </h1>
      <p className="mt-1.5 text-center text-[13px] text-white/50">
        Start creating ads that actually convert.
      </p>
      <div className="mt-6 space-y-3">
        <button
          onClick={handleGoogle}
          disabled={submitting}
          className={`w-full h-[52px] rounded-2xl border flex items-center justify-center gap-3 text-[15px] font-semibold transition-colors disabled:opacity-50 ${dark ? "bg-white/[0.06] hover:bg-white/[0.11] border-white/12" : "bg-white/[0.08] hover:bg-white/[0.14] border-white/15"}`}
        >
          <GoogleIcon />
          Continue with Google
        </button>
        {!showEmail ? (
          <>
            <div className="flex items-center gap-3 py-0.5">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <button
              onClick={() => setShowEmail(true)}
              className={`w-full h-[52px] rounded-2xl border flex items-center justify-center gap-3 text-[15px] font-semibold transition-colors ${dark ? "bg-white/[0.06] hover:bg-white/[0.11] border-white/12" : "bg-white/[0.08] hover:bg-white/[0.14] border-white/15"}`}
            >
              <Mail className="w-[17px] h-[17px]" />
              Continue with Email
            </button>
          </>
        ) : (
          <form onSubmit={handleEmail} className="space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email"
              className="w-full h-[50px] rounded-2xl bg-white/[0.07] border border-white/15 px-4 text-[14px] placeholder:text-white/35 focus:border-white/30 focus:outline-none text-white" />
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 chars)" autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="w-full h-[50px] rounded-2xl bg-white/[0.07] border border-white/15 px-4 text-[14px] placeholder:text-white/35 focus:border-white/30 focus:outline-none text-white" />
            <LpGradientCTA type="submit" disabled={submitting} showSparkles={false} className="w-full !w-full !rounded-2xl h-[50px]">
              {submitting ? "..." : mode === "signup" ? "Create account" : "Sign in"}
            </LpGradientCTA>
            <div className="flex items-center justify-between pt-0.5 text-[12px] text-white/50">
              <button type="button" onClick={() => setShowEmail(false)} className="hover:text-white">← Back</button>
              <button type="button" onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="font-semibold text-white hover:text-[#d8ff3e]">
                {mode === "signup" ? "Sign in instead" : "Create account"}
              </button>
            </div>
          </form>
        )}
      </div>
      <p className="mt-5 text-center text-[11px] leading-relaxed text-white/30">
        By continuing, you agree to our{" "}
        <a className="underline underline-offset-2 hover:text-white/60">Privacy Policy</a> &amp;{" "}
        <a className="underline underline-offset-2 hover:text-white/60">Terms of Use</a>.
      </p>
    </>
  );

  const slideshow = (
    <>
      {SLIDES.map((s, i) => {
        const active = i === slide;
        return (
          <div key={i} className={`absolute inset-0 transition-all duration-[1100ms] ease-out ${active ? "opacity-100 scale-100" : "opacity-0 scale-[1.04] pointer-events-none"}`}>
            {s.type === "video" ? (
              <video src={s.src} autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <img src={s.src} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          </div>
        );
      })}
      {current.badge && (
        <div className="absolute top-5 right-5 sm:top-7 sm:right-8 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md text-[12px] font-semibold tracking-wide text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d8ff3e]" />{current.badge}
          </span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 px-6 sm:px-10 lg:px-14 pb-8 sm:pb-12 z-10">
        <div key={slide} className="animate-in fade-in slide-in-from-bottom-3 duration-700">
          <h2 className="text-white text-[28px] sm:text-[40px] lg:text-[52px] font-bold tracking-tight leading-[1.02]"
            style={{ fontFamily: 'Montserrat, "Bricolage Grotesque", system-ui, sans-serif' }}>
            {current.title}
          </h2>
          <p className="mt-2 text-white/75 text-[14px] sm:text-[16px] max-w-[560px]">{current.subtitle}</p>
        </div>
        <div className="mt-6 flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className="group flex-1 h-[3px] rounded-full overflow-hidden bg-white/15" aria-label={`Slide ${i + 1}`}>
              <span className="block h-full bg-white" style={i === slide ? { animation: "authProgress 5500ms linear forwards" } : { width: i < slide ? "100%" : "0%" }} />
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div style={{ fontFamily: "Montserrat, system-ui, -apple-system, Helvetica, Arial, sans-serif" }}>

      {/* ── MOBILE (< lg): full-screen 9:16 frosted glass overlay ── */}
      <div className="lg:hidden fixed inset-0 bg-black overflow-hidden flex items-center justify-center">
        <div className="relative overflow-hidden text-white" style={{ height: "100svh", width: "min(100vw, calc(100svh * 9 / 16))" }}>
          {slideshow}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none z-10" />
          <div className="absolute inset-0 z-20 px-6 flex flex-col items-center justify-center bg-black/60 backdrop-blur-3xl">
            <div className="w-full max-w-[360px]">{formContent(false)}</div>
          </div>
        </div>
      </div>

      {/* ── DESKTOP / TABLET (lg+): split layout — left auth, right slideshow ── */}
      <div className="hidden lg:grid min-h-[100svh] grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] bg-[#0a0a0a] text-white overflow-hidden">
        {/* Left — auth */}
        <div className="relative flex flex-col items-center justify-center px-10 lg:px-16 py-10">
          <div className="w-full max-w-[440px]">{formContent(true)}</div>
        </div>
        {/* Right — slideshow */}
        <div className="relative min-h-[100svh] bg-black overflow-hidden">
          {slideshow}
        </div>
      </div>

      <style>{`
        @keyframes authProgress { from { width: 0%; } to { width: 100%; } }
      `}</style>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M18.8 10.209C18.8 9.55898 18.7417 8.93398 18.6333 8.33398H10V11.8798H14.9333C14.7208 13.0257 14.075 13.9965 13.1042 14.6465V16.9465H16.0667C17.8 15.3507 18.8 13.0007 18.8 10.209Z" fill="#4285F4"/>
      <path d="M10.0003 19.1672C12.4753 19.1672 14.5503 18.3464 16.0669 16.9464L13.1044 14.6464C12.2836 15.1964 11.2336 15.5214 10.0003 15.5214C7.61276 15.5214 5.59193 13.9089 4.87109 11.7422H1.80859V14.1172C3.31693 17.113 6.41693 19.1672 10.0003 19.1672Z" fill="#34A853"/>
      <path d="M4.86953 11.7411C4.6862 11.1911 4.58203 10.6036 4.58203 9.99948C4.58203 9.39531 4.6862 8.80781 4.86953 8.25781V5.88281H1.80703C1.16536 7.16019 0.831466 8.56999 0.832032 9.99948C0.832032 11.4786 1.1862 12.8786 1.80703 14.1161L4.86953 11.7411Z" fill="#FBBC05"/>
      <path d="M10.0003 4.47982C11.3461 4.47982 12.5544 4.94232 13.5044 5.85065L16.1336 3.22148C14.5461 1.74232 12.4711 0.833984 10.0003 0.833984C6.41693 0.833984 3.31693 2.88815 1.80859 5.88398L4.87109 8.25898C5.59193 6.09232 7.61276 4.47982 10.0003 4.47982Z" fill="#EA4335"/>
    </svg>
  );
}

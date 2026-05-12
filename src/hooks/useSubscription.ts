import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type SubscriptionStatus = "active" | "past_due" | "canceled" | "none";

export interface Subscription {
  plan: string;
  billing: string;
  status: SubscriptionStatus;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export function useSubscription() {
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchSubscription() {
      const { data } = await supabase
        .from("subscriptions")
        .select("plan, billing, status, current_period_end, cancel_at_period_end")
        .eq("user_id", user!.uid)
        .in("status", ["active", "past_due"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!cancelled) {
        setSubscription(data as Subscription | null);
        setLoading(false);
      }
    }

    fetchSubscription();
    return () => { cancelled = true; };
  }, [user, authLoading, tick]);

  const refetch = () => setTick(t => t + 1);
  const isActive = subscription?.status === "active" || subscription?.status === "past_due";

  return { subscription, isActive, loading: authLoading || loading, refetch };
}

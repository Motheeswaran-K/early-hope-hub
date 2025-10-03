import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthForm from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { Session, User } from "@supabase/supabase-js";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Redirect if logged in
        if (session?.user) {
          setTimeout(() => navigate("/"), 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // If already logged in, don't show the form
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            {mode === "signin" ? "Welcome Back" : "Get Started"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "signin"
              ? "Sign in to access your health dashboard"
              : "Create your account to begin your journey"}
          </p>
        </div>

        <AuthForm mode={mode} onSuccess={() => navigate("/")} />

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-sm"
          >
            {mode === "signin"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

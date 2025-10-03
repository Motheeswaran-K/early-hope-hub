import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Activity, HeartPulse, Brain, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import heroImage from "@/assets/hero-image.jpg";
import aiDetectionIcon from "@/assets/ai-detection-icon.jpg";
import trackingIcon from "@/assets/tracking-icon.jpg";
import wellnessIcon from "@/assets/wellness-icon.jpg";

const Home = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .single();
    
    if (data?.full_name) {
      setProfileName(data.full_name);
    }
  };
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-background"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
          }}
        />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {session && profileName && (
              <p className="text-lg text-primary font-semibold">
                Welcome back, {profileName}!
              </p>
            )}
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              AI-Powered{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Breast Cancer
              </span>{" "}
              Detection & Support
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI technology combined with compassionate care. Upload tissue images for instant analysis,
              track your health, and access personalized support resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {session ? (
                <>
                  <Button size="lg" asChild className="bg-gradient-to-r from-primary to-primary-glow">
                    <Link to="/upload">
                      Start Detection
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/tracker">View Tracker</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" asChild className="bg-gradient-to-r from-primary to-primary-glow">
                    <Link to="/auth">
                      <User className="mr-2 h-5 w-5" />
                      Get Started
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/faq">Learn More</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Care Platform
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need for early detection, tracking, and support in one place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={aiDetectionIcon}
                    alt="AI Detection"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Activity className="h-8 w-8 text-primary mb-2" />
                <CardTitle>AI Detection</CardTitle>
                <CardDescription>
                  Upload breast tissue images for instant AI-powered analysis with confidence scores and visual explanations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild className="w-full">
                  <Link to="/upload">
                    Try Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={trackingIcon}
                    alt="Health Tracking"
                    className="w-full h-full object-cover"
                  />
                </div>
                <HeartPulse className="h-8 w-8 text-secondary mb-2" />
                <CardTitle>Health Tracking</CardTitle>
                <CardDescription>
                  Monitor symptoms, track habits, and receive personalized health recommendations with follow-up reminders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild className="w-full">
                  <Link to="/tracker">
                    Start Tracking <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={wellnessIcon}
                    alt="Wellness Support"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Brain className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Wellness Support</CardTitle>
                <CardDescription>
                  Access mental health resources, personalized lifestyle recommendations, and educational materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild className="w-full">
                  <Link to="/faq">
                    Explore Resources <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-2">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl mb-4">Ready to Get Started?</CardTitle>
              <CardDescription className="text-lg">
                Take the first step towards proactive breast health management
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-primary to-secondary">
                {session ? (
                  <Link to="/upload">
                    Upload Image for Analysis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <Link to="/auth">
                    Sign In to Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;

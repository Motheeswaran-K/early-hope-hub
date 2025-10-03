import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Home, FileQuestion, Upload } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              BreastCare AI
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            <Button
              variant={isActive("/upload") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/upload">
                <Upload className="h-4 w-4 mr-2" />
                Detection
              </Link>
            </Button>
            <Button
              variant={isActive("/tracker") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/tracker">
                <Activity className="h-4 w-4 mr-2" />
                Tracker
              </Link>
            </Button>
            <Button
              variant={isActive("/faq") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/faq">
                <FileQuestion className="h-4 w-4 mr-2" />
                FAQ
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

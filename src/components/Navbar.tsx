import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Server, LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary glow-yellow transition-all group-hover:scale-110">
            <Server className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold gradient-text">Smart-Hosting</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="border-primary/50 hover:bg-primary/10"
              >
                Dashboard
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-destructive/50 hover:bg-destructive/10"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="border-primary/50 hover:bg-primary/10"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-yellow"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Daftar
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

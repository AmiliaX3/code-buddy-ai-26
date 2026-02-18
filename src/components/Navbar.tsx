import { Link, useLocation } from "react-router-dom";
import { Code, GraduationCap, Home, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/code", label: "Code", icon: Terminal },
    { to: "/learn", label: "Learn", icon: GraduationCap },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Code className="w-6 h-6 text-primary" />
          <span className="font-display text-lg font-bold text-primary text-glow-green">
            CodeBot
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all",
                location.pathname === to
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

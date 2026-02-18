import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Terminal, Bug, Beaker, Code, GraduationCap, Zap, Bot } from "lucide-react";
import Navbar from "@/components/Navbar";
import FeedbackButton from "@/components/FeedbackButton";
import AiBot from "@/components/AiBot";

const features = [
  {
    icon: Code,
    title: "Code Assist",
    desc: "Get help writing snippets in HTML, CSS, JS, Python, Java, C#, C++, SQL & Bash.",
    color: "text-primary",
  },
  {
    icon: Bug,
    title: "Smart Debug",
    desc: "Trace errors step-by-step with structured debug reports and fix suggestions.",
    color: "text-[hsl(var(--neon-cyan))]",
  },
  {
    icon: Beaker,
    title: "Playtest",
    desc: "Simulate edge cases, test scenarios, and identify bugs before they ship.",
    color: "text-[hsl(var(--neon-purple))]",
  },
  {
    icon: GraduationCap,
    title: "Learn",
    desc: "Interactive programming tutorials that adapt to your skill level.",
    color: "text-[hsl(var(--neon-pink))]",
  },
  {
    icon: Zap,
    title: "Multi-Language",
    desc: "Combine languages seamlessly — HTML+CSS+JS, Python+SQL, and more.",
    color: "text-yellow-400",
  },
  {
    icon: Bot,
    title: "Assist Only",
    desc: "AI guides you to learn — it won't build entire apps for you.",
    color: "text-primary",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FeedbackButton />

      <main className="pt-14">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(160_100%_45%/0.08),transparent_70%)]" />
          <div className="max-w-5xl mx-auto px-4 py-24 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-primary">AI-POWERED DEV ASSISTANT</span>
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 text-foreground">
                Your AI{" "}
                <span className="text-primary text-glow-green">Coding</span>{" "}
                Companion
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Debug, learn, and build better code. CodeBot assists you throughout the entire
                development process — without doing the work for you.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  to="/code"
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-display text-sm font-semibold hover:bg-primary/90 transition-colors glow-green"
                >
                  Start Coding
                </Link>
                <Link
                  to="/learn"
                  className="bg-secondary text-foreground px-6 py-3 rounded-lg font-display text-sm font-semibold border border-border hover:border-primary/50 transition-colors"
                >
                  Learn Programming
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all group"
              >
                <f.icon className={`w-8 h-8 mb-3 ${f.color}`} />
                <h3 className="font-display text-sm font-semibold mb-1 text-foreground">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <AiBot mode="code" />
    </div>
  );
};

export default Index;

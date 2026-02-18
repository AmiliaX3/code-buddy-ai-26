import { useState } from "react";
import { BookOpen, Code, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import FeedbackButton from "@/components/FeedbackButton";
import AiBot from "@/components/AiBot";

const topics = [
  { lang: "HTML", desc: "Structure web pages with semantic markup", emoji: "🌐" },
  { lang: "CSS", desc: "Style and layout your web designs", emoji: "🎨" },
  { lang: "JavaScript", desc: "Add interactivity to web apps", emoji: "⚡" },
  { lang: "Python", desc: "General-purpose programming & data science", emoji: "🐍" },
  { lang: "Java", desc: "Enterprise apps & Android development", emoji: "☕" },
  { lang: "C#", desc: "Game dev with Unity & .NET applications", emoji: "🎮" },
  { lang: "C++", desc: "Systems programming & high performance", emoji: "⚙️" },
  { lang: "SQL", desc: "Query and manage databases", emoji: "🗄️" },
  { lang: "Linux/Bash", desc: "Command line & shell scripting", emoji: "🐧" },
];

const LearningPage = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FeedbackButton />

      <main className="pt-14 p-4 max-w-5xl mx-auto">
        <div className="mt-4 mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[hsl(var(--neon-purple))]/10 border border-[hsl(var(--neon-purple))]/20 rounded-full px-4 py-1.5 mb-4">
            <BookOpen className="w-4 h-4 text-[hsl(var(--neon-purple))]" />
            <span className="text-xs font-mono text-[hsl(var(--neon-purple))]">INTERACTIVE LEARNING</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Learn <span className="text-[hsl(var(--neon-purple))]">Programming</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose a language below, then open the AI tutor to start your interactive lesson.
            The AI will teach you step-by-step with examples and exercises.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topics.map((t) => (
            <button
              key={t.lang}
              onClick={() => setSelected(t.lang)}
              className={`text-left p-4 rounded-xl border transition-all ${
                selected === t.lang
                  ? "bg-[hsl(var(--neon-purple))]/10 border-[hsl(var(--neon-purple))]/40 glow-purple"
                  : "bg-card border-border hover:border-[hsl(var(--neon-purple))]/30"
              }`}
            >
              <div className="text-2xl mb-2">{t.emoji}</div>
              <h3 className="font-display text-sm font-semibold text-foreground">{t.lang}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="mt-6 bg-card border border-[hsl(var(--neon-purple))]/30 rounded-xl p-6 text-center glow-purple">
            <Sparkles className="w-8 h-8 text-[hsl(var(--neon-purple))] mx-auto mb-3" />
            <h2 className="font-display text-lg font-bold text-foreground mb-1">
              Ready to learn {selected}!
            </h2>
            <p className="text-sm text-muted-foreground">
              Click the <span className="text-primary font-semibold">CodeBot</span> button (bottom-right)
              and say: <span className="font-mono text-primary">"Teach me {selected} from scratch"</span>
            </p>
          </div>
        )}
      </main>

      <AiBot mode="learn" />
    </div>
  );
};

export default LearningPage;

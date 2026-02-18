import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Bug, Beaker } from "lucide-react";
import Navbar from "@/components/Navbar";
import FeedbackButton from "@/components/FeedbackButton";
import AiBot from "@/components/AiBot";

const CodingPage = () => {
  const [activeMode, setActiveMode] = useState<"code" | "debug" | "playtest">("code");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  const languages = [
    "javascript", "python", "java", "csharp", "cpp", "html", "css", "sql", "bash",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FeedbackButton />

      <main className="pt-14 p-4 max-w-7xl mx-auto">
        <div className="mt-4 mb-6">
          <h1 className="font-display text-2xl font-bold text-primary text-glow-green mb-1">
            Code Workshop
          </h1>
          <p className="text-sm text-muted-foreground">
            Write code below, then click the AI bot to get help with debugging, testing, or code review.
          </p>
        </div>

        <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as any)}>
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="code" className="gap-1.5 font-mono text-xs">
              <Code className="w-3.5 h-3.5" /> Code
            </TabsTrigger>
            <TabsTrigger value="debug" className="gap-1.5 font-mono text-xs">
              <Bug className="w-3.5 h-3.5" /> Debug
            </TabsTrigger>
            <TabsTrigger value="playtest" className="gap-1.5 font-mono text-xs">
              <Beaker className="w-3.5 h-3.5" /> Playtest
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeMode} className="mt-4">
            <div className="space-y-3">
              {/* Language Selector */}
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                      language === lang
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* Code Editor */}
              <div className="relative">
                <div className="absolute top-2 left-3 text-xs text-muted-foreground font-mono">
                  {language}
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={`// Write your ${language} code here...\n// Click the AI bot (bottom-right) to get help!`}
                  className="w-full min-h-[400px] bg-[hsl(var(--terminal-bg))] border border-border rounded-xl p-4 pt-8 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                  spellCheck={false}
                />
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {activeMode === "code" && "💡 Tip: Ask the AI bot to review your code, suggest improvements, or generate specific functions."}
                  {activeMode === "debug" && "🐛 Tip: Paste your buggy code above, then ask the AI bot to trace and identify the issue."}
                  {activeMode === "playtest" && "🧪 Tip: Write your code above, then ask the AI bot to simulate test scenarios and find edge cases."}
                </h3>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <AiBot mode={activeMode} />
    </div>
  );
};

export default CodingPage;

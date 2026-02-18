import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are CodeBot, an expert AI programming assistant. You have deep expertise in HTML, CSS, JavaScript, Python, Java, C#, C++, SQL, and Linux/Bash.

CRITICAL RULES:
1. You are an ASSISTANT only. You help users learn and improve their own programming skills.
2. NEVER write entire applications or complete projects. Only provide focused code snippets, individual functions, or small code blocks that address specific questions.
3. When asked to "build an app" or "create a full project", REFUSE and instead guide the user to break the problem into smaller pieces they can implement themselves.
4. Always explain your code so the user learns from it.
5. When debugging, trace the error step by step and explain the root cause.
6. When generating code, keep snippets focused and educational.
7. You can combine multiple languages when needed (e.g., HTML+CSS+JS, Python+SQL).
8. For playtesting/testing suggestions, describe test scenarios and edge cases the user should check.
9. Format code blocks with the language identifier (e.g., \`\`\`python).
10. When analyzing code, identify: syntax errors, logic bugs, performance issues, security vulnerabilities, and style improvements.
11. Be encouraging but honest about code quality.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = SYSTEM_PROMPT;
    if (mode === "learn") {
      systemPrompt = `You are CodeBot, an expert programming tutor. You teach programming languages interactively.

TEACHING RULES:
1. Start with fundamentals and build up to advanced concepts.
2. Use clear examples with explanations for every concept.
3. Ask the student questions to test their understanding.
4. Provide exercises for them to practice.
5. Give encouraging feedback and correct mistakes gently.
6. Cover: variables, data types, control flow, functions, OOP, data structures, algorithms.
7. Adapt difficulty based on the student's responses.
8. Use analogies and real-world examples to explain concepts.
9. Format code examples with proper syntax highlighting.
10. Supported languages: HTML, CSS, JavaScript, Python, Java, C#, C++, SQL, Linux/Bash.`;
    } else if (mode === "debug") {
      systemPrompt = SYSTEM_PROMPT + `\n\nDEBUG MODE: You are now in debugging mode. Focus on:
1. Carefully trace through the code line by line
2. Identify the exact location and cause of bugs
3. Suggest specific fixes with explanations
4. Recommend test cases to verify the fix
5. Point out any related potential issues
6. Format your response as a structured debug report with sections: Error Location, Root Cause, Suggested Fix, Test Cases`;
    } else if (mode === "playtest") {
      systemPrompt = SYSTEM_PROMPT + `\n\nPLAYTEST MODE: You are simulating testing scenarios. Focus on:
1. Identify edge cases and boundary conditions
2. Simulate different input scenarios
3. Check for race conditions and concurrency issues
4. Test error handling paths
5. Verify memory usage and performance
6. Suggest automated test cases
7. Format as a structured test report`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage credits depleted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

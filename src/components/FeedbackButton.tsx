import { useState } from "react";
import { MessageSquareHeart, X, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const FeedbackButton = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke("send-feedback", {
        body: { message, rating },
      });
      if (error) throw error;
      toast({ title: "Thank you!", description: "Your feedback has been submitted." });
      setMessage("");
      setRating(0);
      setOpen(false);
    } catch (e) {
      toast({ title: "Error", description: "Failed to send feedback.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="fixed top-4 right-4 z-40 flex items-center gap-1.5 bg-secondary/80 backdrop-blur border border-border rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
          <MessageSquareHeart className="w-4 h-4" />
          <span className="hidden sm:inline">Feedback</span>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-primary text-glow-green">Send Feedback</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 ${n <= rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                />
              </button>
            ))}
          </div>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you think..."
            className="bg-secondary border-border font-mono text-sm min-h-[120px]"
          />
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || sending}
            className="w-full font-display"
          >
            {sending ? "Sending..." : "Submit Feedback"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackButton;

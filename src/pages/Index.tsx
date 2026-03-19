import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Zap, Globe, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import StoryCard from "@/components/StoryCard";
import { trendingStories } from "@/lib/mockData";
import { scrapeArticle, generateBriefing } from "@/lib/api";

const Index = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStoryClick = (id: string) => {
    navigate(`/briefing/${id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setIsAnalyzing(true);

    try {
      toast({ title: "Scraping article...", description: "Extracting content from the URL" });
      const article = await scrapeArticle(url);

      toast({ title: "Generating briefing...", description: "AI is analyzing the article" });
      const briefing = await generateBriefing(article.markdown, article.title, article.source);

      // Store briefing in sessionStorage for the briefing page
      sessionStorage.setItem("custom-briefing", JSON.stringify(briefing));
      sessionStorage.setItem("custom-article-text", article.markdown);
      navigate(`/briefing/custom`);
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast({
        title: "Analysis failed",
        description: err.message || "Could not analyze the article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-gold" />
            <span className="font-display text-xl font-bold text-foreground tracking-tight">
              NewsNavigator
            </span>
          </div>
          <span className="text-xs font-mono text-dim uppercase tracking-widest">
            Intelligence Briefing
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
              Turn any story into an{" "}
              <span className="text-gold">intelligence briefing</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Paste an article link or pick a trending story. Get a structured
              executive briefing with timeline, key entities, perspectives, and
              interactive Q&A — in seconds.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex gap-3 max-w-xl mx-auto"
          >
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dim" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste an article URL..."
                className="pl-10 bg-card border-border h-12 text-foreground placeholder:text-muted-foreground focus:border-gold focus:ring-gold"
                disabled={isAnalyzing}
              />
            </div>
            <Button
              type="submit"
              className="h-12 px-6 gradient-gold text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              disabled={isAnalyzing || !url.trim()}
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </Button>
          </motion.form>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-mono text-dim uppercase tracking-widest">
            Trending Stories
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      </div>

      {/* Story Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingStories.map((story, i) => (
            <StoryCard
              key={story.id}
              story={story}
              index={i}
              onClick={handleStoryClick}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xs text-dim">
            © 2026 NewsNavigator. AI-powered intelligence briefings.
          </span>
          <div className="flex items-center gap-1 text-xs text-dim">
            <Zap className="w-3 h-3 text-gold" />
            Powered by AI
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

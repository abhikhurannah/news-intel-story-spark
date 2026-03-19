import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sampleBriefing, BriefingData } from "@/lib/mockData";
import ExecutiveSummary from "@/components/briefing/ExecutiveSummary";
import Timeline from "@/components/briefing/Timeline";
import KeyEntities from "@/components/briefing/KeyEntities";
import KeyNumbers from "@/components/briefing/KeyNumbers";
import Perspectives from "@/components/briefing/Perspectives";
import WatchNext from "@/components/briefing/WatchNext";
import ChatPanel from "@/components/briefing/ChatPanel";

const BriefingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [articleText, setArticleText] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id === "custom") {
      const stored = sessionStorage.getItem("custom-briefing");
      const storedText = sessionStorage.getItem("custom-article-text");
      if (stored) {
        setBriefing(JSON.parse(stored));
        setArticleText(storedText || "");
      } else {
        navigate("/");
        return;
      }
    } else {
      // Use sample data for trending stories
      setBriefing(sampleBriefing);
      setArticleText("");
    }
    setLoading(false);
  }, [id, navigate]);

  if (loading || !briefing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading briefing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-gold" />
              <span className="font-display text-lg font-bold text-foreground">NewsNavigator</span>
            </div>
          </div>
          <span className="text-xs font-mono text-dim uppercase tracking-widest hidden sm:block">
            Intelligence Briefing
          </span>
        </div>
      </nav>

      {/* Header */}
      <header className="px-6 pt-10 pb-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono text-gold uppercase tracking-wider">{briefing.source}</span>
              <span className="text-muted-foreground text-xs">·</span>
              <span className="text-xs text-dim flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {briefing.publishedAt}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2">
              {briefing.title}
            </h1>
          </motion.div>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 pb-20">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            <ExecutiveSummary summary={briefing.summary} whyItMatters={briefing.whyItMatters} />
            <Timeline events={briefing.timeline} />
            <Perspectives bullish={briefing.bullish} bearish={briefing.bearish} />
            <WatchNext items={briefing.watchNext} />
            <ChatPanel storyTitle={briefing.title} articleContext={articleText} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <KeyNumbers numbers={briefing.keyNumbers} />
            <KeyEntities entities={briefing.entities} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BriefingPage;

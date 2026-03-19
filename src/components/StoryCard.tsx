import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Story } from "@/lib/mockData";

interface StoryCardProps {
  story: Story;
  index: number;
  onClick: (id: string) => void;
}

const StoryCard = ({ story, index, onClick }: StoryCardProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onClick={() => onClick(story.id)}
      className="group text-left w-full bg-card border border-border rounded-lg p-5 hover:border-gold-dim transition-all duration-300 hover:glow-gold"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-mono font-medium text-gold uppercase tracking-wider">
          {story.category}
        </span>
        <span className="text-muted-foreground text-xs">·</span>
        <span className="text-xs text-dim flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {story.timestamp}
        </span>
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-gold transition-colors leading-snug">
        {story.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
        {story.snippet}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-dim">{story.source}</span>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
      </div>
    </motion.button>
  );
};

export default StoryCard;

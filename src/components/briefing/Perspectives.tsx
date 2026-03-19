import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const Perspectives = ({ bullish, bearish }: { bullish: string[]; bearish: string[] }) => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="bg-card border border-border rounded-lg p-6"
  >
    <h2 className="font-display text-lg font-semibold text-foreground mb-4">Perspectives</h2>
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-success" />
          <span className="text-xs font-mono uppercase tracking-wider text-success font-semibold">Bullish</span>
        </div>
        {bullish.map((point, i) => (
          <div key={i} className="flex gap-2 text-sm text-muted-foreground">
            <span className="text-success mt-0.5 shrink-0">+</span>
            <span>{point}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-4 h-4 text-destructive" />
          <span className="text-xs font-mono uppercase tracking-wider text-destructive font-semibold">Bearish</span>
        </div>
        {bearish.map((point, i) => (
          <div key={i} className="flex gap-2 text-sm text-muted-foreground">
            <span className="text-destructive mt-0.5 shrink-0">−</span>
            <span>{point}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.section>
);

export default Perspectives;

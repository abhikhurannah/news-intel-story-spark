import { motion } from "framer-motion";
import { Eye } from "lucide-react";

const WatchNext = ({ items }: { items: string[] }) => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.45 }}
    className="bg-card border border-border rounded-lg p-6"
  >
    <div className="flex items-center gap-2 mb-4">
      <Eye className="w-4 h-4 text-gold" />
      <h2 className="font-display text-lg font-semibold text-foreground">What to Watch Next</h2>
    </div>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
          <span className="font-mono text-xs text-gold mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </motion.section>
);

export default WatchNext;

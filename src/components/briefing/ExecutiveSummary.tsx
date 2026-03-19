import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const ExecutiveSummary = ({ summary, whyItMatters }: { summary: string; whyItMatters: string }) => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-card border border-border rounded-lg p-6"
  >
    <div className="flex items-center gap-2 mb-4">
      <FileText className="w-4 h-4 text-gold" />
      <h2 className="font-display text-lg font-semibold text-foreground">Executive Summary</h2>
    </div>
    <p className="text-foreground leading-relaxed mb-5">{summary}</p>
    <div className="border-t border-border pt-4">
      <h3 className="text-xs font-mono text-gold uppercase tracking-wider mb-2">Why It Matters</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{whyItMatters}</p>
    </div>
  </motion.section>
);

export default ExecutiveSummary;

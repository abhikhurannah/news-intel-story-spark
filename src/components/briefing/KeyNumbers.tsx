import { motion } from "framer-motion";
import { Hash } from "lucide-react";

const KeyNumbers = ({ numbers }: { numbers: { value: string; label: string; context: string }[] }) => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.35 }}
    className="bg-card border border-border rounded-lg p-6"
  >
    <div className="flex items-center gap-2 mb-4">
      <Hash className="w-4 h-4 text-gold" />
      <h2 className="font-display text-lg font-semibold text-foreground">Key Numbers</h2>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {numbers.map((num, i) => (
        <div key={i} className="bg-secondary rounded-md p-4 text-center">
          <div className="font-display text-2xl font-bold text-gold">{num.value}</div>
          <div className="text-xs font-semibold text-foreground mt-1">{num.label}</div>
          <div className="text-xs text-muted-foreground mt-1">{num.context}</div>
        </div>
      ))}
    </div>
  </motion.section>
);

export default KeyNumbers;

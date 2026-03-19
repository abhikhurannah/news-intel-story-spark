import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const Timeline = ({ events }: { events: { date: string; event: string }[] }) => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-card border border-border rounded-lg p-6"
  >
    <div className="flex items-center gap-2 mb-4">
      <Clock className="w-4 h-4 text-gold" />
      <h2 className="font-display text-lg font-semibold text-foreground">Timeline</h2>
    </div>
    <div className="space-y-0">
      {events.map((item, i) => (
        <div key={i} className="flex gap-4 relative">
          <div className="flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-gold mt-1.5 shrink-0" />
            {i < events.length - 1 && <div className="w-px flex-1 bg-border" />}
          </div>
          <div className="pb-5">
            <span className="text-xs font-mono text-gold-dim">{item.date}</span>
            <p className="text-sm text-foreground mt-0.5">{item.event}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

export default Timeline;

import { motion } from "framer-motion";
import { Users, Building2, User, Landmark } from "lucide-react";

const typeIcons = {
  company: Building2,
  person: User,
  org: Landmark,
};

const KeyEntities = ({ entities }: { entities: { name: string; type: "company" | "person" | "org"; role: string }[] }) => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="bg-card border border-border rounded-lg p-6"
  >
    <div className="flex items-center gap-2 mb-4">
      <Users className="w-4 h-4 text-gold" />
      <h2 className="font-display text-lg font-semibold text-foreground">Key Entities</h2>
    </div>
    <div className="space-y-3">
      {entities.map((entity, i) => {
        const Icon = typeIcons[entity.type];
        return (
          <div key={i} className="flex items-start gap-3 p-3 bg-secondary rounded-md">
            <Icon className="w-4 h-4 text-gold mt-0.5 shrink-0" />
            <div>
              <span className="text-sm font-semibold text-foreground">{entity.name}</span>
              <p className="text-xs text-muted-foreground mt-0.5">{entity.role}</p>
            </div>
          </div>
        );
      })}
    </div>
  </motion.section>
);

export default KeyEntities;

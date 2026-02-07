import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import type { LucideIcon } from 'lucide-react';

interface ActuatorControlProps {
  name: string;
  icon: LucideIcon;
  state: 'ON' | 'OFF';
  updatedAt: string;
  onToggle: () => void;
}

const ActuatorControl = ({ name, icon: Icon, state, updatedAt, onToggle }: ActuatorControlProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              state === 'ON' ? 'bg-primary/10' : 'bg-muted'
            }`}
          >
            <Icon className={`w-5 h-5 ${state === 'ON' ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <p className="font-medium text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">via Firebase</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${state === 'ON' ? 'text-primary' : 'text-muted-foreground'}`}>
            {state}
          </span>
          <Switch checked={state === 'ON'} onCheckedChange={onToggle} />
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground/50 mt-3 font-mono">
        Last updated: {new Date(updatedAt).toLocaleTimeString()}
      </p>
    </motion.div>
  );
};

export default ActuatorControl;

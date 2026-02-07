import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export type SensorStatus = 'good' | 'warning' | 'danger' | 'neutral';

interface SensorCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon: LucideIcon;
  source: 'MQTT' | 'Firebase';
  timestamp: string;
  status?: SensorStatus;
  onClick?: () => void;
  className?: string;
}

export const getSensorStatus = (
  value: number,
  warningThreshold: number,
  dangerThreshold: number,
  inverted = false
): SensorStatus => {
  if (inverted) {
    if (value < dangerThreshold) return 'danger';
    if (value < warningThreshold) return 'warning';
    return 'good';
  }
  if (value > dangerThreshold) return 'danger';
  if (value > warningThreshold) return 'warning';
  return 'good';
};

const statusStyles: Record<SensorStatus, string> = {
  good: 'border-sensor-good/30 bg-sensor-good/5',
  warning: 'border-sensor-warning/30 bg-sensor-warning/5',
  danger: 'border-sensor-danger/30 bg-sensor-danger/5',
  neutral: 'border-border bg-card',
};

const statusDotStyles: Record<SensorStatus, string> = {
  good: 'bg-sensor-good',
  warning: 'bg-sensor-warning',
  danger: 'bg-sensor-danger',
  neutral: 'bg-muted-foreground',
};

const SensorCard = ({
  title,
  value,
  unit,
  icon: Icon,
  source,
  timestamp,
  status = 'neutral',
  onClick,
  className,
}: SensorCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-5 transition-shadow hover:shadow-md ${onClick ? 'cursor-pointer' : ''} ${statusStyles[status]} ${className || ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <span className="text-[10px] font-mono text-muted-foreground/60">via {source}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${statusDotStyles[status]} ${status !== 'neutral' ? 'animate-pulse' : ''}`}
          />
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <motion.span
          key={String(value)}
          initial={{ opacity: 0.5, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-3xl font-bold text-foreground"
        >
          {value}
        </motion.span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      <p className="text-[10px] text-muted-foreground/50 mt-2 font-mono">
        {new Date(timestamp).toLocaleTimeString()}
      </p>
    </motion.div>
  );
};

export default SensorCard;

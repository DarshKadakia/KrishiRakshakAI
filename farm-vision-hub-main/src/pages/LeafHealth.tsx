import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Wifi, WifiOff, Leaf, RefreshCw } from 'lucide-react';
import { useSensorData } from '@/hooks/useSensorData';
import { Button } from '@/components/ui/button';

const STREAM_URL = 'http://10.46.107.139:5000/video';

const LeafHealth = () => {
  const { leafHealth, connected } = useSensorData();
  const [streamError, setStreamError] = useState(true);

  const statusColor =
    leafHealth.value === 'Healthy'
      ? 'text-sensor-good'
      : leafHealth.value === 'Warning'
      ? 'text-sensor-warning'
      : 'text-sensor-danger';

  const statusBg =
    leafHealth.value === 'Healthy'
      ? 'bg-sensor-good/10 border-sensor-good/30'
      : leafHealth.value === 'Warning'
      ? 'bg-sensor-warning/10 border-sensor-warning/30'
      : 'bg-sensor-danger/10 border-sensor-danger/30';

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex flex-wrap gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${statusBg}`}
        >
          <Leaf className={`w-5 h-5 ${statusColor}`} />
          <div>
            <p className="text-xs text-muted-foreground">Health Status</p>
            <p className={`font-semibold ${statusColor}`}>{leafHealth.value}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card"
        >
          {connected ? (
            <Wifi className="w-5 h-5 text-sensor-good" />
          ) : (
            <WifiOff className="w-5 h-5 text-sensor-danger" />
          )}
          <div>
            <p className="text-xs text-muted-foreground">Connection</p>
            <p className={`font-semibold ${connected ? 'text-sensor-good' : 'text-sensor-danger'}`}>
              {connected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Video Stream */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Live Camera Feed
        </h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card overflow-hidden"
        >
          {streamError ? (
            <div className="aspect-video flex flex-col items-center justify-center bg-muted/50">
              <Camera className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">Camera Feed Unavailable</p>
              <p className="text-sm text-muted-foreground/60 mt-1 text-center px-4">
                Connect to the vision server to view the live leaf health stream
              </p>
              <p className="text-xs font-mono text-muted-foreground/40 mt-3">{STREAM_URL}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 gap-1.5"
                onClick={() => setStreamError(false)}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Connection
              </Button>
            </div>
          ) : (
            <div className="aspect-video">
              <img
                src={STREAM_URL}
                alt="Leaf Health Camera Feed"
                className="w-full h-full object-cover"
                onError={() => setStreamError(true)}
              />
            </div>
          )}
        </motion.div>
      </section>

      {/* Sensor Details */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Sensor Details
        </h3>
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">MQTT Topic</span>
            <span className="font-mono text-foreground text-xs">{leafHealth.topic}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Update</span>
            <span className="font-mono text-foreground text-xs">
              {new Date(leafHealth.timestamp).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Data Source</span>
            <span className="text-foreground">MQTT → WebSocket → Frontend</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Vision Server</span>
            <span className="font-mono text-foreground text-xs">{STREAM_URL}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeafHealth;

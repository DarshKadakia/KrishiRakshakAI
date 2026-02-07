import { useState } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Package, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SensorCard, { getSensorStatus } from '@/components/SensorCard';
import { useSensorData } from '@/hooks/useSensorData';
import { useStorageBatches } from '@/hooks/useStorageBatches';

const StorageRoom = () => {
  const sensorData = useSensorData();
  const { batches, addBatch, removeBatch } = useStorageBatches();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCrop, setNewCrop] = useState<'Cotton' | 'Groundnut'>('Cotton');
  const [newQuantity, setNewQuantity] = useState('');
  const [newDate, setNewDate] = useState('');

  const humidityDanger = sensorData.storageHumidity.value > 70;

  const handleAddBatch = () => {
    if (newQuantity && newDate) {
      addBatch(newCrop, parseFloat(newQuantity), newDate);
      setNewQuantity('');
      setNewDate('');
      setDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Sensors */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Live Storage Conditions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SensorCard
            title="Storage Temperature"
            value={sensorData.storageTemperature.value}
            unit="°C"
            icon={Thermometer}
            source="MQTT"
            timestamp={sensorData.storageTemperature.timestamp}
            status={getSensorStatus(sensorData.storageTemperature.value, 28, 32)}
          />
          <SensorCard
            title="Storage Humidity"
            value={sensorData.storageHumidity.value}
            unit="%"
            icon={Droplets}
            source="MQTT"
            timestamp={sensorData.storageHumidity.timestamp}
            status={getSensorStatus(sensorData.storageHumidity.value, 65, 75)}
          />
        </div>
      </section>

      {/* Spoilage Warning */}
      {humidityDanger && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 p-4 rounded-xl border border-sensor-danger/30 bg-sensor-danger/5"
        >
          <AlertTriangle className="w-5 h-5 text-sensor-danger flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground">Spoilage Warning</p>
            <p className="text-sm text-muted-foreground">
              Storage humidity exceeds 70%. Groundnut batches are at risk of spoilage.
            </p>
          </div>
        </motion.div>
      )}

      {/* Batch Management */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Crop Batches
          </h3>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" />
                Add Batch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Batch</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Crop Type</Label>
                  <Select value={newCrop} onValueChange={(v) => setNewCrop(v as 'Cotton' | 'Groundnut')}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cotton">Cotton</SelectItem>
                      <SelectItem value="Groundnut">Groundnut</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Quantity (quintals)</Label>
                  <Input
                    type="number"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    placeholder="e.g., 25"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Stored Date</Label>
                  <Input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <Button onClick={handleAddBatch} className="w-full">
                  Add Batch
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {batches.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No batches stored yet</p>
            </div>
          )}
          {batches.map((batch, index) => (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-xl border p-4 ${
                batch.crop === 'Groundnut' && humidityDanger
                  ? 'border-sensor-danger/30 bg-sensor-danger/5'
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{batch.crop}</h4>
                      {batch.crop === 'Groundnut' && humidityDanger && (
                        <span className="px-2 py-0.5 rounded-full bg-sensor-danger/10 text-sensor-danger text-[10px] font-medium">
                          SPOILAGE RISK
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                      <span>{batch.quantity} quintals</span>
                      <span>Stored: {new Date(batch.storedDate).toLocaleDateString()}</span>
                      <span
                        className={
                          batch.freshnessRemaining < 7 ? 'text-sensor-danger font-medium' : ''
                        }
                      >
                        {batch.freshnessRemaining} days fresh
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBatch(batch.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StorageRoom;

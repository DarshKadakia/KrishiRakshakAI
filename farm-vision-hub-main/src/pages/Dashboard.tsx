import { useNavigate } from 'react-router-dom';
import { Thermometer, Droplets, Droplet, Leaf, Warehouse, BarChart3, ChevronRight, Fan } from 'lucide-react';
import { motion } from 'framer-motion';
import SensorCard, { getSensorStatus } from '@/components/SensorCard';
import ActuatorControl from '@/components/ActuatorControl';
import { useSensorData } from '@/hooks/useSensorData';
import { useActuators } from '@/hooks/useActuators';
import { useStorageBatches } from '@/hooks/useStorageBatches';
import { CROP_PRICES } from '@/lib/constants';

const Dashboard = () => {
  const navigate = useNavigate();
  const sensorData = useSensorData();
  const { actuators, toggleActuator } = useActuators();
  const { batches } = useStorageBatches();


  const totalCotton = batches.filter(b => b.crop === 'Cotton').reduce((sum, b) => sum + b.quantity, 0);
  const totalGroundnut = batches.filter(b => b.crop === 'Groundnut').reduce((sum, b) => sum + b.quantity, 0);
<button
  onClick={() => navigate("/schemes")}
  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
>
  📜 Government Schemes
</button>

  return (
    <div className="space-y-6">
      {/* Sensor Cards */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Live Sensor Readings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SensorCard
            title="Weather Temperature"
            value={sensorData.weatherTemperature.value}
            unit="°C"
            icon={Thermometer}
            source="MQTT"
            timestamp={sensorData.weatherTemperature.timestamp}
            status={getSensorStatus(sensorData.weatherTemperature.value, 35, 40)}
          />
          <SensorCard
            title="Soil Moisture"
            value={sensorData.soilMoisture.value}
            unit="%"
            icon={Droplets}
            source="MQTT"
            timestamp={sensorData.soilMoisture.timestamp}
            status={getSensorStatus(sensorData.soilMoisture.value, 45, 35, true)}
          />
          <SensorCard
            title="Storage Humidity"
            value={sensorData.storageHumidity.value}
            unit="%"
            icon={Droplet}
            source="MQTT"
            timestamp={sensorData.storageHumidity.timestamp}
            status={getSensorStatus(sensorData.storageHumidity.value, 65, 75)}
          />
        </div>
      </section>

      {/* Farm Overview */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Farm Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Crop Storage Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/storage')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Warehouse className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Crop Storage</p>
                  <span className="text-[10px] font-mono text-muted-foreground/60">localStorage</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm text-foreground">
                Cotton: <span className="font-bold text-lg">{totalCotton}</span> <span className="text-muted-foreground">qtl</span>
              </p>
              <p className="text-sm text-foreground">
                Groundnut: <span className="font-bold text-lg">{totalGroundnut}</span> <span className="text-muted-foreground">qtl</span>
              </p>
            </div>
          </motion.div>

          {/* Mandi Rates Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-xl border border-border bg-card p-5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/mandi')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-golden/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-golden" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Live Mandi Rates</p>
                  <span className="text-[10px] font-mono text-muted-foreground/60">market API</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm text-foreground">
                Cotton: <span className="font-bold text-lg">₹{CROP_PRICES.Cotton.today.toLocaleString()}</span> <span className="text-muted-foreground">/qtl</span>
              </p>
              <p className="text-sm text-foreground">
                Groundnut: <span className="font-bold text-lg">₹{CROP_PRICES.Groundnut.today.toLocaleString()}</span> <span className="text-muted-foreground">/qtl</span>
              </p>
            </div>
          </motion.div>

          {/* Leaf Health Card */}
          <SensorCard
            title="Leaf Health Monitor"
            value={sensorData.leafHealth.value}
            icon={Leaf}
            source="MQTT"
            timestamp={sensorData.leafHealth.timestamp}
            status={
              sensorData.leafHealth.value === 'Healthy'
                ? 'good'
                : sensorData.leafHealth.value === 'Warning'
                ? 'warning'
                : 'danger'
            }
            onClick={() => navigate('/leaf-health')}
          />
        </div>
      </section>

      {/* Actuator Controls */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Actuator Controls
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ActuatorControl
            name="Water Pump"
            icon={Droplet}
            state={actuators.pump.state}
            updatedAt={actuators.pump.updatedAt}
            onToggle={() => toggleActuator('pump')}
          />
          <ActuatorControl
            name="Ventilation Fan"
            icon={Fan}
            state={actuators.fan.state}
            updatedAt={actuators.fan.updatedAt}
            onToggle={() => toggleActuator('fan')}
          />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

import React, { createContext, useContext, useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

/* ---------- Types (unchanged, compatible with your app) ---------- */

interface SensorReading {
  value: number;
  timestamp: string;
  topic: string;
}

interface LeafHealthReading {
  value: string;
  timestamp: string;
  topic: string;
}
export interface SensorDataState {
  soilMoisture: SensorReading;
  storageTemperature: SensorReading;
  storageHumidity: SensorReading;
  weatherTemperature: SensorReading;
  weatherHumidity: SensorReading;
  leafHealth: LeafHealthReading;
  connected: boolean;
}

/* ---------- Helpers ---------- */

const now = () => new Date().toISOString();

/* ---------- Initial state (used before Firebase loads) ---------- */

const initialState: SensorDataState = {
  soilMoisture: { value: 0, timestamp: now(), topic: "farm/sensors/soil/moisture" },
  storageTemperature: { value: 0, timestamp: now(), topic: "farm/sensors/storage/temperature" },
  storageHumidity: { value: 0, timestamp: now(), topic: "farm/sensors/storage/humidity" },
  weatherTemperature: { value: 0, timestamp: now(), topic: "farm/sensors/weather/temperature" },
  weatherHumidity: { value: 0, timestamp: now(), topic: "farm/sensors/weather/humidity" },
  leafHealth: { value: "Unknown", timestamp: now(), topic: "farm/sensors/leafhealth/status" },
  connected: false,
};

const SensorDataContext = createContext<SensorDataState>(initialState);

/* ---------- Provider ---------- */

export const SensorDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SensorDataState>(initialState);

  useEffect(() => {
    // Firebase path that your backend updates
    const sensorRef = ref(db, "sensors/node1");

    const unsubscribe = onValue(
      sensorRef,
      (snapshot) => {
        const val = snapshot.val();
        if (!val) return;

        const timestamp = now();

        setData({
          soilMoisture: {
            value: val.soil_moisture ?? data.soilMoisture.value,
            timestamp,
            topic: "farm/sensors/soil/moisture",
          },
          storageTemperature: {
            value: val.storage_temp ?? val.air_temp ?? data.storageTemperature.value,
            timestamp,
            topic: "farm/sensors/storage/temperature",
          },
          storageHumidity: {
            value: val.storage_humidity ?? val.humidity ?? data.storageHumidity.value,
            timestamp,
            topic: "farm/sensors/storage/humidity",
          },
          weatherTemperature: {
            value: val.weather_temp ?? val.air_temp ?? data.weatherTemperature.value,
            timestamp,
            topic: "farm/sensors/weather/temperature",
          },
          weatherHumidity: {
            value: val.weather_humidity ?? val.humidity ?? data.weatherHumidity.value,
            timestamp,
            topic: "farm/sensors/weather/humidity",
          },
          leafHealth: {
            value: val.leaf_health ?? "Healthy",
            timestamp,
            topic: "farm/sensors/leafhealth/status",
          },
          connected: true,
        });
      },
      () => {
        // Firebase read error
        setData((prev) => ({ ...prev, connected: false }));
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SensorDataContext.Provider value={data}>
      {children}
    </SensorDataContext.Provider>
  );
};

/* ---------- Hook ---------- */

export const useSensorData = () => {
  return useContext(SensorDataContext);
};

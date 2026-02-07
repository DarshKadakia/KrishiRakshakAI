export const SHELF_LIFE: Record<string, number> = {
  Cotton: 90,
  Groundnut: 60,
};

export const CROP_PRICES: Record<string, { today: number; expected: number; unit: string }> = {
  Cotton: { today: 6800, expected: 7200, unit: '₹/quintal' },
  Groundnut: { today: 5500, expected: 5800, unit: '₹/quintal' },
};

export const NEARBY_MANDIS = [
  { name: 'Vadodara APMC', distance: '12 km' },
  { name: 'Anand APMC', distance: '28 km' },
  { name: 'Nadiad APMC', distance: '35 km' },
  { name: 'Godhra APMC', distance: '45 km' },
  { name: 'Bharuch APMC', distance: '62 km' },
];

export const SENSOR_TOPICS = {
  soilMoisture: 'farm/sensors/soil/moisture',
  storageTemperature: 'farm/sensors/storage/temperature',
  storageHumidity: 'farm/sensors/storage/humidity',
  leafHealth: 'farm/sensors/leafhealth/status',
  weatherTemperature: 'farm/sensors/weather/temperature',
  weatherHumidity: 'farm/sensors/weather/humidity',
} as const;

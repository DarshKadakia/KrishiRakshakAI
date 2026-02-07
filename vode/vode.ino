// AgriTech ESP32 Monolithic Code

#include <WiFi.h>
#include <PubSubClient.h>
#include <Firebase_ESP_Client.h>
#include <DHT.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Wire.h>
#include <Adafruit_MPU6050.h>

#define DHTPIN 4
#define DHTTYPE DHT11
#define SOIL_PIN 34
#define LDR_PIN 35
#define PIR_PIN 27
#define RELAY_PIN 26
#define ONE_WIRE_BUS 18

DHT dht(DHTPIN, DHTTYPE);
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature ds18b20(&oneWire);
Adafruit_MPU6050 mpu;

WiFiClient espClient;
PubSubClient client(espClient);

// WiFi credentials
const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASS";

// MQTT
const char* mqtt_server = "broker.hivemq.com";

// Firebase
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

int soilThreshold = 1500;

void setup() {
  Serial.begin(115200);

  pinMode(RELAY_PIN, OUTPUT);
  pinMode(PIR_PIN, INPUT);
  digitalWrite(RELAY_PIN, HIGH); // Relay OFF

  dht.begin();
  ds18b20.begin();
  Wire.begin();

  mpu.begin();

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);

  client.setServer(mqtt_server, 1883);

  config.database_url = "YOUR_FIREBASE_DB_URL";
  config.api_key = "YOUR_API_KEY";
  Firebase.begin(&config, &auth);
}

void loop() {
  if (!client.connected()) client.connect("ESP32_Agri");

  float humidity = dht.readHumidity();
  int soil = analogRead(SOIL_PIN);
  int ldr = analogRead(LDR_PIN);
  int pir = digitalRead(PIR_PIN);

  ds18b20.requestTemperatures();
  float temp = ds18b20.getTempCByIndex(0);

  sensors_event_t a, g, temp_mpu;
  mpu.getEvent(&a, &g, &temp_mpu);

  // MQTT publish
  String payload = String("{\"soil\":") + soil + 
                  ",\"humidity\":" + humidity +
                   ",\"temp\":" + temp + "}";

  client.publish("agritech/sensors", payload.c_str());

  // Automatic pump control
  if (soil < soilThreshold) {
    digitalWrite(RELAY_PIN, LOW);
    Firebase.RTDB.setBool(&fbdo, "/pump/status", true);
  } else {
    digitalWrite(RELAY_PIN, HIGH);
    Firebase.RTDB.setBool(&fbdo, "/pump/status", false);
  }

  // Manual override
  if (Firebase.RTDB.getBool(&fbdo, "/pump/manual")) {
    bool manual = fbdo.boolData();
    digitalWrite(RELAY_PIN, manual ? LOW : HIGH);
  }

  delay(2000);
}

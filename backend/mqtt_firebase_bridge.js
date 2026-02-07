const mqtt = require("mqtt");
const admin = require("firebase-admin");

// ================= FIREBASE =================
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
  databaseURL: "https://agrimotorcontrol-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();

// ================= MQTT =================
const mqttBroker = "mqtt://broker.hivemq.com:1883";
const mqttClient = mqtt.connect(mqttBroker);

// Subscribe to ALL sensor nodes
const SENSOR_TOPIC = "agritech/sensors/#";

// ================= MQTT EVENTS =================
mqttClient.on("connect", () => {
  console.log("MQTT Connected");
  mqttClient.subscribe(SENSOR_TOPIC);
});

mqttClient.on("error", (err) => {
  console.error("MQTT Error:", err);
});

mqttClient.on("message", async (topic, message) => {
  try {
    // Example topic: agritech/sensors/node1
    const topicParts = topic.split("/");
    const nodeId = topicParts[2];

    if (!nodeId) {
      console.warn("Invalid topic:", topic);
      return;
    }

    // Parse JSON payload
    const data = JSON.parse(message.toString());

    // 🔥 GENERIC UPDATE (KEY FIX)
    await db.ref(`/sensors/${nodeId}`).update(data);

    console.log(`Firebase updated for ${nodeId}:`, data);
  } catch (err) {
    console.error("Failed to process MQTT message:", err);
  }
});

#include <WiFi.h>
#include <PubSubClient.h>

// WiFi credentials
const char* ssid = "your_SSID";
const char* password = "your_PASSWORD";

// MQTT broker settings
const char* mqtt_server = "Your_Broker.cloud.shiftr.io";
const int mqtt_port = 1883;
const char* mqtt_user = "broker";
const char* mqtt_password = "yourtoken";

// MQTT topic for oxygen
const char* topic_oxygen = "patient/123/sensors/oxygen";

// WiFi and MQTT clients
WiFiClient espClient;
PubSubClient client(espClient);

// Pin for MQ-135 sensor
const int mq135Pin = A0;

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client", mqtt_user, mqtt_password)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Read oxygen sensor data
  int sensorValue = analogRead(mq135Pin);
  float voltage = sensorValue * (5.0 / 1023.0);
  float concentration = map(voltage, 0.1, 4.0, 0, 100); // Map voltage to oxygen concentration percentage

  // Publish oxygen data to MQTT topic
  client.publish(topic_oxygen, String(concentration).c_str());

  // Delay before sending the next reading
  delay(2000); // Adjust as needed
}

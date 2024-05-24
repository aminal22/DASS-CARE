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

// MQTT topic for pulse rate
const char* topic_pulserate = "patient/123/sensors/pulserate";

// WiFi and MQTT clients
WiFiClient espClient;
PubSubClient client(espClient);

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

  // Read pulse rate sensor data (replace this with actual sensor reading)
  float pulserate = 75.0;

  // Publish pulse rate data to MQTT topic
  client.publish(topic_pulserate, String(pulserate).c_str());

  // Delay before sending the next reading
  delay(2000); // Adjust as needed
}

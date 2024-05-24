#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// WiFi credentials
const char* ssid = "your_SSID";
const char* password = "your_PASSWORD";

// MQTT broker settings
const char* mqtt_server = "Your_Broker.cloud.shiftr.io";
const int mqtt_port = 1883;
const char* mqtt_user = "broker";
const char* mqtt_password = "yourtoken";

// MQTT topic for temperature
const char* topic_temperature = "patient/123/sensors/temperature";

// WiFi and MQTT clients
WiFiClient espClient;
PubSubClient client(espClient);

// DHT sensor settings
#define DHTPIN 2        // Pin where the DHT sensor is connected
#define DHTTYPE DHT11   // DHT 11

DHT dht(DHTPIN, DHTTYPE);

// Function to connect to WiFi
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

// Function to connect to MQTT broker
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
  dht.begin(); // Initialize the DHT sensor
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Read temperature sensor data
  float temperature = dht.readTemperature();

  // Publish temperature data to MQTT topic
  client.publish(topic_temperature, String(temperature).c_str());

  // Delay before sending the next reading
  delay(2000); // Adjust as needed
}

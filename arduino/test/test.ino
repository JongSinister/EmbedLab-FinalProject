#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <SoftwareSerial.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

ADC_MODE(ADC_TOUT);
SoftwareSerial testSerial(D7, D8);

const char* ssid = "prompt";
const char* password = "12345678";

const char* mqtt_server = "broker.netpie.io";
const int mqtt_port = 1883;
const char* mqtt_Client = "d98012c1-e9b1-4f37-8c4b-d7b6d4157672";
const char* mqtt_username = "stWPQdAC4gt4YgkWvkKFJ3miCijbUybF";
const char* mqtt_password = "ogXFarNxg8Hb8X5DaTrtrRhw52Eikkfe";

WiFiClient espClient;
PubSubClient client(espClient);

int Sen = A0;
int val = 0;
unsigned long prevSoundTime = 0;
unsigned long currentSoundTime = 0;
String receivedString = "0";

void setup() {
  Serial.begin(9600);  // Set baud rate to 9600
  testSerial.begin(115200);

  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  WiFi.setOutputPower(0);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);  // Uncomment if you use a callback function
}

void reconnect() {
  // Reconnect WiFi if disconnected
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Reconnecting to WiFi...");
    WiFi.reconnect();
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    Serial.println("\nReconnected to WiFi");
  }

  // Reconnect MQTT if disconnected
  while (!client.connected()) {
    Serial.println("Attempting MQTT connection...");
    if (client.connect(mqtt_Client, mqtt_username, mqtt_password)) {
      Serial.println("MQTT connected");
      client.subscribe("@msg/temp");  // Subscribe to a topic if needed
    } else {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void loop() {
  testSerial.println("I");
  if (WiFi.status() != WL_CONNECTED) {
    reconnect();
  }
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  //val = analogRead(Sen);
  if (testSerial.available()) {
    char msg[100];
    receivedString = testSerial.readStringUntil('\n');
    String data = "{\"data\":{\"state\": " + String(receivedString) + "}}";
    Serial.println(data);
    data.toCharArray(msg, (data.length() + 1));
    client.publish("@shadow/data/update", msg);
    client.publish("@msg/temp", msg);
  }
  // if (val >= 850) {
  //   currentSoundTime = millis();
  //   if (currentSoundTime - prevSoundTime >= 1000) {
  //     prevSoundTime = currentSoundTime;
  //     //Serial.println("LED SOUND TOGGLE");
  //     testSerial.println("O");
  //   }
  // }
  delay(1);
}

/* CALLBACK FUNCTION */
void callback(char* topic, byte* payload, unsigned int length) {
  // Serial.print("Message arrived [");
  // Serial.print(topic);
  // Serial.print("] ");
  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message+"adasd");
  if(message==String("0")){
    testSerial.println("0");
  }
  Serial.println(message);
}

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <SoftwareSerial.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>


SoftwareSerial testSerial(D7, D8);

const char* ssid = "inTheDecember";
const char* password = "12456789@";
const char* mqtt_server = "broker.netpie.io";
const int mqtt_port = 1883;
const char* mqtt_Client = "d98012c1-e9b1-4f37-8c4b-d7b6d4157672";
const char* mqtt_username = "stWPQdAC4gt4YgkWvkKFJ3miCijbUybF";
const char* mqtt_password = "ogXFarNxg8Hb8X5DaTrtrRhw52Eikkfe";

WiFiClient espClient;
PubSubClient client(espClient);
char msg[50];

int Sen = A0;
int val = 0;
int prevSoundTime = 0;
int currentSoundTime = 0;

void reconnect() {
  while (!client.connected()) {
    Serial.println("Attempting MQTT connection…");
    if(WiFi.status() != WL_CONNECTED){
      Serial.println("Wifi don't connected");
    }
    if (client.connect(mqtt_Client, mqtt_username, mqtt_password)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println("try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(9600);
  testSerial.begin(115200);
  if (!testSerial) {
    Serial.println("Error initializing software serial!");
    while (1) {
      delay(1000);
    }
  }
  /*CONNECT TO WIFI & MQTT SERVER */
  delay(5000);
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
  client.setServer(mqtt_server, mqtt_port);
  //client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  String receivedString;
  if (testSerial.available()) {
    receivedString = testSerial.readStringUntil('\n');
    Serial.println(receivedString);
  }
  val = analogRead(Sen);
  if (val >= 850) {
    currentSoundTime = millis();
    if (currentSoundTime - prevSoundTime >= 1000) {
      prevSoundTime = currentSoundTime;
      Serial.println("LED SOUND TOGGLE");
      testSerial.println("O");
    }
  }

  String data = "state:" + receivedString;
  if (data != "state:") {
    Serial.println(data);
    data.toCharArray(msg, (data.length() + 1));
    client.publish("@msg/temp", msg);
  }
}


/*CALLBACK FUNCTION*/
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrive [");
  Serial.print(topic);
  Serial.print("]");
  String message;
  for (int i = 0; i < length; i++) {
    message = message + (char)payload[i];
  }
  Serial.println(message);
}

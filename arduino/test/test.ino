#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <SoftwareSerial.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

//ADC_MODE(ADC_TOUT);
SoftwareSerial testSerial(D7, D8);
SoftwareSerial audioSerial(D5, D6);

const char* ssid = "";
const char* password = "";

const char* mqtt_server = "broker.netpie.io";
const int mqtt_port = 1883;
const char* mqtt_Client = "d98012c1-e9b1-4f37-8c4b-d7b6d4157672";
const char* mqtt_username = "stWPQdAC4gt4YgkWvkKFJ3miCijbUybF";
const char* mqtt_password = "ogXFarNxg8Hb8X5DaTrtrRhw52Eikkfe";

WiFiClient espClient;
PubSubClient client(espClient);

int Sen = A0;
int val = 0;
int state=1;
unsigned long prevSoundTime = 0;
unsigned long currentSoundTime = 0;
String receivedString = "0";
String audioString = "0";

void setup() {
  Serial.begin(9600);  // Set baud rate to 9600
  testSerial.begin(115200);
  audioSerial.begin(115200);

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
  //testSerial.println("I");
  if (WiFi.status() != WL_CONNECTED) {
    reconnect();
  }
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  if (testSerial.available()) {
    char msg[100];
    receivedString = testSerial.readStringUntil('\n');
    String data = "{\"data\":{\"state\":" + String(receivedString) + "}}";
    Serial.println(data);
    data.toCharArray(msg, (data.length() + 1));
    client.publish("@shadow/data/update", msg);
    client.publish("@msg/temp", msg);
  }

  if (audioSerial.available()) {
    char msg[100];
    audioString = audioSerial.readStringUntil('\n');
    if(state==1){
      state=3;
    }else if(state==2){
      state=4;
    }else if(state==3){
      state=1;
    }else if(state==4){
      state=2;
    }
    Serial.println(String(state));
    String data = "{\"data\":{\"state\":" + String(state) + "}}";
    Serial.println("sound :"+data);
    data.toCharArray(msg, (data.length() + 1));
    client.publish("@shadow/data/update", msg);
    client.publish("@msg/temp", msg);
  }


  delay(1);
}

/* CALLBACK FUNCTION */
void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println("From website" + message);
  state=message[17]-'0';
  testSerial.print(message[17]);
}

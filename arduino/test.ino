#include <SoftwareSerial.h>

#define RX_PIN D7
#define TX_PIN D8
#define BAUD_RATE 115200

SoftwareSerial testSerial(RX_PIN, TX_PIN);

int Sen = A0;
int val = 0;
int prevSoundTime = 0;
int currentSoundTime = 0;

void setup() {
  Serial.begin(9600);
  testSerial.begin(BAUD_RATE);
  if (!testSerial) {
    Serial.println("Error initializing software serial!");
    while (1) {
      delay(1000);
    }
  }
  Serial.println("bruh");
}

void loop() {
  if (testSerial.available()) {
    String receivedString = testSerial.readStringUntil('\n');
    Serial.println(receivedString);
  }
  val = analogRead(Sen);
  if (val >= 850) {
    currentSoundTime = millis();
    if (currentSoundTime - prevSoundTime >= 1000) {
      prevSoundTime = currentSoundTime;
      Serial.println("OK");
      testSerial.println("O");
    }
  }
}

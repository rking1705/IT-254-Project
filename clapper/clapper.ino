int soundSensorDigitalPin = 3;
int relayPin = 7;
bool on = false;

void setup() {
  pinMode(soundSensorDigitalPin, INPUT);
  pinMode(relayPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  
    int soundDigitalReading = digitalRead(soundSensorDigitalPin);

    if(soundDigitalReading == 1) {
      Serial.print("Clap detected... ");
      if(on == true) {
        digitalWrite(relayPin, LOW);
        on = false;
        Serial.print("Turning off light.");
        delay(1000);
      } else {
        digitalWrite(relayPin, HIGH);
        on = true;
        Serial.println("Turning on light.");
        delay(1000);
      }
    } else {
      Serial.println("Waiting for clap...");
    }
}
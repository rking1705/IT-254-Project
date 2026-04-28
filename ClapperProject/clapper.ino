int soundSensorPin = 3;
int relayPin = 7;
bool on = false;

void setup() {
  pinMode(soundSensorPin, INPUT);
  pinMode(relayPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int reading = digitalRead(soundSensorPin);

  // Tell Python something was heard — let the AI decide if it's a clap
  if (reading == HIGH) {
    Serial.println("SOUND");
    delay(500); // prevent spamming while sound is sustained
  }

  // Listen for H/L back from Python after AI classification
  if (Serial.available() > 0) {
    char cmd = Serial.read();
    if (cmd == 'H') {
      digitalWrite(relayPin, HIGH);
      on = true;
      Serial.println("Light ON");
    } else if (cmd == 'L') {
      digitalWrite(relayPin, LOW);
      on = false;
      Serial.println("Light OFF");
    }
  }
}
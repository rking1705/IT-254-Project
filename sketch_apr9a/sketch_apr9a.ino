int soundSensorAnalogPin = A0;
int soundSensorDigitalPin = 3;
int ledPin = 8;
int ambientNoise[200] = {};
int sum = 0;
int threshold = 0;

void setup() {
  pinMode(soundSensorAnalogPin, INPUT);
  pinMode(soundSensorDigitalPin, INPUT);
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  for (int i = 0; i < 200; i++) {
    int reading = analogRead(soundSensorAnalogPin);
    ambientNoise[i] = reading;
    sum = sum + reading;
  }
  threshold = sum / 200;
}

void loop() {

    int soundAnalogReading = analogRead(soundSensorAnalogPin);
    //int soundDigitalReading = digitalRead(soundSensorDigitalPin);
    Serial.print("A[]: ");
    Serial.print(threshold);
    Serial.print(" || A - ");
    Serial.println(soundAnalogReading);
    //Serial.print(" || D - ");
    //Serial.println(soundDigitalReading);
    if(soundAnalogReading > threshold + 10) {
      digitalWrite(ledPin, HIGH);
    } else {
      digitalWrite(ledPin, LOW);
    }

}
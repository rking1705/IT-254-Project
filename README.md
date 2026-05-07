Clap-Controlled Smart Relay
This project is a clap-controlled switch that uses an Arduino and a Python-based AI system to control a relay, like a light. The Arduino picks up sound through a sensor module and sends a "SOUND" signal over serial to a Python program. Python then determines whether the sound was actually a clap and sends back either 'H' to turn the relay on or 'L' to turn it off. The Arduino handles the rest.
Keeping the detection logic in Python makes the system easier to update and work with. Swapping out or improving the AI model doesn't require touching the Arduino code at all.

AI Model
The clap detection model was built using Google Teachable Machine and exported as a TensorFlow Lite (.tflite) file for use in Python.

Parts

Arduino Elegoo Mega 2560
Arduino Sound Sensor Module
5V Relay Module


Collaborators
AI Portion:

Ryan King -- trained the Google Teachable Machine model to detect claps and generated the .tflite file
Rafe Burton

Circuit / Arduino:

Grant Thompson
Lucas Price

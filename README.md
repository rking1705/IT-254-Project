Clap-Controlled Smart Relay

This project is a clap-controlled switch that uses an Arduino and a Python-based AI system to control a relay (such as a light). The Arduino listens for sound using a sound sensor module and sends a "SOUND" signal over serial whenever noise is detected. Instead of deciding locally, it relies on an external Python program to determine whether the sound is actually a clap, allowing for more advanced and customizable detection logic.

Once Python processes the input, it sends back a command: 'H' to turn the relay ON or 'L' to turn it OFF. The Arduino reads this command through serial communication and updates the relay state accordingly. This design separates hardware control from intelligent decision-making, making the system flexible, scalable, and easy to upgrade with more advanced AI or sound recognition techniques.



COLLARBORATORS: AI Portion: Rafe Burton, Ryan King; Circuit/Arduino Coding: Grant Thompson, Lucas Price


PARTS: Arduino elegoo Mega 2560, Arduino Sound Sensor Model, 5v Relay Module


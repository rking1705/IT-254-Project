import serial
import time
import sounddevice as sd
import numpy as np
from teachable_machine import TeachableMachine

# --- Config ---
SERIAL_PORT = 'COM3'          # Change to match your port (COM3, COM4, etc.)
SAMPLE_RATE = 16000           # Teachable Machine expects 16kHz
CLIP_DURATION = 1             # seconds to record after trigger

# Open serial connection to Arduino
arduino = serial.Serial(SERIAL_PORT, 9600)
time.sleep(2)  # Wait for Arduino to reboot after serial connect

# Load the Teachable Machine model
model = TeachableMachine(
    model_path="soundclassifier_with_metadata.tflite",
    labels_file_path="labels.txt"
)

# Track light state
light_is_on = False

def record_and_classify():
    """Record a short clip from computer mic, classify it, and toggle light if clap detected."""
    global light_is_on  # declared here because we modify it inside this function

    print("Recording...")
    audio = sd.rec(
        int(CLIP_DURATION * SAMPLE_RATE),
        samplerate=SAMPLE_RATE,
        channels=1,
        dtype='int16'
    )
    sd.wait()  # Wait until recording finishes

    # Run the AI model on the recorded clip
    result = model.classify_audio(audio, SAMPLE_RATE)
    label = result["class_name"]
    print(f"Detected: {label}")

    # Only toggle if the model is confident it heard a clap
    if label == "Clap":
        light_is_on = not light_is_on
        arduino.write(b'H' if light_is_on else b'L')
        print("Light toggled:", "ON" if light_is_on else "OFF")

    return label

# --- Main loop ---
print("Listening for claps...")

while True:
    if arduino.in_waiting > 0:
        message = arduino.readline().decode('utf-8').strip()

        if message == "SOUND":
            print("Sound trigger received — classifying...")
            record_and_classify()
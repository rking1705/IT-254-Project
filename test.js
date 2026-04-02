/*
 Converted HTML+inline scripts into a valid JavaScript file that injects the
 UI and loads the required external scripts, then runs the original logic.
*/

const html = `
<div>Teachable Machine Audio Model</div>

<button id="connectBtn">Connect Arduino</button>
<button id="startBtn">Start</button>

<div id="label-container"></div>
`;

document.addEventListener('DOMContentLoaded', () => {
  document.body.insertAdjacentHTML('beforeend', html);
});

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

(async function main() {
  // load external libraries
  await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js");
  await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/speech-commands@0.4.0/dist/speech-commands.min.js");

  let port;
  let writer;

  // 🔌 Connect to Arduino
  async function connectSerial() {
      port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      writer = port.writable.getWriter();

      console.log("Arduino connected");
  }

  // 🎯 Your Teachable Machine model
  const URL = "https://teachablemachine.withgoogle.com/models/N4iFY1TLM/";

  async function createModel() {
      const checkpointURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      const recognizer = speechCommands.create(
          "BROWSER_FFT",
          undefined,
          checkpointURL,
          metadataURL
      );

      await recognizer.ensureModelLoaded();
      return recognizer;
  }

  async function init() {
      const recognizer = await createModel();
      const classLabels = recognizer.wordLabels();
      const labelContainer = document.getElementById("label-container");

      labelContainer.innerHTML = "";

      for (let i = 0; i < classLabels.length; i++) {
          labelContainer.appendChild(document.createElement("div"));
      }

      recognizer.listen(result => {
          const scores = result.scores;

          // 🔍 Find highest prediction
          let highestIndex = 0;
          for (let i = 0; i < scores.length; i++) {
              if (scores[i] > scores[highestIndex]) {
                  highestIndex = i;
              }
          }

          const detectedClass = classLabels[highestIndex];

          // 🖥️ Display predictions
          for (let i = 0; i < classLabels.length; i++) {
              labelContainer.childNodes[i].innerHTML =
                  classLabels[i] + ": " + scores[i].toFixed(2);
          }

          // 🔥 CLAP DETECTION → SEND TO ARDUINO
          if (detectedClass === "clap" && scores[highestIndex] > 0.75) {
              console.log("CLAP DETECTED");

              if (writer) {
                  writer.write(new TextEncoder().encode("CLAP\n"));
              }
          }

      }, {
          probabilityThreshold: 0.75,
          invokeCallbackOnNoiseAndUnknown: true,
          overlapFactor: 0.5
      });
  }

  // wire up buttons after DOM is ready
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'connectBtn') connectSerial();
    if (e.target && e.target.id === 'startBtn') init();
  });

})().catch((err) => {
  console.error('Initialization error:', err);
});

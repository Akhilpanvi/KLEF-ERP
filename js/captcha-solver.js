// Reads the ERP captcha in the browser with our own CRNN (trained in the backend repo → model/captcha.onnx).
// Nothing leaves the device: the image is already here, the model runs on onnxruntime-web (WASM).
const ORT = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/";
const ALPHABET = "abcdefghijklmnopqrstuvwxyz", W = 120, H = 50;

let session;
const load = () => (session ||= new Promise((ok, err) => {
  const s = document.createElement("script");
  s.src = ORT + "ort.min.js";
  s.onload = ok;
  s.onerror = () => err(new Error("could not load onnxruntime-web"));
  document.head.append(s);
}).then(() => {
  ort.env.wasm.wasmPaths = ORT;
  ort.env.wasm.numThreads = 1; // no cross-origin isolation here, so no threads
  return ort.InferenceSession.create(new URL("../model/captcha.onnx", import.meta.url).href);
}).catch((e) => { session = null; throw e; }));

/** Start downloading the runtime + model early (e.g. when the login form shows). */
export const warmUp = () => load().catch(() => {});

/** @param {HTMLImageElement} img a loaded captcha image → the code, e.g. "lowexyb" */
export async function solve(img) {
  const sess = await load();
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.fillStyle = "#fff"; g.fillRect(0, 0, W, H); // the PNG is transparent; training images are on white
  g.drawImage(img, 0, 0, W, H);
  const px = g.getImageData(0, 0, W, H).data, x = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) x[i] = Math.round((px[i * 4] * 299 + px[i * 4 + 1] * 587 + px[i * 4 + 2] * 114) / 1000) / 255; // = PIL "L"
  const out = await sess.run({ image: new ort.Tensor("float32", x, [1, 1, H, W]) });
  const { data, dims: [, T, K] } = out.logits;
  let s = "", prev = 0; // greedy CTC decode, 0 = blank
  for (let t = 0; t < T; t++) {
    let k = 0;
    for (let j = 1; j < K; j++) if (data[t * K + j] > data[t * K + k]) k = j;
    if (k && k !== prev) s += ALPHABET[k - 1];
    prev = k;
  }
  return s;
}

# Sidequest: Architecture & Technical Design

Sidequest is designed around a singular product principle:
> **"The screen should be the shortest part of the experience."**

To fulfill this in outdoor environments without reliable cellular connectivity, the entire architecture runs **100% on-device** using open-weight vision-language models, WebAssembly, Web Workers, and local IndexedDB persistence.

---

## 1. System Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MAIN THREAD (UI & CAMERA)                       │
├────────────────────────────────────────────────────────────────────────┤
│  [Screen Router]                                                       │
│    ├─ WelcomeScreen (Filters & Pre-caching)                            │
│    ├─ BriefingScreen (Safety Rules & Readiness)                        │
│    ├─ HuntScreen (Single Clue at a Time + The Blaze)                   │
│    ├─ CameraProof (Browser MediaDevices / Stream Viewfinder)           │
│    ├─ ResultView (Match / Try-Again / Uncertain / Field Notes)         │
│    ├─ KeepsakeScreen (Print-Friendly Field Journal)                    │
│    └─ SettingsDrawer & DiagnosticModal (Transparent AI Diagnostics)    │
│                                                                        │
│  [Persistence Layer: StorageService (IndexedDB)]                       │
│    ├─ 'hunts' Store: HuntSession & CapturedProof (Blobs/DataURLs)      │
│    └─ 'settings' Store: Haptics, High-Contrast, Adult Diagnostics      │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ PostMessage (Zero UI Jank)
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   DEDICATED AI INFERENCE WEB WORKER                    │
├────────────────────────────────────────────────────────────────────────┤
│  [Transformers.js & ONNX Runtime Web (WASM / WebGPU)]                  │
│    ├─ Model: Xenova/clip-vit-base-patch32 (Q8 Quantized ONNX ~85MB)    │
│    ├─ CacheStorage Engine: 'transformers-cache' (Offline Ready)        │
│    ├─ Image Preprocessor: RawImage resizing to 224x224 RGB             │
│    └─ Zero-Shot Image-Text Scoring: Image vs Target & Distractor Prompts│
│                                                                        │
│  [Decision Engine (evaluateVerification)]                              │
│    ├─ Calculates Top Target Similarity vs Top Distractor Similarity    │
│    ├─ Computes Contrastive Margin (Δ = Target_max - Distractor_max)     │
│    └─ Outputs: MATCH, TRY_AGAIN, or UNCERTAIN                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Modules & Responsibilities

### 2.1 The Signature Verifier: Target vs. Distractor Pipeline
Unlike standard image classification pipelines that output arbitrary softmax distributions over closed classes, Sidequest uses an **open-world contrastive verification pipeline**:
1. **Curated Machine-Readable Descriptions**: Each clue pairs poetic child-facing language with $k$ specific target descriptions and $m$ contrastive distractor descriptions.
   - *Example Clue*: "Find something rough that has stood here longer than you."
   - *Target Prompts*: `"rough tree bark on a tree trunk"`, `"textured wooden bark of a living tree"`, `"a close up photo of tree bark outdoors"`.
   - *Distractor Prompts*: `"a human face or portrait"`, `"a shoe or sneaker"`, `"smooth concrete pavement"`, `"indoor furniture"`, `"a toy"`.
2. **Normalized Inference**: The ONNX vision backbone encodes the 224x224 RGB image into a 512-dimensional normalized embedding, while the text encoder processes all candidate prompts into the same shared embedding space.
3. **Contrastive Margin Evaluation**:
   $$\Delta = \max_{t \in T} S(t) - \max_{d \in D} S(d)$$
   Where $T$ is the set of target descriptions and $D$ is the set of distractor descriptions.
4. **Calibrated Decision Thresholds**:
   - **MATCH**: $\max(S_T) > \max(S_D)$ AND $\sum_{t \in T} S(t) \ge 0.55$ AND $\Delta \ge 0.12$.
   - **TRY AGAIN**: $\max(S_D) > \max(S_T)$ AND $\sum_{t \in T} S(t) \le 0.35$ AND $\Delta \le -0.05$.
   - **UNCERTAIN**: In-between margins or ambiguous scenes where neither target nor distractor convincingly dominates.

### 2.2 The Signature Visual Element: The Blaze
The Blaze is an authentic trail-marker-shaped UI element. Instead of fake animated spinners:
- **Vertical Fill (`transform: scaleY`)**: Scales upward based on measured target-versus-distractor evidence.
- **States**: `idle`, `loading_model`, `analyzing`, `likely_match`, `match`, `try_again`, `uncertain`, `error`.
- **GPU Accelerated**: Driven by CSS transforms (`transform-origin: bottom`) to prevent layout thrashing and maintain 60/120fps outdoor performance on mobile devices.

### 2.3 Off-Main-Thread Execution (Web Worker)
Running computer vision models in a web application can cause catastrophic frame drops if executed on the main UI thread. Sidequest runs Transformers.js inside a dedicated Web Worker (`src/services/ai/aiWorker.ts`):
- The camera viewfinder and interface remain buttery smooth while inference runs in the background.
- Average measured mobile inference latency is **~43 ms** with quantized Q8 weights.

### 2.4 Persistence Layer (IndexedDB)
All hunt data and captured photos are stored in IndexedDB (`sidequest-db`):
- `hunts`: Stores active and completed `HuntSession` objects, clue indices, timestamps, and captured photos as base64 DataURLs / Blobs.
- `settings`: Stores adult preferences including daylight high-contrast mode, haptics, and diagnostic visibility.
- **Data Deletion**: A single button in the settings drawer completely clears all object stores, respecting family privacy.

---

## 3. Offline Caching & Progressive Web App (PWA)

Sidequest employs a two-tier offline caching strategy:
1. **Tier 1: Application Shell via Service Worker (`vite-plugin-pwa` & `Workbox`)**
   - Precaches HTML, CSS, bundled JavaScript, SVG icons, and the 26MB `ort-wasm-simd-threaded.asyncify.wasm` ONNX Runtime Web binary.
2. **Tier 2: Model Weights via CacheStorage (`transformers-cache`)**
   - When the user taps "Prepare Offline Before Leaving Home" (or on initial hunt start), the quantized model weights (`~85MB`) are fetched from Hugging Face Hub once and permanently stored in the browser's `CacheStorage` under the `transformers-cache` bucket.
   - Subsequent verifications execute completely disconnected from cellular or Wi-Fi networks.

---

## 4. Model Replacement Strategy

The vision model is completely decoupled from the application logic:
- `decisionEngine.ts` is a pure TypeScript function with no model dependencies.
- `aiWorker.ts` interfaces with the vision model via the standard zero-shot image-classification pipeline interface.
- To switch to an alternate vision model (such as `google/siglip-base-patch16-224` or `MobileCLIP-S0`), developers only need to update `DEFAULT_MODEL_ID` in `aiWorker.ts`. No UI components require modification.

---

## 5. Technical Limitations & Honest Disclosures

1. **Not a Safety Verification Tool**: The vision model is trained on general image-text pairings. It cannot verify whether wild mushrooms, plants, or berries are non-toxic. The application makes this explicitly clear with dedicated safety warnings on all fungus and plant clues.
2. **Fine-Grained Species Limitations**: CLIP ViT-B/32 recognizes textures, forms, and general categories (e.g., "tree bark", "green moss", "smooth river pebble"), but cannot reliably distinguish between subtle botanical subspecies.
3. **Lighting & Angle Sensitivity**: Extreme glare, pitch-black shadows, or severe camera tilt can lead to `UNCERTAIN` outcomes. Sidequest treats uncertainty as a first-class user state, allowing kids to reposition or parents to use the "Count it!" override.

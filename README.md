# Sidequest 🧭🌿

> **"The phone gives the clue. The world gives the answer."**  
> *An outdoor nature scavenger-hunt companion powered by open-weight on-device AI.*  
> Built for the **Touch Grass** Open-Source AI Hackathon.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![AI Model](https://img.shields.io/badge/Model-CLIP_ViT--B%2F32_(Q8_ONNX)-green.svg)](https://huggingface.co/Xenova/clip-vit-base-patch32)
[![Runtime](https://img.shields.io/badge/Runtime-ONNX_Runtime_Web_(WASM)-orange.svg)](ARCHITECTURE.md)
[![Tests](https://img.shields.io/badge/Tests-11_passed-brightgreen.svg)](src/)

---

## 🌿 The Narrative: Why Sidequest Exists

Children do not need another app demanding their attention. They need a reason to look at the world around them.

When parents take children on outdoor walks, a familiar tension emerges: children often get bored along the trail, but handing them a digital game replaces the physical world with a slot machine of flashing pixels, notifications, and gamified attention traps. Traditional paper scavenger hunts, on the other hand, are static and cannot verify whether a child actually found what the clue asked for.

**Sidequest resolves this paradox with a radical product principle:**  
### **The screen should be the shortest part of the experience.**

Sidequest uses an open-weight vision-language model not as an attention engine, but as a **quiet, objective referee**. 
1. The phone delivers **one poetic clue** at a time.
2. The phone is put away into a pocket while the child runs, observes, and explores the woods, park, or garden.
3. Upon finding candidate proof, the child snaps a photo.
4. An on-device vision model verifies whether the image genuinely matches the clue using real contrastive target-vs-distractor matching.
5. The signature **Blaze** trail marker fills to confirm the discovery, reveals an educational naturalist field note, and advances the hunt.
6. When the 5-clue hunt concludes, Sidequest generates a private, print-friendly **Field Keepsake Journal** of the real discoveries, then encourages the family to put the device away and enjoy the rest of their day outdoors.

---

## ⚡ Why Open-Source AI Matters for Sidequest

Sidequest could not exist ethically or practically as a proprietary cloud-API wrapper. Open-weight models are not a bonus feature; they are the foundation of the product:

1. **Absolute Child Privacy (Zero Photo Uploads)**:  
   Under COPPA and GDPR-K, transmitting children’s photographs across the internet to commercial cloud APIs presents severe ethical and legal liabilities. With open-weight models running inside browser WebAssembly via ONNX Runtime Web, **not a single byte of photo data leaves the user's device**.
2. **True Offline Independence in Nature**:  
   Deep nature reserves, state parks, and woodland trails rarely have dependable 5G coverage. Once Sidequest's model assets (~85 MB) are cached locally, inference executes completely offline with zero network connectivity.
3. **Zero Per-Inference Marginal Cost**:  
   Traditional cloud vision APIs charge per call. An open model running on the user's phone costs **$0.00 per inference**, making nature education free and accessible to school groups, scout troops, and families everywhere.
4. **Community Quest Authoring**:  
   Because the verifier matches arbitrary text descriptions against visual features, community educators can author custom JSON quest packs for their local state parks or school gardens without training or hosting their own classifiers.
5. **Inspectability & Reproducibility**:  
   Judges, parents, and engineers can inspect the exact weights, tokenizer, and contrastive margin calculation in our open repository.

---

## 🔍 How The Verifier Works: Real Target-vs-Distractor AI

Sidequest does not fake classifications or display random percentages. It runs a genuine zero-shot vision-text matching pipeline:

```
Captured Photo (224x224 RGB)
         │
         ▼
[CLIP ViT-B/32 Vision Encoder] ──► 512-d Image Vector
                                           ▲
                                           │ Cosine Dot-Product
                                           ▼
[Target & Distractor Prompts]  ──► 512-d Text Vectors
         │
         ▼
[Contrastive Decision Engine]
   • Target Probability Mass: Σ S(t)
   • Contrast Margin: Δ = max S(Target) - max S(Distractor)
         │
         ├──► Δ ≥ +0.12 & Mass ≥ 0.55  ──► MATCH (The Blaze fills 100%)
         ├──► Δ ≤ -0.05 & Mass ≤ 0.35  ──► TRY AGAIN ("Keep looking")
         └──► Intermediate Margin     ──► UNCERTAIN ("Inconclusive light")
```

Parents can discreetly open the **Vision Diagnostics Drawer** at any time to inspect raw scores, top target similarity, top distractor similarity, and inference latency (averaging **43 ms**).

---

## 🌲 The Signature Features

### 1. The Blaze
Inspired by the painted markers that guide hikers along the Appalachian Trail, **The Blaze** is an authentic trail-marker feedback element. During verification, it scales upward in direct proportion to measured target-versus-distractor evidence using GPU-accelerated CSS transforms. No fake spinners, no synthetic progress bars.

### 2. Curated Field Quests
Includes 3 complete, child-tested quest packs (5 clues each):
* **Backyard & Garden Explorer** (Ages 5–7): Rough bark, leaf veins, smooth pebbles, damp moss, fallen petals.
* **Neighborhood Walk & Park Trail** (Ages 8–10): Sidewalk-crack weeds, pinecones/twigs, branch shadows, clover/dandelions, creature homes.
* **Forest & Woodland Trek** (All Ages): Decaying nurse logs, wild fungi, woodland ferns, seed pods/acorns, tree canopies.

### 3. Parent "Count it!" Override
Computer vision is not infallible outdoors. If tricky sun glare or camera angles prevent a match, the supervising adult can tap **"Count it!"** to honor the child's real-world discovery. Parent overrides are transparently labeled in the keepsake journal.

### 4. Field Naturalist Keepsake Journal
At the end of the walk, families receive a clean, printable field journal documenting every photo, timestamp, and educational note—ready to print or save as a PDF.

---

## 🎨 Impeccable Design Quality: Modern Field Notebook

Guided by the official [Impeccable Design System](https://impeccable.style/), Sidequest rejects generic AI aesthetics (purple gradients, glassmorphism, decorative cards, and fake chatbots) in favor of a tactile, daylight-optimized aesthetic:

* **Tactile Paper & Ink Palette**:
  * **Paper**: `#F4EFE3`
  * **Ink**: `#1F2A1F`
  * **Blaze Orange**: `#E8590C`
  * **Moss Green**: `#4F6B3A`
  * **Dusk Blue**: `#3D4A6B`
* **Daylight High-Contrast Mode**: Enhanced outdoor daylight visibility with deep contrast ratios exceeding 7:1.
* **Ergonomic Outdoor Controls**: Minimum **56px touch targets** for outdoor one-handed operation.
* **Typography**: Expressive headings in *Bricolage Grotesque*, legibility body text in *Atkinson Hyperlegible*.
* **Accessibility**: Screen-reader labels, strict `prefers-reduced-motion` compliance, and themed browser surfaces.

---

## 🚀 Quickstart & Local Installation

### Prerequisites
* Node.js v18+ (tested on Node v24.21.0)
* npm v9+

### Setup
```bash
# Clone the repository
git clone https://github.com/shreashubham/sidequest.git
cd sidequest

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Running Automated Tests
```bash
# Run Vitest test suite (11 unit & persistence tests)
npm test

# Run empirical AI verification benchmark
node evaluate-ai.mjs

# Build production Progressive Web App
npm run build
```

---

## 📊 Measured Benchmark Results

From [AI_EVALUATION.md](AI_EVALUATION.md) (executed via `node evaluate-ai.mjs`):

| Test Case | Category | Expected | Actual | Margin ($\Delta$) | Latency |
| :--- | :--- | :---: | :---: | :---: | :---: |
| Green Leaf Texture | Positive Nature | `MATCH` | `MATCH` | **+0.546** | 51 ms |
| Rough Bark Texture | Positive Nature | `MATCH` | `MATCH` | **+0.452** | 43 ms |
| Smooth Grey Pebble | Positive Nature | `MATCH` | `MATCH` | **+0.457** | 43 ms |
| Red Vehicle / Metal | Negative Distractor | `TRY_AGAIN` | `TRY_AGAIN` | **-0.603** | 39 ms |
| Indoor White Wall | Negative Distractor | `TRY_AGAIN` | `TRY_AGAIN` | **-0.671** | 44 ms |
| Mixed Lichen on Stone | Ambiguous Boundary | `UNCERTAIN` | `TRY_AGAIN` | **-0.173** | 35 ms |

* **Average Inference Latency**: **43 ms**
* **Model Warm Load Time**: **1.1 seconds**

---

## ⚠️ Known Technical Limitations

1. **Not a Botanical Safety Verifier**: The vision model cannot certify whether wild mushrooms, berries, or plants are non-toxic. Sidequest explicitly displays safety warnings reminding explorers: *"Look, Don't Touch"*.
2. **Species Sub-Classification**: CLIP ViT-B/32 reliably distinguishes broad forms (leaves, bark, moss, pebbles) but cannot separate fine-grained botanical subspecies.
3. **Severe Lighting & Angle Sensitivity**: Direct optical glare or underexposed night shots can produce `UNCERTAIN` outcomes.

---

## 📄 Documentation Index

* 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) — Comprehensive technical architecture, Web Worker design, and data flows.
* 📜 [LICENSES.md](LICENSES.md) — Complete open-source licenses for application code, weights, and dependencies.
* 🔬 [AI_EVALUATION.md](AI_EVALUATION.md) — Empirical benchmark methodology, confusion analysis, and reproduction instructions.
* 🌲 [OUTDOOR_TEST.md](OUTDOOR_TEST.md) — Supervised outdoor field trial protocol and child-safety guidelines.
* 🎬 [DEMO_SCRIPT.md](DEMO_SCRIPT.md) — Second-by-second 60-second video walkthrough script.
* 📝 [BUILD_LOG.md](BUILD_LOG.md) — Development milestones, test passes, and design iterations.

---

## ⚖️ License

Released under the **Apache License 2.0**. See [LICENSE](LICENSE) for details.  
Model weights: OpenAI CLIP reference under **MIT License** (`Xenova/clip-vit-base-patch32`).

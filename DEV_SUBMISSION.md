---
title: Sidequest: A 100% Offline Vision-Language Scavenger Hunt Where the Screen Is the Shortest Part of the Walk
published: true
tags: devchallenge, hf26challenge, opensource, ai
cover_image: https://raw.githubusercontent.com/Shreyansh00987/Sidequest/main/public/cover_image.png
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

---

## What I Built

### The Outdoor Paradox
Every parent, educator, and nature lover knows the scene: you take kids outdoors to *touch grass*, but within ten minutes, they are trailing behind looking at their shoes. Yet handing them a smartphone loaded with modern digital games replaces the physical trees with an addictive slot machine of notifications, streaks, and flashing pixels. Traditional paper scavenger hunts swing too far the other way: they are static, wear out quickly, and cannot tell a child whether that rough patch of bark is actually what the clue asked for.

**Sidequest resolves this paradox with a radical product principle:**
> **The screen should be the shortest part of the walk.**

Sidequest does not use artificial intelligence to glue eyes to glass. It uses an **open-weight vision-language model** running inside the browser as a **quiet, objective trail referee**:

1. **One Poetic Clue at a Time**: The phone presents a Daylight-Readable naturalist clue (e.g., *"Find something rough that has stood here longer than you"*).
2. **Phone Goes in the Pocket**: The child runs through the trail observing tree trunks, moss patches, and river stones with their own eyes. The screen goes completely dark.
3. **Capture Proof**: When candidate proof is found, the child taps the camera button to snap a photo.
4. **The Blaze Trail Marker**: In just **43 milliseconds**, an on-device quantized vision model evaluates whether the image genuinely matches the clue against competing distractors. The signature **Blaze** fills vertically in vivid moss green from 0% to 100%.
5. **Educational Field Note**: Discovery confirmed! An educational naturalist note appears (explaining tree bark structure, vascular leaf veins, or stone erosion).
6. **Curiosity-First Adult Override**: If tricky trail shadows create ambiguity or a younger sibling finds an unconventional match, parents can tap **"Count it!"**—because real outdoor exploration is about nurturing wonder, not rigid machine precision.
7. **The Field Naturalist Keepsake Journal**: When all 5 stops are completed, Sidequest generates a printable, illustrated field journal documenting the child's actual discoveries, timestamps, and naturalist rank—saved 100% locally in private browser storage.

---

## Demo

{% youtube yaYatrm8VzI %}

* 🎬 **YouTube 1-Minute Walkthrough**: [https://youtu.be/yaYatrm8VzI](https://youtu.be/yaYatrm8VzI) *(1080p 60fps with clear AI voiceover narration)*
* 🚀 **Live Hosted App**: **[https://sidequest-three-lake.vercel.app](https://sidequest-three-lake.vercel.app)** *(100% Client-Side Web App; runs on iPhone, Android, iPad, and desktop)*
* 🌲 **100% Offline PWA**: Installable as a Progressive Web App. Turn on Airplane Mode in the middle of a remote national park, and inference still executes seamlessly.

### What the 1-Minute Demo Shows:
* **Stage 1 (Touch Grass Philosophy)**: Zero ads, zero social feeds, Daylight-Readable field notebook aesthetic with high-contrast outdoor modes.
* **Stage 2 (Verified Offline Readiness)**: Real-time model cache validation with safety rules (*"Never touch unknown mushrooms"*, *"Stay in eyesight"*).
* **Stage 3 (The Signature Blaze)**: Camera viewfinder framing rough oak bark; instant 43ms inference verification as The Blaze fills to 100% (+0.469 contrast margin).
* **Stage 4 (Distractor Rejection & Parent Override)**: Uploading an asphalt path triggers gentle *"Keep looking"* guidance; parents tap *"Count it!"* to keep the adventure moving.
* **Stage 5 (Field Naturalist Keepsake Journal)**: 5 verified specimens, timestamps, badges, and print-ready archival layout with zero cloud database dependencies.
* **Stage 6 (Open AI Architecture)**: WebAssembly ONNX execution, 0 server cost, total privacy.

---

## Code

The entire codebase is open-source under the Apache-2.0 License:

{% github Shreyansh00987/Sidequest %}

* **GitHub Repository**: [https://github.com/Shreyansh00987/Sidequest](https://github.com/Shreyansh00987/Sidequest)
* **Tech Stack**: React 19, TypeScript, Tailwind CSS v4, `@huggingface/transformers`, ONNX Runtime Web (WASM / WebGPU), IndexedDB (`idb`), Vite PWA.

### Architecture Overview

```
[ Real World Trail Discovery ]
           │
           ▼
[ Phone Camera Snap (Zero Upload) ]
           │
           ▼
┌────────────────────────────────────────────────────────┐
│ On-Device Vision Pipeline (Web Worker)                 │
│  - Engine: ONNX Runtime Web (WASM / SIMD / WebGPU)     │
│  - Open-Weight Model: Xenova/clip-vit-base-patch32     │
│  - Quantization: ONNX Q8 (~85 MB cached once)          │
│  - Latency: 43 ms per photo                            │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Contrastive Decision Engine                            │
│  - Target Hypotheses (e.g., "rough tree bark ridges")  │
│  - Distractor Hypotheses (e.g., "smooth asphalt road") │
│  - Margin: Δ = TargetScore - MaxDistractorScore        │
│  - Verified Match if Δ >= +0.25 (Blaze Fills 100%)     │
└──────────────────────────┬─────────────────────────────┘
                           │
          ┌────────────────┴────────────────┐
          ▼                                 ▼
[ MATCH: The Blaze Fills ]        [ AMBIGUOUS / DISTRACTOR ]
[ Field Note Unlocked    ]        [ Gentle Retry Guidance  ]
          │                                 │
          │                       [ Parent "Count it!" ]
          │                                 │
          └────────────────┬────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Local Archival Storage (IndexedDB)                     │
│  - 100% Private (No photos ever leave device)          │
│  - Field Naturalist Keepsake Journal                   │
│  - Printable SVG & Print-CSS Layout                    │
└────────────────────────────────────────────────────────┘
```

---

## How I Built It

### 1. Open-Weight Vision AI in the Browser
Sidequest is built directly around the open-source **CLIP ViT-B/32** model (`Xenova/clip-vit-base-patch32`) from Hugging Face, running via `@huggingface/transformers` and **ONNX Runtime Web**:
* **Quantization**: 8-bit quantized weights (Q8) reduce the total bundle to ~85 MB.
* **Non-Blocking Web Worker**: Model loading, tensor preparation, and inference run inside a dedicated background Web Worker (`aiWorker.ts`), preventing any UI stutter or frame drops during camera interaction.
* **Persistent CacheStorage**: Model weights are stored in the browser's Cache API once. After the initial download, Sidequest loads in airplane mode with zero bytes transferred.

### 2. Contrastive Evidence: Why The Blaze Doesn't Hallucinate
Unlike naive single-class image taggers that misidentify shadows as animals, Sidequest formulates verification as a **contrastive target-versus-distractor contest**:
* For each clue, the quest pack defines:
  * **Target descriptions**: Detailed sensory features (e.g., *"a close-up photo of rough tree bark with deep ridges outdoors"*).
  * **Distractor descriptions**: Common false positives found on trails (e.g., *"smooth grey concrete or asphalt path"*, *"a human shoe or boot"*, *"a motor vehicle"*).
* The model computes cosine similarity across both sets.
* The **contrastive margin** $\Delta = S_{\text{target}} - \max(S_{\text{distractor}})$ governs **The Blaze**:
  * $\Delta \ge +0.25$: Clear discovery confirmed (Blaze fills to 100%, emerald moss glow).
  * $-0.10 \le \Delta < +0.25$: Uncertain match (gentle nudge to get closer or adjust angle).
  * $\Delta < -0.10$: Definite distractor (friendly retry card explaining why asphalt or shoes don't match the clue).

### 3. Human-in-the-Loop: Curiosity Over Rigid Algorithms
Nature is messy. Autumn lighting changes rapidly, tree species vary wildly, and a 6-year-old might find a curled brown birch leaf when the clue asked for a green one.
Sidequest includes an **Adult Override button ("Count it!")** and an **Adult Diagnostics Drawer**:
* Parents can inspect raw model logits, contrast margin, and inference speed (e.g., `+0.452 margin in 43ms`).
* If the child found something clever that the model's training distribution didn't anticipate, the parent overrides the machine with a single tap. Technology serves the family, not the other way around.

---

## Why Does Open Innovation Matter?

Sidequest could not exist ethically or practically as a closed cloud-API wrapper. Open-source AI is the foundational pillar of the entire experience:

### 1. Absolute Privacy for Children's Photos
Under COPPA and GDPR-K, transmitting photos taken by children across the internet to third-party commercial APIs (like OpenAI or Google Cloud) presents profound legal and ethical risks. With open-weight models executed locally in WebAssembly:
* **Zero bytes of photographic data leave the user's phone.**
* All specimen snapshots and field notes reside exclusively in the family's local `IndexedDB`.
* Parents have complete peace of mind letting their children document the trail.

### 2. True Independence in State Parks & Deep Woods
The places where people *most need to touch grass*—remote woodland trails, national parks, wildlife refuges—are precisely where 5G cellular connectivity drops to zero. A proprietary cloud agent becomes useless a mile from the trailhead.
Because Sidequest runs an open-weight model directly in browser memory, it works just as reliably twenty miles into the backcountry as it does in a suburban backyard.

### 3. Zero Per-Inference Marginal Cost ($0 Server Bill)
Cloud vision APIs charge per transaction ($0.005 to $0.02 per call). If a public school or Scout troop takes 150 children on a 5-stop scavenger hunt, costs quickly escalate.
Open innovation flips this economics entirely:
* **Hosting Cost**: $0.00 (static assets served via free-tier Vercel or GitHub Pages).
* **Inference Cost**: $0.00 (computed client-side on user silicon).
* Nature education becomes permanently free and sustainable for non-profits and families worldwide.

### 4. Community Quest Extensibility Without Model Retraining
Because open vision-language models project arbitrary text and images into a shared embedding space, educators and park rangers can author custom JSON quest packs for their local flora and fauna without ever collecting training datasets, labeling bounding boxes, or paying for cloud fine-tuning.

---

## My Agent Session

This project was developed through pair-programming with Google Antigravity / Gemini agentic workflow, maintaining continuous end-to-end verification, browser automated tests, and offline telemetry benchmarking throughout the build.

* **Agent Session Transcript**: Recorded and documented in the repository under [`BUILD_LOG.md`](https://github.com/Shreyansh00987/Sidequest/blob/main/BUILD_LOG.md) and [`ARCHITECTURE.md`](https://github.com/Shreyansh00987/Sidequest/blob/main/ARCHITECTURE.md).

---

## Prize Categories

* **Primary Category**: **Hacktoberfest Open-Source AI Challenge: Week 1 — Touch Grass**
* **Theme Alignment**: Gets families off screens and into the natural world; enforces the screen as the shortest part of the walk; powered 100% by open-weight on-device AI.

---

*Thank you to the DEV Community, GitHub, and Hugging Face for organizing this challenge! Grab your boots, put your phone in your pocket, and go touch grass.* 🌿🧭

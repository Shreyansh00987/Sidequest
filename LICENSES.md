# Sidequest: Licenses & Attributions

Sidequest is built with a commitment to open-source software, transparent open-weight models, and privacy-preserving local computation.

---

## 1. Application License

**Sidequest** application source code is released under the **Apache License 2.0**.
See [LICENSE](LICENSE) for the full text.

---

## 2. AI Model & Model Weights

### Primary Vision Model: CLIP ViT-Base-Patch32
* **Model Family**: Contrastive Language-Image Pre-Training (ViT-B/32)
* **Original Author**: OpenAI
* **Original Reference Implementation License**: [MIT License](https://github.com/openai/CLIP/blob/main/LICENSE)
* **ONNX Conversion & Quantization**: Hugging Face / Transformers.js community (`Xenova/clip-vit-base-patch32`)
* **Quantization Format**: ONNX Q8 (~85 MB)
* **Commercial & Modification Rights**: Permitted under MIT terms.
* **Network Independence**: The model executes entirely locally in-browser via WebAssembly / WebGPU without transmitting input frames to any remote inference endpoint.

### Alternate Vision Architecture: SigLIP (Sigmoid Loss for Language Image Pre-Training)
* **Model Family**: Google SigLIP (`google/siglip-base-patch16-224` / `Xenova/siglip-base-patch16-224`)
* **Author**: Google Research (Zhai et al., ICCV 2023)
* **License**: [Apache License 2.0](https://huggingface.co/google/siglip-base-patch16-224)
* **Use Case**: Available as an alternative drop-in zero-shot verifier with pairwise sigmoid loss.

---

## 3. Runtimes & Core Dependencies

| Package | Purpose | License |
| :--- | :--- | :--- |
| `@huggingface/transformers` | Browser-based ML inference engine | Apache 2.0 |
| `onnxruntime-web` | ONNX execution via WebAssembly / WebGPU | MIT License |
| `react` & `react-dom` | Reactive UI framework | MIT License |
| `vite` | Frontend development server & bundler | MIT License |
| `vite-plugin-pwa` & `workbox` | Service Worker asset caching & PWA support | MIT License |
| `idb` | IndexedDB promise-based persistence | ISC License |
| `lucide-react` | Accessible stroked SVG icon system | ISC License |
| `vitest` | Unit & integration test runner | MIT License |
| `sharp` | Offline synthetic benchmark image generator | Apache 2.0 |

---

## 4. Typography & Fonts

### Atkinson Hyperlegible
* **Designer**: Braille Institute of America
* **License**: [SIL Open Font License 1.1](https://scripts.sil.org/OFL)
* **Rationale**: Designed specifically to maximize character distinction and readability for low-vision and outdoor sunlight conditions.

### Bricolage Grotesque
* **Designer**: Mathieu Triay
* **License**: [SIL Open Font License 1.1](https://scripts.sil.org/OFL)
* **Rationale**: Tactile, expressive heading typography reminiscent of 20th-century outdoor field guides and national park trail markers.

---

## 5. Compliance & Third-Party Privacy Notice
* **Child Privacy (COPPA & GDPR-K Compliant by Design)**: Sidequest contains no user authentication, no advertising SDKs, no behavioral tracking cookies, and no photo uploads. All image-text matching occurs within the device's sandbox.

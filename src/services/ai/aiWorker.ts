import { pipeline, env } from '@huggingface/transformers';

// Configure environment for robust browser worker execution
env.allowLocalModels = false;
env.useBrowserCache = true;

// Default model: lightweight, highly compatible quantized CLIP/SigLIP
export const DEFAULT_MODEL_ID = 'Xenova/clip-vit-base-patch32';

let classifierInstance: any = null;
let currentLoadedModelId: string | null = null;
let isInitializing = false;

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'CHECK_CACHE_STATUS': {
      try {
        const cache = await caches.open('transformers-cache');
        const keys = await cache.keys();
        const hasModelCached = keys.some(req =>
          req.url.includes(payload?.modelId || DEFAULT_MODEL_ID)
        );
        self.postMessage({
          type: 'CACHE_STATUS_RESULT',
          isCached: hasModelCached,
          cachedItemCount: keys.length,
        });
      } catch (err: any) {
        self.postMessage({
          type: 'CACHE_STATUS_RESULT',
          isCached: false,
          error: err?.message || 'Cache check failed',
        });
      }
      break;
    }

    case 'LOAD_MODEL': {
      const modelId = payload?.modelId || DEFAULT_MODEL_ID;

      if (classifierInstance && currentLoadedModelId === modelId) {
        self.postMessage({
          type: 'MODEL_READY',
          modelId,
          cached: true,
        });
        return;
      }

      if (isInitializing) return;
      isInitializing = true;

      try {
        self.postMessage({
          type: 'MODEL_LOADING_START',
          modelId,
        });

        // Initialize zero-shot image classification pipeline with quantized weights
        classifierInstance = await pipeline('zero-shot-image-classification', modelId, {
          dtype: 'q8',
          progress_callback: (progress: any) => {
            if (progress.status === 'progress' && progress.total) {
              const percent = Math.round((progress.loaded / progress.total) * 100);
              self.postMessage({
                type: 'MODEL_DOWNLOAD_PROGRESS',
                file: progress.file,
                loaded: progress.loaded,
                total: progress.total,
                percent,
              });
            } else if (progress.status === 'done') {
              self.postMessage({
                type: 'MODEL_FILE_DONE',
                file: progress.file,
              });
            }
          },
        });

        currentLoadedModelId = modelId;
        isInitializing = false;

        self.postMessage({
          type: 'MODEL_READY',
          modelId,
          cached: false,
        });
      } catch (err: any) {
        isInitializing = false;
        self.postMessage({
          type: 'MODEL_ERROR',
          modelId,
          error: err?.message || 'Failed to initialize vision model',
        });
      }
      break;
    }

    case 'VERIFY_IMAGE': {
      const { image, targetLabels, distractorLabels } = payload;

      if (!classifierInstance) {
        self.postMessage({
          type: 'VERIFY_ERROR',
          error: 'Model is not initialized yet',
        });
        return;
      }

      try {
        const startTime = performance.now();
        const candidateLabels = [...targetLabels, ...distractorLabels];

        // Ensure image format is compatible (convert data URL to blob if needed)
        let imageInput = image;
        if (typeof image === 'string' && image.startsWith('data:')) {
          const res = await fetch(image);
          imageInput = await res.blob();
        }

        // Zero-shot evaluation using template
        const rawResults = await classifierInstance(imageInput, candidateLabels, {
          hypothesis_template: 'a photo of {}',
        });

        const inferenceTimeMs = Math.round(performance.now() - startTime);

        // Normalize raw output into clean array
        const normalizedScores = Array.isArray(rawResults)
          ? rawResults.map((r: any) => ({
              label: r.label,
              score: Number(r.score),
            }))
          : [];

        self.postMessage({
          type: 'VERIFY_RESULT',
          predictions: normalizedScores,
          inferenceTimeMs,
          targetLabels,
          distractorLabels,
        });
      } catch (err: any) {
        self.postMessage({
          type: 'VERIFY_ERROR',
          error: err?.message || 'Inference execution failed',
        });
      }
      break;
    }

    default:
      console.warn('Unknown worker message type:', type);
  }
};

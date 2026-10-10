import type {
  VerificationDiagnostic,
  ModelReadiness,
  Clue,
} from '../../types';
import { evaluateVerification } from './decisionEngine';

type ProgressCallback = (progress: ModelReadiness) => void;

class AIClient {
  private worker: Worker | null = null;
  private readiness: ModelReadiness = {
    status: 'not_downloaded',
    progressPercent: 0,
    modelId: 'Xenova/clip-vit-base-patch32',
  };
  private progressListeners: Set<ProgressCallback> = new Set();
  private pendingVerification: {
    resolve: (diag: VerificationDiagnostic) => void;
    reject: (err: any) => void;
    clue: Clue;
    startTime: number;
  } | null = null;

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    try {
      this.worker = new Worker(new URL('./aiWorker.ts', import.meta.url), {
        type: 'module',
      });

      this.worker.onmessage = (e: MessageEvent) => {
        console.log('[AIClient] Worker message received:', e.data.type, e.data);
        this.handleWorkerMessage(e.data);
      };

      this.worker.onerror = (err) => {
        console.error('AI Web Worker encountered an error:', err);
        this.updateReadiness({
          status: 'error',
          error: 'Web Worker failed to initialize. Browser may restrict worker execution.',
        });
      };

      // Check if model files are already cached in browser CacheStorage
      this.checkCacheStatus();
    } catch (err: any) {
      console.warn('Worker initialization fallback:', err);
    }
  }

  private handleWorkerMessage(data: any) {
    const { type } = data;

    switch (type) {
      case 'CACHE_STATUS_RESULT': {
        if (data.isCached) {
          this.updateReadiness({ status: 'ready', progressPercent: 100 });
        }
        break;
      }

      case 'MODEL_LOADING_START': {
        this.updateReadiness({ status: 'downloading', progressPercent: 5 });
        break;
      }

      case 'MODEL_DOWNLOAD_PROGRESS': {
        this.updateReadiness({
          status: 'downloading',
          progressPercent: data.percent || 20,
        });
        break;
      }

      case 'MODEL_READY': {
        this.updateReadiness({ status: 'ready', progressPercent: 100 });
        break;
      }

      case 'MODEL_ERROR': {
        this.updateReadiness({
          status: 'error',
          error: data.error || 'Failed to download or load model.',
        });
        if (this.pendingVerification) {
          this.pendingVerification.reject(new Error(data.error));
          this.pendingVerification = null;
        }
        break;
      }

      case 'VERIFY_RESULT': {
        if (this.pendingVerification) {
          const { predictions, inferenceTimeMs, targetLabels, distractorLabels } = data;
          const diagnostic = evaluateVerification({
            targetLabels,
            distractorLabels,
            rawPredictions: predictions,
            inferenceTimeMs,
          });
          this.pendingVerification.resolve(diagnostic);
          this.pendingVerification = null;
        }
        break;
      }

      case 'VERIFY_ERROR': {
        if (this.pendingVerification) {
          this.pendingVerification.reject(new Error(data.error));
          this.pendingVerification = null;
        }
        break;
      }
    }
  }

  public checkCacheStatus() {
    if (this.worker) {
      this.worker.postMessage({
        type: 'CHECK_CACHE_STATUS',
        payload: { modelId: this.readiness.modelId },
      });
    }
  }

  public preloadModel(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.readiness.status === 'ready') {
        resolve();
        return;
      }

      if (!this.worker) {
        this.initWorker();
      }

      const unsubscribe = this.onProgress((readiness) => {
        if (readiness.status === 'ready') {
          unsubscribe();
          resolve();
        } else if (readiness.status === 'error') {
          unsubscribe();
          reject(new Error(readiness.error));
        }
      });

      this.worker?.postMessage({
        type: 'LOAD_MODEL',
        payload: { modelId: this.readiness.modelId },
      });
    });
  }

  public async verifyProof(
    clue: Clue,
    imageDataUrl: string
  ): Promise<VerificationDiagnostic> {
    // Ensure model is loaded first
    if (this.readiness.status !== 'ready') {
      await this.preloadModel();
    }

    return new Promise((resolve, reject) => {
      this.pendingVerification = {
        resolve,
        reject,
        clue,
        startTime: performance.now(),
      };

      console.log('[AIClient] Posting VERIFY_IMAGE to worker. Clue:', clue.prompt);
      this.worker?.postMessage({
        type: 'VERIFY_IMAGE',
        payload: {
          image: imageDataUrl,
          targetLabels: clue.targetDescriptions,
          distractorLabels: clue.distractorDescriptions,
        },
      });
    });
  }

  public getReadiness(): ModelReadiness {
    return this.readiness;
  }

  public onProgress(cb: ProgressCallback): () => void {
    this.progressListeners.add(cb);
    cb(this.readiness);
    return () => this.progressListeners.delete(cb);
  }

  private updateReadiness(patch: Partial<ModelReadiness>) {
    this.readiness = { ...this.readiness, ...patch };
    for (const listener of this.progressListeners) {
      listener(this.readiness);
    }
  }
}

export const aiClient = new AIClient();

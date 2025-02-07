import { AxiosError } from 'axios';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface RetryOptions {
  maxRetries: number;
  delayMs: number;
  backoffFactor: number;
}

export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  options: RetryOptions
): Promise<T> => {
  try {
    return await requestFn();
  } catch (error: unknown) {
    if (error instanceof Error && 'response' in error && 
        (error as AxiosError).response?.status === 429 && options.maxRetries > 0) {
      await delay(options.delayMs);
      return retryRequest(requestFn, {
        maxRetries: options.maxRetries - 1,
        delayMs: options.delayMs * options.backoffFactor,
        backoffFactor: options.backoffFactor
      });
    }
    throw error;
  }
}; 
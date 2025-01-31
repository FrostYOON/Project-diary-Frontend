import { AxiosError } from 'axios';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  try {
    return await requestFn();
  } catch (error: unknown) {
    if (error instanceof Error && 'response' in error && 
        (error as AxiosError).response?.status === 429 && retries > 0) {
      await delay(delayMs);
      return retryRequest(requestFn, retries - 1, delayMs * 2);
    }
    throw error;
  }
} 
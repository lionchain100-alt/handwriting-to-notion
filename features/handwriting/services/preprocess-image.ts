import type { PreprocessProvider, PreprocessResult } from '@/features/handwriting/types/provider';

export class IdentityPreprocessProvider implements PreprocessProvider {
  async process(input: Buffer, mimeType: string): Promise<PreprocessResult> {
    return {
      buffer: input,
      mimeType
    };
  }
}

export async function preprocessImage(
  provider: PreprocessProvider,
  input: Buffer,
  mimeType: string
): Promise<PreprocessResult> {
  return provider.process(input, mimeType);
}

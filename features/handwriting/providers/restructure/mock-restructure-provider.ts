import type { OcrRawResult } from '@/features/handwriting/types/ocr-result';
import type { RestructureProvider } from '@/features/handwriting/types/provider';
import { RESULT_WARNING_CODE, type HandwritingResult } from '@/features/output/types/output-result';
import type { UploadScene } from '@/features/upload/types/upload-input';

function buildSceneTitle(scene?: UploadScene): string {
  if (!scene) {
    return 'Notes';
  }

  return scene
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export class MockRestructureProvider implements RestructureProvider {
  async transform(input: OcrRawResult, scene?: UploadScene): Promise<HandwritingResult> {
    const sceneTitle = buildSceneTitle(scene);
    const sourceText = input.text.trim() || 'Meeting notes about product direction and next actions.';

    return {
      plainText: sourceText,
      structuredNotes: `# ${sceneTitle}\n\n## Summary\n- ${sourceText}\n\n## Key Points\n- Product direction\n- MVP scope\n- Next actions`,
      todoList: '- [ ] Draft MVP\n- [ ] Review OCR pipeline\n- [ ] Prepare Notion export',
      warnings:
        input.text.trim().length === 0
          ? [
              {
                code: RESULT_WARNING_CODE.PARTIAL_RESULT,
                message: 'This is a mock structured result generated for development and demo purposes.'
              }
            ]
          : []
    };
  }
}

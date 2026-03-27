# handwriting-to-notion

Convert handwritten notes into Notion-ready content.

## What it does
- Upload a handwritten image
- Extract raw OCR text
- Generate three outputs:
  - Plain Text
  - Structured Notes
  - To-do List
- Copy the result into Notion-friendly formats

## Current status
This project is in MVP validation stage.

Current state:
- MVP main flow is closed
- Public test page is running
- MVP polish is mostly complete
- Real handwritten sample testing is the current focus

See also:
- `PROJECT_STATUS.md`
- `docs/backlog-mvp-closure.md`
- `docs/real-sample-test-plan.md`

## Tech stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Tesseract.js

## Local development
```bash
npm install
npm run dev
```

Then open:
- `http://localhost:3000`

## MVP flow
```text
Upload image
→ OCR parse
→ Format structured result
→ Review outputs
→ Copy into Notion
```

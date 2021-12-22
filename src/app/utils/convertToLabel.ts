import { toPascalCase } from "./toPascalCase";

export function convertToLabel(text: string) {
  if (!text)
    return;
  text = toPascalCase(text.replace(/[^a-zA-Z0-9.]/g, ' '));
  return text;
}

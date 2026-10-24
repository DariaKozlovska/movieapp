// No 0/O, 1/I/L, so the code is easy to read and type by hand
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export const CODE_LENGTH = 6;

const CODE_PATTERN = new RegExp(`^[${ALPHABET}]{${CODE_LENGTH}}$`);

export function generateCode(length: number = CODE_LENGTH): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

/** Trims and uppercases what was typed or scanned. */
export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase();
}

/** True only for strings that look like a code made by generateCode. */
export function isValidCode(raw: string): boolean {
  return CODE_PATTERN.test(normalizeCode(raw));
}
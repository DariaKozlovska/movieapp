// No 0/O, 1/I/L, so the code is easy to read and type by hand
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export const CODE_LENGTH = 6;

export function generateCode(length: number = CODE_LENGTH): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}
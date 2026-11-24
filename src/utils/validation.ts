/** Shared payment validators used by the checkout page and the quick-checkout dialog. */

/** Luhn checksum – rejects mistyped card numbers. */
export function luhnValid(num: string): boolean {
  const digits = num.replace(/\D/g, '');
  if (digits.length < 12) return false;
  let sum = 0;
  let dbl = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

/** Amex numbers are 15 digits, everything else 16. */
export function expectedCardLength(num: string): number {
  return /^3[47]/.test(num.replace(/\D/g, '')) ? 15 : 16;
}

export function cvvLength(num: string): number {
  return /^3[47]/.test(num.replace(/\D/g, '')) ? 4 : 3;
}

/** MM/YY – month 01-12 and not in the past (valid through the last day of the expiry month). */
export function expiryValid(expiry: string, now: Date = new Date()): boolean {
  const m = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  const curYear = now.getFullYear();
  const curMonth = now.getMonth() + 1;
  return year > curYear || (year === curYear && month >= curMonth);
}

export interface CardInput { number: string; name: string; expiry: string; cvv: string }
export interface CardErrors { number?: string; name?: string; expiry?: string; cvv?: string }

export function validateCard(card: CardInput, now: Date = new Date()): CardErrors {
  const err: CardErrors = {};
  const digits = card.number.replace(/\D/g, '');
  const len = expectedCardLength(digits);
  if (digits.length !== len) err.number = `Enter a ${len}-digit card number`;
  else if (!luhnValid(digits)) err.number = 'Card number is invalid';
  if (!card.name.trim()) err.name = 'Cardholder name required';
  if (!/^\d{2}\/\d{2}$/.test(card.expiry)) err.expiry = 'MM/YY required';
  else if (!expiryValid(card.expiry, now)) err.expiry = 'Card has expired or date is invalid';
  const cl = cvvLength(digits);
  if (card.cvv.length !== cl) err.cvv = `${cl}-digit CVV required`;
  return err;
}

export const UPI_REGEX = /^[\w.-]+@[A-Za-z][\w]*$/;
export const upiValid = (v: string) => UPI_REGEX.test(v.trim());

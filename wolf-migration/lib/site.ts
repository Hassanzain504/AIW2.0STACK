// Central place for real, verified contact details.
// WhatsApp is the destination for the "free mockup" lead form.
export const SITE = {
  email: 'hello@wolfcontractor.com',
  // Business WhatsApp (E.164 without the + for wa.me links).
  whatsappNumber: '12135754650',
} as const;

// Build a wa.me deep link with a pre-filled message.
export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

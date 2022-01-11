// santize phone number to 9 digits.
// Make values as errorneous

export function SanitizeNumber(phone: any): string {
  if (!phone) {
    return '';
  }
  phone = phone.trim().replace(/[^\d]/g, '');
  return phone.startsWith('0') ? phone.substr(1) : phone.startsWith('256') ? phone.substr(3) : phone;
}

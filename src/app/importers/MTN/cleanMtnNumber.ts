export function cleanMtnNumber(str: string): string {
  return str.replace('/MSISDN', '').replace('FRI:', '').replace('/MM', '');
}

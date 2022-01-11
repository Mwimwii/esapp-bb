export function mapJotFormLanguage(languages: any): string[] {
  if (!languages) {
    return ['en'];
  }

  const result: string[] = [];

  languages.split('\r\n').forEach((language: any) => {
    switch (language) {
      case 'Luganda':
        result.push('lu');
        break;
      default:
        result.push('en');
        break;
    }
  });
  return result;
}

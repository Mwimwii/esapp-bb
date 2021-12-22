
export function toPascalCase(text: string) {
  if (text && text != '') {
    text = text.trim().toLowerCase();
    let words = text.split(' ') || [];
    let out = '';
    if (words.length > 0) {
      words.forEach(word => {
        out += word[0].toUpperCase() + word.substr(1) + ' ';
      });
    }
    text = out;
  }
  return text.trim();
}

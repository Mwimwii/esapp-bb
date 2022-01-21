export function replaceNonAlphaNumerics(text: string) {
    return text.replace(/[^a-zA-Z0-9_]/g, '_');
}

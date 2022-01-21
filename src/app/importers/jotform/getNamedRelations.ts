export function getNamedRelations(answer: any): string[] {
    if (!answer) {
        return [];
    }
    return answer.split('\n');
}

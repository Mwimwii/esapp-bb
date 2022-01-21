export function mapGender(recordParam: any): string {
    return !recordParam ? 'O' : (recordParam == 'male' ? 'M' : 'F');
}

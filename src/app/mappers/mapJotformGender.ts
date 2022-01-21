export function mapJotformGender(gender: any): string {
    if (gender) {
        if (gender === 'Female') {
            return 'F';
        } else {
            return 'M';
        }
    }
    return 'O';
}

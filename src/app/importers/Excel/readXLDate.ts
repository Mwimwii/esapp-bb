export function readXLDate(row: any): Date {
    if (row['Date Paid ']) {
        const datesplit = row['Date Paid '].split('.');
        return new Date(20 + datesplit[2], datesplit[1], datesplit[0]);
    }
}

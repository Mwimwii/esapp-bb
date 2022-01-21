export function readJotFormDate(record: any, question: number): Date {
  if (!record.answers[`${question}`].answer) {
    return new Date();
  }
  return new Date(record.answers[`${question}`].answer['year'], record.answers[`${question}`].answer['month'], record.answers[`${question}`].answer['day']);
}

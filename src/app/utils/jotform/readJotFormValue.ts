export function readJotFormValue(record: any, question: number, field?: any): any {

  if (!record) {
    return null;
  }

  if (!record.answers[`${question}`]) {
    return null;
  }

  if (!record.answers[`${question}`].answer) {
    return null;
  }

  if (field) {
    if (typeof (field) === 'string') {
      if (typeof (record.answers[`${question}`].answer[`${field}`]) == 'string') {
        return (record.answers[`${question}`].answer[`${field}`]).trim();
      }

      return record.answers[`${question}`].answer[`${field}`];
    }

    if (typeof (record.answers[`${question}`].answer[`field_${field}`]) == 'string') {
      return (record.answers[`${question}`].answer[`field_${field}`]).trim();
    }
    return record.answers[`${question}`].answer[`field_${field}`];
  }

  return record.answers[`${question}`].answer;
}

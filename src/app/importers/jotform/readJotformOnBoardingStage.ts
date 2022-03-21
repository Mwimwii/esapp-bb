

export function readJotformOnBoardingStage(record: any): string | undefined {
  const answers = Object.values(record.answers);
  const staging: any = answers.find(({ name }: any) => {
    return name === 'tenantonboardingstage';
  });

  if (staging) {
    console.log(staging?.answer);
    const lookup = JSON.parse(staging['options_array']);
    return lookup[staging?.answer.replace(/[{}]/gm, '')].value;
  }

  return;
}

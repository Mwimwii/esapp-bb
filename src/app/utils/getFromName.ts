import { capitalize } from './capitalize';

export function getFromName(fname: string, postion: number) {
  if (!fname) {
    return null;
  }

  const splitName = fname.split(' ');

  switch (postion) {
    case -1:
      return splitName[splitName.length - 1];
    default:
      if (splitName.length > 2) {
        const firstArr = [];

        for (let index = 0; index < splitName.length - 1; index++) {
          firstArr.push(capitalize(splitName[index]));
        }

        return firstArr.join(' ');
      } else {
        return capitalize(splitName[0]);
      }
  }
}

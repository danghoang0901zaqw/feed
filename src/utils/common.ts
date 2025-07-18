export const convertNumberEnumToArr = (enumObj: { [key: string]: string | number }): number[] => {
  return Object.values(enumObj).filter((value) => typeof value === 'number') as number[];
};


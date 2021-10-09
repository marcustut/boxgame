export const getRandomInt = (min: number, max: number) => {
  const minInt = Math.ceil(min)
  const maxInt = Math.floor(max)
  return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt
}

export const getRandomInts = ({ min, max }: { min: number; max: number }, length: number): number[] =>
  Array.from(Array(length).keys()).map(() => getRandomInt(min, max))

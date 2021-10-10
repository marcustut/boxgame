export const getRandomInt = (min: number, max: number) => {
  const minInt = Math.ceil(min)
  const maxInt = Math.floor(max)
  return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt
}

export const getRandomInts = (
  { min, max }: { min: number; max: number },
  length: number,
  options?: { nonRepeat: boolean }
): number[] => {
  if (options?.nonRepeat) {
    let temp: number

    return Array.from(Array(length).keys()).map((_, i) => {
      let randInt = getRandomInt(min, max)

      if (i === 0) {
        temp = randInt
        return randInt
      }

      while (temp === randInt) randInt = getRandomInt(min, max)

      temp = randInt
      return randInt
    })
  } else {
    return Array.from(Array(length).keys()).map(() => getRandomInt(min, max))
  }
}

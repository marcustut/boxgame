export const sleep = async (duration: number = 2000) => await new Promise(r => setTimeout(r, duration))

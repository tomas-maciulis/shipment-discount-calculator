const getNumberPrecision = (x: number) => {
  return Number.isInteger(x)
    ? 0
    : x.toString().split('.')[1].length
}

export default getNumberPrecision
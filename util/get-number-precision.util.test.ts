import getNumberPrecision from './get-number-precision.util'

describe('getNumberPrecision', () => {
  it.each`
    input       | result
    ${0}        | ${0}
    ${1}        | ${0}
    ${0.1}      | ${1}
    ${-1.1}     | ${1}
    ${-100.123} | ${3}
    ${0.000001} | ${6}
  `('Should return $result when $input is provided', ({input, result}) => {
    expect(getNumberPrecision(input)).toBe(result)
  })
})
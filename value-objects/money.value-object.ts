import getNumberPrecision from '../utils/get-number-precision.util'

const PRECISION = 2

export default class Money {
  private readonly _amountInCents: number

  private constructor(amountInCents: number) {
    if (!Number.isInteger(amountInCents)) {
      throw new Error('amountInCents must be an integer')
    }

    this._amountInCents = amountInCents
  }

  get amount() {
    return this._amountInCents / 10 ** PRECISION
  }

  get amountInCents() {
    return this._amountInCents
  }

  static create(amount: number) {
    const precision = getNumberPrecision(amount)

    if (precision > PRECISION) {
      throw new Error(`amount must not have more than ${PRECISION} floating point digits`)
    }

    return new Money(amount * 10 ** PRECISION)
  }

  static createFromCents(amountInCents: number) {
    return new Money(amountInCents)
  }

  static add(...args: Money[]) {
    if (args.length < 2) {
      throw new Error('at least two values must be provided to perform addition')
    }

    let result = args[0]

    for (let i = 1; i < args.length; i++) {
      result = Money.createFromCents(result.amountInCents + args[i].amountInCents)
    }

    return result
  }
}
import getNumberPrecision from '../utils/get-number-precision.util'

const PRECISION = 2

export default class Money {
  // todo: refactor all _x to private javascript props
  private readonly _amountInCents: number

  private constructor(amountInCents: number) {
    if (!Number.isInteger(amountInCents)) {
      throw new Error('amountInCents must be an integer')
    }

    if (amountInCents < 0) {
      throw new Error('amountInCents must be more than 0')
    }

    this._amountInCents = amountInCents
  }

  get amount() {
    return this._amountInCents / 10 ** PRECISION
  }

  get amountString() {
    return this.amount.toFixed(PRECISION)
  }

  get amountInCents() {
    return this._amountInCents
  }

  static create(amount: number) {
    const precision = getNumberPrecision(amount)

    if (precision > PRECISION) {
      throw new Error(`amount must not have more than ${PRECISION} floating point digits`)
    }

    return new Money(Math.round(amount * 10 ** PRECISION))
  }

  static createFromCents(amountInCents: number) {
    return new Money(amountInCents)
  }

  copy() {
    return Money.createFromCents(this._amountInCents)
  }

  add(m: Money) {
    return Money.createFromCents(this._amountInCents + m.amountInCents)
  }

  subtract(m: Money) {
    if (this.lessThan(m)) {
      throw new Error('cannot subtract more money than there currently is')
    }

    return Money.createFromCents(this._amountInCents - m.amountInCents)
  }

  greaterThan(m: Money) {
    return this._amountInCents > m.amountInCents
  }

  lessThan(m: Money) {
    return this._amountInCents < m.amountInCents
  }

  moreOrEqualTo(m: Money) {
    return this._amountInCents >= m.amountInCents
  }

  lessOrEqualTo(m: Money) {
    return this._amountInCents <= m.amountInCents
  }

  equalTo(m: Money) {
    return this._amountInCents === m.amountInCents
  }
}
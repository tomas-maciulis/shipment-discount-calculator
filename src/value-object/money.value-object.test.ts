import Money from './money.value-object'

describe('Money', () => {
  describe('amountString', () => {
    it.each`
      input    | expectedOutput
      ${1}     | ${'1.00'}
      ${0.01}  | ${'0.01'}
      ${111.1} | ${'111.10'}
    `('should be formatted correctly', ({input, expectedOutput}) => {
      expect(Money.create(input).amountString).toEqual(expectedOutput)
    })
  })

  describe('Money.create()', () => {
    it.each`
      input         | expectedAmountInCents
      ${0}          | ${0}
      ${-0}         | ${0}
      ${0.1}        | ${10}
      ${0.7}        | ${70}
      ${1}          | ${100}
      ${1.10}       | ${110}
      ${10.00}      | ${1000}
      ${1252312.01} | ${125231201}
    `('should create when provided with $input correctly', ({input, expectedAmountInCents}) => {
      const mockMoney = Money.create(input)

      expect(mockMoney).toBeInstanceOf(Money)
      expect(mockMoney.amountInCents).toEqual(expectedAmountInCents)
    })

    it.each`
      input
      ${-0.1}
      ${-0.01}
      ${-10}
    `('should throw when provided with negative value $input', ({input}) => {
      expect(() => Money.create(input)).toThrow('amountInCents must be more than 0')
    })

    it.each`
      input
      ${0.001}
      ${123.12345}
    `('should throw when provided with a $input whose precision >2', ({input}) => {
      expect(() => Money.create(input)).toThrow('amount must not have more than 2 floating point digits')
    })
  })

  describe('Money.createFromCents()', () => {
    it.each`
      input | expectedAmount
      ${0}  | ${0}
      ${-0}  | ${0}
      ${1}  | ${0.01}
      ${123} | ${1.23}
      ${111111} ${1111.11}
    `('should create when provided with $input correctly', ({input, expectedAmount}) => {
      const mockMoney = Money.createFromCents(input)

      expect(mockMoney).toBeInstanceOf(Money)
      expect(mockMoney.amountInCents).toEqual(Math.abs(input))
      expect(mockMoney.amount).toEqual(expectedAmount)
    })

    it.each`
      input
      ${-1}
      ${-12345}
    `('should throw when provided with negative value $input', ({input}) => {
      expect(() => Money.createFromCents(input)).toThrow('amountInCents must be more than 0')
    })

    it.each`
      input
      ${0.1}
      ${1.01}
      ${-0.01}
    `('should throw when creating provided with not an integer value $input', ({input}) => {
      expect(() => Money.createFromCents(input)).toThrow('amountInCents must be an integer')
    })
  })

  describe('copy()', () => {
    it('should return a copy of given Money object', () => {
      const mockMoney = Money.create(123)
      const mockMoneyCopy = mockMoney.copy()

      expect(mockMoney).toEqual(mockMoneyCopy)
    })
  })

  describe('add()', () => {
    it.each`
      startingAmount | amountToAdd | expectedResult
      ${0}           | ${0}        | ${0}
      ${0.01}        | ${0.02}     | ${0.03}
      ${0.7}         | ${0.2}      | ${0.9}
      ${1}           | ${1}        | ${2}
      ${10}          | ${0.01}     | ${10.01}
    `(
      'should add $amountToAdd to $startingAmount and result in $expectedResult',
      ({startingAmount, amountToAdd, expectedResult}) => {
        const startingMoneyMock = Money.create(startingAmount)
        const moneyToAddMock = Money.create(amountToAdd)

        expect(startingMoneyMock.add(moneyToAddMock).amount).toBe(expectedResult)
      })

    it('should be idempotent', () => {
      const mockInitialMoney = Money.create(1)
      const mockMoneyToAdd = Money.create(2)

      expect(mockInitialMoney.add(mockMoneyToAdd).amount).toEqual(3)
      expect(mockInitialMoney.add(mockMoneyToAdd).amount).toEqual(3)
    })
  })

  describe('subtract()', () => {
    it.each`
      startingAmount | amountToSubtract | expectedResult
      ${0}           | ${0}             | ${0}
      ${0.02}        | ${0.01}          | ${0.01}
      ${0.7}         | ${0.2}           | ${0.5}
      ${1}           | ${1}             | ${0}
      ${10}          | ${0.01}          | ${9.99}
    `(
      'should subtract $amountToSubtract from $startingAmount and result in $expectedResult',
      ({startingAmount, amountToSubtract, expectedResult}) => {
        const startingMoneyMock = Money.create(startingAmount)
        const moneyToSubtractMock = Money.create(amountToSubtract)

        expect(startingMoneyMock.subtract(moneyToSubtractMock).amount).toBe(expectedResult)
      })

    it.each`
      startingAmount | amountToSubtract
      ${0.01}        | ${0.02}
      ${1}           | ${2}
      ${10}          | ${10.01}
    `(
      'should throw when trying to subtract greater amount from lesser ($startingAmount - $amountToSubtract)',
      ({startingAmount, amountToSubtract}) => {
        const startingMoneyMock = Money.create(startingAmount)
        const moneyToSubtractMock = Money.create(amountToSubtract)

        expect(() => startingMoneyMock.subtract(moneyToSubtractMock)).toThrow('cannot subtract more money than there currently is')
      }
    )

    it('should be idempotent', () => {
      const mockInitialMoney = Money.create(2)
      const mockMoneyToAdd = Money.create(1)

      expect(mockInitialMoney.subtract(mockMoneyToAdd).amount).toEqual(1)
      expect(mockInitialMoney.subtract(mockMoneyToAdd).amount).toEqual(1)
    })
  })

  describe('greaterThan()', () => {
    it.each`
    amount1 | amount2 | expectedResult
    ${0.02} | ${0.01} | ${true}
    ${0.01} | ${0.02} | ${false}
    ${0}    | ${0}    | ${false}
     `(
      'should determine that $amount1 greater than $amount2 is $expectedResult',
      ({amount1, amount2, expectedResult}) => {
        expect(Money.create(amount1).greaterThan(Money.create(amount2))).toBe(expectedResult)
      })
  })

  describe('lessThan()', () => {
    it.each`
    amount1 | amount2 | expectedResult
    ${0.02} | ${0.01} | ${false}
    ${0.01} | ${0.02} | ${true}
    ${0}    | ${0}    | ${false}
     `(
      'should determine that $amount1 less than $amount2 is $expectedResult',
      ({amount1, amount2, expectedResult}) => {
        expect(Money.create(amount1).lessThan(Money.create(amount2))).toBe(expectedResult)
      })
  })

  describe('moreOrEqualTo()', () => {
    it.each`
    amount1 | amount2 | expectedResult
    ${0.02} | ${0.01} | ${true}
    ${0.01} | ${0.02} | ${false}
    ${0}    | ${0}    | ${true}
     `(
      'should determine that $amount1 more or equal to $amount2 is $expectedResult',
      ({amount1, amount2, expectedResult}) => {
        expect(Money.create(amount1).moreOrEqualTo(Money.create(amount2))).toBe(expectedResult)
      })
  })

  describe('lessOrEqualTo()', () => {
    it.each`
    amount1 | amount2 | expectedResult
    ${0.02} | ${0.01} | ${false}
    ${0.01} | ${0.02} | ${true}
    ${0}    | ${0}    | ${true}
     `(
      'should determine that $amount1 less or equal to $amount2 is $expectedResult',
      ({amount1, amount2, expectedResult}) => {
        expect(Money.create(amount1).lessOrEqualTo(Money.create(amount2))).toBe(expectedResult)
      })
  })

  describe('equalTo()', () => {
    it.each`
    amount1 | amount2 | expectedResult
    ${0.02} | ${0.01} | ${false}
    ${0.01} | ${0.01} | ${true}
    ${0}    | ${0}    | ${true}
     `(
      'should determine that $amount1 equal to $amount2 is $expectedResult',
      ({amount1, amount2, expectedResult}) => {
        expect(Money.create(amount1).equalTo(Money.create(amount2))).toBe(expectedResult)
      })
  })
})
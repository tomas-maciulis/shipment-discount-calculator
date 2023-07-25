import ServiceClient from '../../entity/service-client.entity'
import Money from '../../value-object/money.value-object'
import DiscountsCannotExceedTenEurosAMonth from './discounts-cannot-exceed-ten-euros-a-month'

const mockServiceClient = new ServiceClient()

// @ts-expect-error
mockServiceClient['_deliveryOrders'] = [
  {
    id: 0,
    isValid: true,
    date: new Date('2015-02-01'),
    discount: Money.create(5)
  },
  {
    id: 1,
    isValid: true,
    date: new Date('2016-02-01'),
    discount: Money.create(5)
  }
]

const discountsCannotExceedTenEurosAMonth = new DiscountsCannotExceedTenEurosAMonth()

describe('DiscountsCannotExceedTenEurosAMonth', () => {
  describe('validate()', () => {
    it('should not allow more than 10 euros of discounts a month', () => {
      const mockDeliveryOrder = {
        id: 2,
        date: new Date('2015-02-05'),
      }

      const result = discountsCannotExceedTenEurosAMonth.validate(
        mockServiceClient as any,
        mockDeliveryOrder as any,
        Money.create(5.01),
      )

      expect(result).toEqual(Money.create(5))
    })
  })
})
import ServiceClient from '../../entity/service-client.entity'
import Money from '../../value-object/money.value-object'
import DiscountsCannotExceedTenEurosAMonthDiscountValidationRule
  from './discounts-cannot-exceed-ten-euros-a-month.discount-validation-rule'

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

const discountsCannotExceedTenEurosAMonth = new DiscountsCannotExceedTenEurosAMonthDiscountValidationRule()

describe('DiscountsCannotExceedTenEurosAMonthDiscountValidationRule', () => {
  describe('validate()', () => {
    it('should not allow more than 10 euros of discounts a month', () => {
      const mockDeliveryOrder = {
        id: 2,
        date: new Date('2015-02-05'),
      }

      const result = discountsCannotExceedTenEurosAMonth.validate({
          serviceClient: mockServiceClient as any,
          deliveryOrder: mockDeliveryOrder as any,
          discount: Money.create(5.01),
        }
      )

      expect(result).toEqual(Money.create(5))
    })
  })
})
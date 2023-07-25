import DiscountManager from './discount-manager'
import Money from '../value-object/money.value-object'

const mockDiscount = Money.create(1)

const mockDiscountManager = new DiscountManager()

const mockDiscountRule = {calculateDiscount: jest.fn(() => mockDiscount)}

const mockValidationRule = {validate: jest.fn(() => mockDiscount)}

const mockValidDeliveryOrder = jest.fn()

// @ts-expect-error
mockDiscountManager['_discountRules'] = [mockDiscountRule]
mockDiscountManager['_discountValidationRules'] = [mockValidationRule]

const mockServiceClient = {
  validDeliveryOrders: [mockValidDeliveryOrder]
}

describe('DiscountManager', () => {
  describe('applyRules()', () => {
    it('should apply the registered rules and validate them', () => {
      const spyApplyRule = jest.spyOn(mockDiscountRule, 'calculateDiscount')
      const spyValidateDiscount = jest.spyOn(mockValidationRule, 'validate')

      mockDiscountManager.applyDiscounts(mockServiceClient as any)

      expect(spyApplyRule).toBeCalledTimes(1)
      expect(spyValidateDiscount).toBeCalledTimes(1)

      expect(spyApplyRule).toBeCalledWith(mockServiceClient, mockValidDeliveryOrder)

      expect(spyValidateDiscount).toBeCalledWith(mockServiceClient, mockValidDeliveryOrder, mockDiscount)
    })
  })
})
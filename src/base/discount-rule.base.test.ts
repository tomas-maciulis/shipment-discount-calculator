import DiscountRuleBase from './discount-rule.base'

class MockDiscountRule extends DiscountRuleBase {
  constructor() {
    super()
  }

  protected _applicableParcelTypes = ['mock parcel type'] as any
  protected _applicableProviders = ['mock delivery service provider'] as any

  protected applyRule = jest.fn()
}

const mockDiscountRule = new MockDiscountRule()

describe('DiscountRuleBase', () => {
  describe('calculateDiscount', () => {
    const mockuser = {}

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should call the rule if it meets the specifications', () => {

      const mockDeliveryOrder = {
        size: 'mock parcel type',
        provider: {
          name: 'mock delivery service provider'
        }
      }

      const spy = jest.spyOn(mockDiscountRule as any, 'applyRule')

      mockDiscountRule.calculateDiscount({
        user: mockuser as any,
        deliveryOrder: mockDeliveryOrder as any,
      })

      expect(spy).toBeCalledTimes(1)

      expect(spy).toBeCalledWith(
        {
          user: mockuser,
          deliveryOrder: mockDeliveryOrder,
        })
    })

    it('should not all the rule if it does not meet the specifications', () => {
      const mockDeliveryOrder = {
        size: 'invalid',
        provider: {
          name: 'invalid'
        }
      }

      const spy = jest.spyOn(mockDiscountRule as any, 'applyRule')

      mockDiscountRule.calculateDiscount({
        user: mockuser as any,
        deliveryOrder: mockDeliveryOrder as any,
      })

      expect(spy).not.toBeCalled()
    })
  })
})
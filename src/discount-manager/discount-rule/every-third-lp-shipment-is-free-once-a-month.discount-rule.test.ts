import EveryThirdLpShipmentIsFreeOnceAMonthDiscountRule
  from './every-third-lp-shipment-is-free-once-a-month.discount-rule'
import DeliveryServiceProvider from '../../enum/delivery-service-provider.enum'
import ParcelType from '../../enum/parcel-type.enum'
import Money from '../../value-object/money.value-object'
import ServiceClient from '../../entity/service-client.entity'

const mockServicePrice = Money.create(5)

const mockLaPoste = {
  name: DeliveryServiceProvider.LP,
  getServiceOrThrow: jest.fn(() => ({
    parcelType: ParcelType.L,
    price: mockServicePrice
  }))
}

const mockDeliveryOrderBase = {
  price: mockServicePrice,
  size: ParcelType.L,
  provider: mockLaPoste,
  isValid: true,
  discount: Money.create(0)
}

const mockDeliveryOrder1 = {
  ...mockDeliveryOrderBase,
  id: 0,
  date: new Date('2015-02-01'),
}

const mockDeliveryOrder2 = {
  ...mockDeliveryOrderBase,
  id: 1,
  date: new Date('2015-02-15'),
}

const mockDeliveryOrder3 = {
  ...mockDeliveryOrderBase,
  id: 2,
  date: new Date('2015-02-25'),
}

const mockDeliveryOrder4 = {
  ...mockDeliveryOrderBase,
  id: 3,
  date: new Date('2015-02-26'),
}

const mockServiceClient = new ServiceClient()
// @ts-expect-error
mockServiceClient['_deliveryOrders'] = [
  mockDeliveryOrder1,
  mockDeliveryOrder2,
  mockDeliveryOrder3,
  mockDeliveryOrder4,
]

const mockEveryThirdLpShipmentIsFreeOnceAMonth = new EveryThirdLpShipmentIsFreeOnceAMonthDiscountRule()

mockEveryThirdLpShipmentIsFreeOnceAMonth['_deliveryServiceProviderManager'] = ({
  // @ts-expect-error
  deliveryServiceProviders: [mockLaPoste]
})

describe('EveryThirdLpShipmentIsFreeOnceAMonthDiscountRule', () => {
  describe('calculateDiscount()', () => {
    it('should apply discount on the third order', () => {
      const result = mockEveryThirdLpShipmentIsFreeOnceAMonth
        .calculateDiscount({
          deliveryOrder: mockDeliveryOrder3 as any,
          serviceClient: mockServiceClient as any,
        })
      expect(result).toEqual(mockServicePrice)
    })

    it('should not apply discount on first or second orders', () => {
      const firstOrderResult = mockEveryThirdLpShipmentIsFreeOnceAMonth
        .calculateDiscount({
          deliveryOrder: mockDeliveryOrder1 as any,
          serviceClient: mockServiceClient as any,
        })

      const secondOrderResult = mockEveryThirdLpShipmentIsFreeOnceAMonth
        .calculateDiscount({
          deliveryOrder: mockDeliveryOrder2 as any,
          serviceClient: mockServiceClient as any,
        })

      expect(firstOrderResult).toEqual(Money.create(0))
      expect(secondOrderResult).toEqual(Money.create(0))
    })

    it('should not apply discount on fourth order', () => {
      const result = mockEveryThirdLpShipmentIsFreeOnceAMonth
        .calculateDiscount({
          deliveryOrder: mockDeliveryOrder4 as any,
          serviceClient: mockServiceClient as any,
        })

      expect(result).toEqual(Money.create(0))
    })
  })
})
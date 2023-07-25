import LowestSmallPackagePrice from './lowest-small-package-price'
import Money from '../../value-object/money.value-object'
import ParcelType from '../../enum/parcel-type.enum'

const mockDeliveryProviderName1 = 'mock delivery provider 1'
const mockDeliveryProviderName2 = 'mock delivery provider 2'

const mockLowestSmallDeliveryPrice = Money.create(1)
const mockHighestSmallDeliveryPrice = Money.create(2)

const mockDeliveryProvider1 = {
  name: mockDeliveryProviderName1,
  getServiceOrThrow: jest.fn(() => ({
    parcelType: ParcelType.S,
    price: mockHighestSmallDeliveryPrice
  }))
}
const mockDeliveryProvider2 = {
  name: mockDeliveryProviderName2,
  getServiceOrThrow: jest.fn(() => ({
    parcelType: ParcelType.S,
    price: mockLowestSmallDeliveryPrice
  }))
}

const mockLowestSmallPackagePriceRule = new LowestSmallPackagePrice()

// @ts-expect-error
mockLowestSmallPackagePriceRule['_applicableProviders'] = [mockDeliveryProviderName1, mockDeliveryProviderName2]

mockLowestSmallPackagePriceRule['_deliveryServiceProviderManager'] = {
  // @ts-expect-error
  deliveryServiceProviders: [mockDeliveryProvider1, mockDeliveryProvider2]
}

describe('LowestSmallPackagePrice', () => {
  describe('calculateDiscount()', () => {
    it('should pick the lowest small package price from all the delivery service providers', () => {
      const mockDeliveryOrder = {
        price: mockHighestSmallDeliveryPrice,
        size: ParcelType.S,
        provider: mockDeliveryProvider1
      }

      const result = mockLowestSmallPackagePriceRule.calculateDiscount({} as any, mockDeliveryOrder as any)

      expect(result).toEqual(mockHighestSmallDeliveryPrice.subtract(mockLowestSmallDeliveryPrice))
    })
  })
})
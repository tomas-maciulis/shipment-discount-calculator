import DeliveryServiceProviderBase from './delivery-service-provider.base'
import Money from '../value-object/money.value-object'

class MockDeliveryServiceProvider extends DeliveryServiceProviderBase {
  constructor() {
    super()

    this.registerService('mock' as any, Money.create(1))
  }

  protected _name = 'mock delivery service' as any
}

const mockDeliveryServiceProvider = new MockDeliveryServiceProvider()

describe('DeliveryServiceProviderBase', () => {
  describe('getServiceOrThrow()', () => {
    it('should get a registered service', () => {
      const mockDeliveryService = mockDeliveryServiceProvider['_services'][0]

      const result = mockDeliveryServiceProvider.getServiceOrThrow(
        mockDeliveryService.parcelType
      )

      expect(result).toEqual(mockDeliveryService)
    })

    it('should throw if a service is not found', () => {
      const mockInvalidService = 'invalid'

      expect(
        () => mockDeliveryServiceProvider.getServiceOrThrow(mockInvalidService as any)
      ).toThrow(`${mockDeliveryServiceProvider.name} does not have service called "${mockInvalidService}"`)
    })
  })
})
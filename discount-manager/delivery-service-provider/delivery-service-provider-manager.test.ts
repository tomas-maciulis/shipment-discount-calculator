import DeliveryServiceProviderManager from './delivery-service-provider-manager'

jest.mock('../../enum/delivery-service-provider.enum', () => (
  {
    m1: 'mock1',
    m2: 'mock2',
  }
))

const mockDeliveryServiceProviderManager = new DeliveryServiceProviderManager()


const mockService1Id = 'm1'

const mockService1Name = 'mock1'
const mockService2Name = 'mock2'

const mockServiceProvider1 = {name: mockService1Name}
const mockServiceProvider2 = {name: mockService2Name}

// @ts-expect-error
mockDeliveryServiceProviderManager['_deliveryServiceProviders'] = [mockServiceProvider1, mockServiceProvider2]

describe('DeliveryServiceProviderManager', () => {
  describe('getProviderByNameOrThrow()', () => {
    it('should return a delivery service provider by name', () => {
      expect(mockDeliveryServiceProviderManager.getProviderByNameOrThrow(mockService2Name as any)).toMatchObject(mockServiceProvider2)
    })

    it('should throw if delivery service with given name was not found', () => {
      const mockInvalidName = 'invalid name'

      expect(() => mockDeliveryServiceProviderManager.getProviderByNameOrThrow(mockInvalidName as any))
        .toThrow(`provider with name ${mockInvalidName} is not registered`)
    })
  })

  describe('getProviderByIdOrThrow', () => {
    it('should return a delivery service by id', () => {
      const spy = jest.spyOn(mockDeliveryServiceProviderManager, 'getProviderByNameOrThrow')

      mockDeliveryServiceProviderManager.getProviderByIdOrThrow(mockService1Id as any)

      expect(spy).toBeCalledWith(mockService1Name)
    })
  })
})

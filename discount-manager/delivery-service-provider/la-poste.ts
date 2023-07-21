import DeliveryService from '../../value-objects/delivery-service.value-object'
import Money from '../../value-objects/money.value-object'
import ParcelType from '../../enums/parcel-type.enum'
import DeliverServiceProvider from '../../enums/delivery-service-provider.enum'
import DeliveryServiceProviderBase from '../../base/delivery-service-provider.base'

export default class LaPoste extends DeliveryServiceProviderBase {
  protected _services: DeliveryService[]

  constructor() {
    super()

    this.registerService(ParcelType.S, Money.create(1.50))
    this.registerService(ParcelType.M, Money.create(4.90))
    this.registerService(ParcelType.L, Money.create(6.90))
  }

  get name(): DeliverServiceProvider {
    return DeliverServiceProvider.LP
  }
}
import DeliveryServiceProviderBase from '../../base/delivery-service-provider.base'
import DeliverServiceProvider from '../../enums/delivery-service-provider.enum'
import ParcelType from '../../enums/parcel-type.enum'
import Money from '../../value-objects/money.value-object'

export default class MondialRelay extends DeliveryServiceProviderBase {
  constructor() {
    super()

    this.registerService(ParcelType.S, Money.create(2))
    this.registerService(ParcelType.M, Money.create(3))
    this.registerService(ParcelType.L, Money.create(4))
  }

  get name(): DeliverServiceProvider {
    return DeliverServiceProvider.MR
  }
}
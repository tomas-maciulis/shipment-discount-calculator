import DeliveryServiceProviderBase from '../../base/delivery-service-provider.base'
import ParcelType from '../../enums/parcel-type.enum'
import Money from '../../value-objects/money.value-object'
import DeliveryServiceProvider from '../../enums/delivery-service-provider.enum'

export default class MondialRelay extends DeliveryServiceProviderBase {
  protected _name = DeliveryServiceProvider.MR

  constructor() {
    super()

    this.registerService(ParcelType.S, Money.create(2))
    this.registerService(ParcelType.M, Money.create(3))
    this.registerService(ParcelType.L, Money.create(4))
  }
}
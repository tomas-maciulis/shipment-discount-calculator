import Money from '../../value-objects/money.value-object'
import ParcelType from '../../enums/parcel-type.enum'
import DeliveryServiceProvider from '../../enums/delivery-service-provider.enum'
import DeliveryServiceProviderBase from '../../base/delivery-service-provider.base'

export default class LaPoste extends DeliveryServiceProviderBase {
  protected _name = DeliveryServiceProvider.LP

  constructor() {
    super()

    this.registerService(ParcelType.S, Money.create(1.50))
    this.registerService(ParcelType.M, Money.create(4.90))
    this.registerService(ParcelType.L, Money.create(6.90))
  }
}
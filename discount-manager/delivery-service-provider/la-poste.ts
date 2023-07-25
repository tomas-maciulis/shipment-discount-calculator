import Money from '../../value-object/money.value-object'
import ParcelType from '../../enum/parcel-type.enum'
import DeliveryServiceProvider from '../../enum/delivery-service-provider.enum'
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
import DeliveryServiceProvider from '../enums/delivery-service-provider.enum'
import ParcelType from '../enums/parcel-type.enum'
import DeliveryOrder from '../value-objects/delivery-order.value-object'
import Money from '../value-objects/money.value-object'
import DeliveryServiceProviderManager
  from '../discount-manager/delivery-service-provider/delivery-service-provider-manager'

export default abstract class DiscountRuleBase {
  protected _deliveryServiceProviderManager: DeliveryServiceProviderManager

  protected constructor() {
    this._deliveryServiceProviderManager = new DeliveryServiceProviderManager()
  }

  protected abstract _applicableProviders: DeliveryServiceProvider[]

  protected abstract _applicableParcelType: ParcelType

  abstract calculateDiscount(deliveryOrder: DeliveryOrder): Money

  protected addApplicableProvider(provider: DeliveryServiceProvider) {
    this._applicableProviders.push(provider)
  }

  protected isProviderEligible(provider: DeliveryServiceProvider) {
    return this._applicableProviders.includes(provider)
  }

  get applicableProviders() {
    return Object.freeze(this._applicableProviders)
  }

  get applicableParcelType() {
    return this._applicableParcelType
  }
}
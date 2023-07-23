import DeliveryServiceProvider from '../enums/delivery-service-provider.enum'
import ParcelType from '../enums/parcel-type.enum'
import DeliveryOrder from '../value-objects/delivery-order.value-object'
import Money from '../value-objects/money.value-object'
import DeliveryServiceProviderManager
  from '../discount-manager/delivery-service-provider/delivery-service-provider-manager'
import ServiceClient from '../value-objects/service-client.value-object'

export default abstract class DiscountRuleBase {
  protected _deliveryServiceProviderManager: DeliveryServiceProviderManager

  constructor() {
    this._deliveryServiceProviderManager = new DeliveryServiceProviderManager()
  }

  protected abstract _applicableProviders: DeliveryServiceProvider[]

  protected abstract _applicableParcelTypes: ParcelType[]

  // todo: refactor arguments into an object to make it easy to add new data in the future
  protected abstract applyRule(serviceClient: ServiceClient, deliveryOrder: DeliveryOrder): Money

  calculateDiscount(serviceClient: ServiceClient, deliveryOrder: DeliveryOrder) {
    if (this._applicableParcelTypes.includes(deliveryOrder.size)
      && this._applicableProviders.includes(deliveryOrder.provider.name)
    ) {
      return this.applyRule(serviceClient, deliveryOrder)
    }

    return Money.create(0)
  }
}
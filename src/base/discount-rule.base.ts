import DeliveryServiceProvider from '../enum/delivery-service-provider.enum'
import ParcelType from '../enum/parcel-type.enum'
import DeliveryOrder from '../entity/delivery-order.entity'
import Money from '../value-object/money.value-object'
import DeliveryServiceProviderManager
  from '../discount-manager/delivery-service-provider/delivery-service-provider-manager'
import ServiceClient from '../entity/service-client.entity'

export type RuleParams = {
  deliveryOrder: DeliveryOrder,
  serviceClient?: ServiceClient,
}

export default abstract class DiscountRuleBase {
  protected _deliveryServiceProviderManager: DeliveryServiceProviderManager

  constructor() {
    this._deliveryServiceProviderManager = new DeliveryServiceProviderManager()
  }

  protected abstract _applicableProviders: DeliveryServiceProvider[]

  protected abstract _applicableParcelTypes: ParcelType[]

  protected abstract applyRule(params: RuleParams): Money

  calculateDiscount(params: RuleParams) {
    const {deliveryOrder} = params

    if (this._applicableParcelTypes.includes(deliveryOrder.size)
      && this._applicableProviders.includes(deliveryOrder.provider.name)
    ) {
      return this.applyRule(params)
    }

    return Money.create(0)
  }
}
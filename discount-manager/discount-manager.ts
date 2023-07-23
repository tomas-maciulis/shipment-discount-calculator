import DeliveryServiceProviderManager from './delivery-service-provider/delivery-service-provider-manager'
import DiscountRuleBase from '../base/discount-rule.base'
import LowestSmallPackagePrice from './discount-rule/lowest-small-package-price'
import DeliveryOrder from '../value-objects/delivery-order.value-object'
import ServiceClient from '../value-objects/service-client.value-object'
import Money from '../value-objects/money.value-object'
import EveryThirdLpShipmentIsFreeOnceAMonth from './discount-rule/every-third-lp-shipment-is-free-once-a-month'

export default class DiscountManager {
  private _deliveryServiceProviderManager: DeliveryServiceProviderManager

  private _discountRules: DiscountRuleBase[] = []

  constructor() {
    this._deliveryServiceProviderManager = new DeliveryServiceProviderManager()

    this.registerDiscountRule(new LowestSmallPackagePrice())
    this.registerDiscountRule(new EveryThirdLpShipmentIsFreeOnceAMonth())
  }

  applyDiscounts(serviceClient: ServiceClient) {
    for (const deliveryOrder of serviceClient.validDeliveryOrders) {
      deliveryOrder.discount = this.applyRules(serviceClient, deliveryOrder)
    }
  }

  private applyRules(serviceClient: ServiceClient, deliveryOrder: DeliveryOrder) {
    let totalDiscount = Money.create(0)

    for (const rule of this._discountRules) {
      totalDiscount = Money.add(totalDiscount, rule.calculateDiscount(serviceClient, deliveryOrder))
    }

    return totalDiscount
  }

  private registerDiscountRule(rule: DiscountRuleBase) {
    this._discountRules.push(rule)
  }
}
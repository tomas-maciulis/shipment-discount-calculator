import DeliveryServiceProviderManager from './delivery-service-provider/delivery-service-provider-manager'
import DiscountRuleBase from '../base/discount-rule.base'
import LowestSmallPackagePrice from './discount-rule/lowest-small-package-price'
import DeliveryOrder from '../value-objects/delivery-order.value-object'
import ServiceClient from '../value-objects/service-client.value-object'
import Money from '../value-objects/money.value-object'

class DiscountManager {
  private _deliveryServiceProviderManager: DeliveryServiceProviderManager

  private _discountRules: DiscountRuleBase[]

  constructor() {
    this._deliveryServiceProviderManager = new DeliveryServiceProviderManager()

    this.registerRule(new LowestSmallPackagePrice())
  }

  applyDiscounts(serviceClient: ServiceClient) {
    for (const deliveryOrder of serviceClient.deliveryOrders) {
      deliveryOrder.discount = this.applyRules(deliveryOrder)
    }
  }

  private applyRules(deliveryOrder: DeliveryOrder) {
    let totalDiscount = Money.create(0)

    for (const rule of this._discountRules) {
      totalDiscount = Money.add(totalDiscount, rule.calculateDiscount(deliveryOrder))
    }

    return totalDiscount
  }

  private registerRule(rule: DiscountRuleBase) {
    this._discountRules.push(rule)
  }
}
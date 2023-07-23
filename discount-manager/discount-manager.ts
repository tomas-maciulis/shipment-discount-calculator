import DeliveryServiceProviderManager from './delivery-service-provider/delivery-service-provider-manager'
import DiscountRuleBase from '../base/discount-rule.base'
import LowestSmallPackagePrice from './discount-rule/lowest-small-package-price'
import DeliveryOrder from '../value-objects/delivery-order.value-object'
import ServiceClient from '../value-objects/service-client.value-object'
import Money from '../value-objects/money.value-object'
import EveryThirdLpShipmentIsFreeOnceAMonth from './discount-rule/every-third-lp-shipment-is-free-once-a-month'
import DiscountsCannotExceedTenEurosAMonth from './discount-validation-rule/discounts-cannot-exceed-ten-euros-a-month'
import {DiscountValidationRuleBase} from '../base/discount-validation-rule.base'

export default class DiscountManager {
  private _deliveryServiceProviderManager: DeliveryServiceProviderManager

  private _discountRules: DiscountRuleBase[] = []

  private _discountValidationRules: DiscountValidationRuleBase[] = []

  constructor() {
    this._deliveryServiceProviderManager = new DeliveryServiceProviderManager()

    this.registerDiscountRule(new LowestSmallPackagePrice())
    this.registerDiscountRule(new EveryThirdLpShipmentIsFreeOnceAMonth())

    this.registerDiscountValidationRule(new DiscountsCannotExceedTenEurosAMonth())
  }

  applyDiscounts(serviceClient: ServiceClient) {
    for (const deliveryOrder of serviceClient.validDeliveryOrders) {
      deliveryOrder.discount = this.applyRules(serviceClient, deliveryOrder)
    }
  }

  private applyRules(serviceClient: ServiceClient, deliveryOrder: DeliveryOrder) {
    let totalDiscount = Money.create(0)

    for (const rule of this._discountRules) {
      totalDiscount = totalDiscount.add(rule.calculateDiscount(serviceClient, deliveryOrder))
    }

    totalDiscount = this.validateDiscount(serviceClient, deliveryOrder, totalDiscount)

    return totalDiscount
  }

  private validateDiscount(serviceClient: ServiceClient, deliveryOrder: DeliveryOrder, discount: Money) {
    let validatedDiscount = discount.copy()

    for (const rule of this._discountValidationRules) {
      validatedDiscount = rule.validate(serviceClient, deliveryOrder, discount)
    }

    return validatedDiscount
  }

  private registerDiscountRule(rule: DiscountRuleBase) {
    this._discountRules.push(rule)
  }

  private registerDiscountValidationRule(rule: DiscountValidationRuleBase) {
    this._discountValidationRules.push(rule)
  }
}
import DeliveryServiceProviderManager from './delivery-service-provider/delivery-service-provider-manager'
import DiscountRuleBase from '../base/discount-rule.base'
import LowestSmallPackagePrice from './discount-rule/lowest-small-package-price'
import DeliveryOrder from '../entity/delivery-order.entity'
import ServiceClient from '../entity/service-client.entity'
import Money from '../value-object/money.value-object'
import EveryThirdLpShipmentIsFreeOnceAMonth from './discount-rule/every-third-lp-shipment-is-free-once-a-month'
import DiscountsCannotExceedTenEurosAMonth from './discount-validation-rule/discounts-cannot-exceed-ten-euros-a-month'
import {DiscountValidationRuleBase, DiscountValidationRuleParams} from '../base/discount-validation-rule.base'

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
    let discount = Money.create(0)

    for (const rule of this._discountRules) {
      discount = discount.add(rule.calculateDiscount({serviceClient, deliveryOrder}))

      discount = this.validateDiscount({serviceClient, deliveryOrder, discount})
    }

    return discount
  }

  private validateDiscount(params: DiscountValidationRuleParams) {
    const {discount} = params

    let validatedDiscount = discount.copy()

    for (const rule of this._discountValidationRules) {
      validatedDiscount = rule.validate(params)
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
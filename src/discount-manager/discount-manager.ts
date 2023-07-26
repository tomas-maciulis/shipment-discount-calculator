import DeliveryServiceProviderManager from './delivery-service-provider/delivery-service-provider-manager'
import DiscountRuleBase from '../base/discount-rule.base'
import LowestSmallPackagePriceDiscountRule from './discount-rule/lowest-small-package-price.discount-rule'
import DeliveryOrder from '../entity/delivery-order.entity'
import User from '../entity/user.aggregate-root'
import Money from '../value-object/money.value-object'
import EveryThirdLpShipmentIsFreeOnceAMonthDiscountRule
  from './discount-rule/every-third-lp-shipment-is-free-once-a-month.discount-rule'
import DiscountsCannotExceedTenEurosAMonthDiscountValidationRule
  from './discount-validation-rule/discounts-cannot-exceed-ten-euros-a-month.discount-validation-rule'
import {DiscountValidationRuleBase, DiscountValidationRuleParams} from '../base/discount-validation-rule.base'

export default class DiscountManager {
  private _deliveryServiceProviderManager: DeliveryServiceProviderManager

  private _discountRules: DiscountRuleBase[] = []

  private _discountValidationRules: DiscountValidationRuleBase[] = []

  constructor() {
    this._deliveryServiceProviderManager = new DeliveryServiceProviderManager()

    this.registerDiscountRule(new LowestSmallPackagePriceDiscountRule())
    this.registerDiscountRule(new EveryThirdLpShipmentIsFreeOnceAMonthDiscountRule())

    this.registerDiscountValidationRule(new DiscountsCannotExceedTenEurosAMonthDiscountValidationRule())
  }

  applyDiscounts(user: User) {
    for (const deliveryOrder of user.validDeliveryOrders) {
      deliveryOrder.discount = this.applyRules(user, deliveryOrder)
    }
  }

  private applyRules(user: User, deliveryOrder: DeliveryOrder) {
    let discount = Money.create(0)

    for (const rule of this._discountRules) {
      discount = discount.add(rule.calculateDiscount({user, deliveryOrder}))

      discount = this.validateDiscount({user, deliveryOrder, discount})

      if (discount.greaterThan(Money.create(0))) {
        break
      }
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
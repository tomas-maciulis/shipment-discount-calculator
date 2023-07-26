import {DiscountValidationRuleBase, DiscountValidationRuleParams} from '../../base/discount-validation-rule.base'
import Money from '../../value-object/money.value-object'

export default class DiscountsCannotExceedTenEurosAMonthDiscountValidationRule extends DiscountValidationRuleBase {
  validate(params: DiscountValidationRuleParams) {
    const {user, deliveryOrder, discount} = params

    const monthlyDiscountCap = Money.create(10)

    const discountSumForTheSameMonth = user.validDeliveryOrders.reduce((sum, d) => {
      if (d.date.getMonth() === deliveryOrder.date.getMonth()
        && d.date.getFullYear() === deliveryOrder.date.getFullYear()
      ) {
        return sum.add(d.discount)
      }

      return sum
    }, Money.create(0))

    if (discountSumForTheSameMonth.moreOrEqualTo(monthlyDiscountCap)) {
      return Money.create(0)
    }

    if (discountSumForTheSameMonth.add(discount).lessOrEqualTo(monthlyDiscountCap)) {
      return discount
    }

    return monthlyDiscountCap.subtract(discountSumForTheSameMonth)
  }

}
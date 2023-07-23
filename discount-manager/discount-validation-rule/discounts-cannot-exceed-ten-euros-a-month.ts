import {DiscountValidationRuleBase} from '../../base/discount-validation-rule.base'
import ServiceClient from '../../value-objects/service-client.value-object'
import DeliveryOrder from '../../value-objects/delivery-order.value-object'
import Money from '../../value-objects/money.value-object'

export default class DiscountsCannotExceedTenEurosAMonth extends DiscountValidationRuleBase {
  validate(serviceClient: ServiceClient, deliveryOrder: DeliveryOrder, discount: Money): Money {
    const monthlyDiscountCap = Money.create(10)

    const discountSumForTheSameMonth = serviceClient.validDeliveryOrders.reduce((sum, d) => {
      if (d.date.getMonth() === deliveryOrder.date.getMonth()) {
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
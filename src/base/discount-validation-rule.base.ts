import Money from '../value-object/money.value-object'
import User from '../entity/user.aggregate-root'
import DeliveryOrder from '../entity/delivery-order.entity'

export type DiscountValidationRuleParams = {
  user: User,
  deliveryOrder: DeliveryOrder,
  discount: Money,
}

export abstract class DiscountValidationRuleBase {
  abstract validate(params: DiscountValidationRuleParams): Money
}
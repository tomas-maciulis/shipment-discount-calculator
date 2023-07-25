import Money from '../value-object/money.value-object'
import ServiceClient from '../entity/service-client.entity'
import DeliveryOrder from '../entity/delivery-order.entity'

export type DiscountValidationRuleParams = {
  serviceClient: ServiceClient,
  deliveryOrder: DeliveryOrder,
  discount: Money,
}

export abstract class DiscountValidationRuleBase {
  abstract validate(params: DiscountValidationRuleParams): Money
}
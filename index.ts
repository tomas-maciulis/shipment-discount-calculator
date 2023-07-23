import DiscountManager from './discount-manager/discount-manager'
import ServiceClient from './value-objects/service-client.value-object'

const serviceClient = new ServiceClient()

serviceClient.addDeliveryOrdersFromDataFile(process.argv[2] ?? 'input.txt')

const discountManager = new DiscountManager()

discountManager.applyDiscounts(serviceClient)

for (const order of serviceClient.deliveryOrders) {
  console.log(order.provider?.name, order.size, order.discount)
}
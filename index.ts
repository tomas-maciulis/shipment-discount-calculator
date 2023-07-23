import DiscountManager from './discount-manager/discount-manager'
import ServiceClient from './value-objects/service-client.value-object'

const serviceClient = new ServiceClient()

serviceClient.addDeliveryOrdersFromDataFile(process.argv[2] ?? 'input.txt')

const discountManager = new DiscountManager()

discountManager.applyDiscounts(serviceClient)

console.log(serviceClient.deliveryOrdersAsString)
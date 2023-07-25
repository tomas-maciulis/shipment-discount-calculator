import DiscountManager from './discount-manager/discount-manager'
import ServiceClient from './entity/service-client.entity'

const serviceClient = new ServiceClient()

serviceClient.addDeliveryOrdersFromDataFile(process.argv[2] ?? 'input.txt')

const discountManager = new DiscountManager()

discountManager.applyDiscounts(serviceClient)

console.log(serviceClient.deliveryOrdersAsString)
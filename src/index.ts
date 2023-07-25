import DiscountManager from './discount-manager/discount-manager'
import ServiceClient from './entity/service-client.entity'

const serviceClient = new ServiceClient()
const discountManager = new DiscountManager()

serviceClient.addDeliveryOrdersFromDataFile(process.argv[2] ?? 'input.txt')

discountManager.applyDiscounts(serviceClient)

console.log(serviceClient.deliveryOrdersAsString)
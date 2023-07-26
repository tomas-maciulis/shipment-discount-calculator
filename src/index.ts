import DiscountManager from './discount-manager/discount-manager'
import User from './entity/user.aggregate-root'

const serviceClient = new User()
const discountManager = new DiscountManager()

serviceClient.addDeliveryOrdersFromDataFile(process.argv[2] ?? 'input.txt')

discountManager.applyDiscounts(serviceClient)

console.log(serviceClient.deliveryOrdersAsString)
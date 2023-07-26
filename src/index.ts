import DiscountManager from './discount-manager/discount-manager'
import User from './entity/user.aggregate-root'

const user = new User()
const discountManager = new DiscountManager()

user.addDeliveryOrdersFromDataFile(process.argv[2] ?? 'input.txt')

discountManager.applyDiscounts(user)

console.log(user.deliveryOrdersAsString)
import readShipmentDataFromFile from './utils/read-shipment-data-from-file.util'
import ServiceClient from './value-objects/service-client.value-object'

const serviceClient = new ServiceClient(readShipmentDataFromFile(process.argv[2]))


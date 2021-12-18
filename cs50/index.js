const Customer = require('./models/customer');
const Order = require('./models/order');

Customer.insertMany([ // inserts several objects into the Customer collections
    {
        name: "Joey Tom",
        email: "joe@gmail.com"
    },
    { 
        name: "Chad D",
        email: "chad@gmail.com"
    }
//  returns a promise that will eventually return the customers added
]).then(customers => { 
    console.log('Customers added: ', customers);
    // will delete customer with the 'name' prop with "Joey Tom"
    return Customer.deleteOne({name: "Joey Tom"}); 
// deleteOne will return the item that was deleted
}).then(deletedCustomer => { 
    console.log('Customer deleted: ', deletedCustomer);
    // an empty query will return all customers
    return Customer.find(); 
}).then(remainingCustomers => {
    console.log('Remaining customers: ', remainingCustomers);
    customerId = remainingCustomers[0]._id; 
    // create will create an order obj and insert it into the collection
    return Order.create({
        total: 45,
        customerId: customerId,
    });
}).then(order => {
    console.log('Exisiting customer order', order);
    // find will return all orders in the collection where the order has the customer id specified
    return Order.find({customer_id: customerId}); 
}).then(selectedOrders => {
    console.log('Selected order: ', selectedOrders);
}).catch(e => {
    throw e;
});
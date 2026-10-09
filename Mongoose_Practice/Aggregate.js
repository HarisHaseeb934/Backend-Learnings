import mongoose from 'mongoose';

// 1. Define Schema & Model
const orderSchema = new mongoose.Schema({
  customerName: String,
  status: String,        // 'delivered', 'processing', 'cancelled'
  paymentMethod: String, // 'card', 'cash', 'easypaisa'
  items: [
    { name: String, price: Number, qty: Number }
  ],
  totalAmount: Number,
  shippingCity: String,
  createdAt: Date
});

export const Order = mongoose.model('Order', orderSchema);

// 2. Seed Database Function
async function seedDB() {
  await mongoose.connect('mongodb://127.0.0.1:27017/aggregate_practice');
  await Order.deleteMany({});

  await Order.insertMany([
    {
      customerName: 'Ali Khan',
      status: 'delivered',
      paymentMethod: 'card',
      items: [
        { name: 'Mechanical Keyboard', price: 120, qty: 1 },
        { name: 'Gaming Mouse', price: 50, qty: 2 }
      ],
      totalAmount: 220,
      shippingCity: 'Lahore',
      createdAt: new Date('2026-01-10')
    },
    {
      customerName: 'Sara Ahmed',
      status: 'delivered',
      paymentMethod: 'cash',
      items: [
        { name: '27inch Monitor', price: 300, qty: 1 },
        { name: 'HDMI Cable', price: 15, qty: 2 }
      ],
      totalAmount: 330,
      shippingCity: 'Karachi',
      createdAt: new Date('2026-01-15')
    },
    {
      customerName: 'Ali Khan',
      status: 'cancelled',
      paymentMethod: 'card',
      items: [
        { name: 'Wireless Headset', price: 100, qty: 1 }
      ],
      totalAmount: 100,
      shippingCity: 'Lahore',
      createdAt: new Date('2026-02-01')
    },
    {
      customerName: 'Usman Ghani',
      status: 'delivered',
      paymentMethod: 'card',
      items: [
        { name: 'Gaming Mouse', price: 50, qty: 4 },
        { name: 'Mousepad', price: 20, qty: 2 }
      ],
      totalAmount: 240,
      shippingCity: 'Lahore',
      createdAt: new Date('2026-02-20')
    },
    {
      customerName: 'Sara Ahmed',
      status: 'processing',
      paymentMethod: 'easypaisa',
      items: [
        { name: 'Mechanical Keyboard', price: 120, qty: 1 }
      ],
      totalAmount: 120,
      shippingCity: 'Karachi',
      createdAt: new Date('2026-03-05')
    },
    {
      customerName: 'Bilal Raza',
      status: 'delivered',
      paymentMethod: 'cash',
      items: [
        { name: 'Wireless Headset', price: 100, qty: 2 },
        { name: 'Mousepad', price: 20, qty: 1 }
      ],
      totalAmount: 220,
      shippingCity: 'Islamabad',
      createdAt: new Date('2026-03-12')
    }
  ]);

  console.log('✅ Dummy database populated successfully!');
}

// seedDB();
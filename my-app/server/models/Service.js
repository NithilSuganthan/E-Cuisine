const { Schema, model } = require('mongoose');

const PricingSchema = new Schema({
  monthly: { type: Number, default: 0 },
  yearly: { type: Number, default: 0 }
}, { _id: false });

const MenuPartSchema = new Schema({
  morning: { type: [String], default: [] },
  lunch: { type: [String], default: [] },
  dinner: { type: [String], default: [] }
}, { _id: false });

const ContactSchema = new Schema({
  phone: { type: String, default: '' },
  email: { type: String, default: '' }
}, { _id: false });

const ServiceSchema = new Schema({
  id: { type: String, required: true, unique: true },
  servicename: { type: String, required: true },
  description: { type: String, default: '' },
  city: { type: String, default: '' },
  cuisinetype: { type: String, default: 'Mixed' },
  rating: { type: Number, default: 4.0 },
  pricing: { type: PricingSchema, default: () => ({}) },
  deliveryTimes: { type: Object, default: {} },
  menu: { type: MenuPartSchema, default: () => ({}) },
  contact: { type: ContactSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('Service', ServiceSchema);
// src/services/api.js
// Mock API for development. Replace with real network calls when backend is available.
let MOCK_SERVICES = [
  {
    id: '1',
    servicename: 'Homely Meals',
    description: 'Daily fresh South Indian breakfast, lunch and dinner made by local home cooks.',
    city: 'Chennai',
    cuisinetype: 'South Indian',
    rating: 4.8,
    pricing: { monthly: 3500, yearly: 38000 },
    deliveryTimes: { morning: '7:00 - 9:00', lunch: '12:00 - 13:30', dinner: '19:00 - 20:30' },
    menu: {
      morning: [ 'Idli (2) + Sambar', 'Dosa + Coconut Chutney', 'Pongal' ],
      lunch: [ 'Rice, Rasam, Sambar, 2 Veg Curries, Curd', 'Buttermilk', 'Salad' ],
      dinner: [ 'Chapati(2) + Dal, Veg Curry, Salad', 'Rasam', 'Pickle' ]
    },
    contact: { phone: '+91-9876543210', email: 'homely@meals.example' }
  },
  {
    id: '2',
    servicename: 'Campus Kitchen',
    description: 'Affordable balanced meals tailored for PG students — focused on nutrition and on-time delivery.',
    city: 'Bengaluru',
    cuisinetype: 'Mixed',
    rating: 4.6,
    pricing: { monthly: 2999, yearly: 33000 },
    deliveryTimes: { morning: '7:30 - 8:30', lunch: '12:30 - 13:30', dinner: '20:00 - 21:00' },
    menu: {
      morning: [ 'Poha', 'Egg Omelette + Toast', 'Paratha with Aloo' ],
      lunch: [ 'Veg Thali with Rice, Dal, 2 Veg, Salad', 'Curd' ],
      dinner: [ 'Paneer Butter Masala + Roti', 'Jeera Rice', 'Dessert (Kheer)' ]
    },
    contact: { phone: '+91-9123456780', email: 'hello@campuskitchen.example' }
  },
  {
    id: '3',
    servicename: 'NorthFlavors',
    description: 'Hearty North Indian menus with rich gravies and daily specials — ideal for students missing home food.',
    city: 'Delhi',
    cuisinetype: 'North Indian',
    rating: 4.7,
    pricing: { monthly: 4200, yearly: 45000 },
    deliveryTimes: { morning: '8:00 - 9:00', lunch: '13:00 - 14:00', dinner: '20:00 - 21:30' },
    menu: {
      morning: [ 'Aloo Paratha + Curd', 'Chole Bhature (weekends)', 'Sooji Upma' ],
      lunch: [ 'Dal Makhani, Jeera Rice, Mixed Veg, Raita' ],
      dinner: [ 'Butter Chicken + Naan', 'Dal Tadka + Rice' ]
    },
    contact: { phone: '+91-9012345678', email: 'info@northflavors.example' }
  },
  {
    id: '4',
    servicename: 'GreenBite Meals',
    description: 'Vegetarian-first meal plans with healthy portions and timely doorstep delivery.',
    city: 'Pune',
    cuisinetype: 'Vegetarian',
    rating: 4.5,
    pricing: { monthly: 3200, yearly: 34500 },
    deliveryTimes: { morning: '7:00 - 8:00', lunch: '12:00 - 13:00', dinner: '19:30 - 20:30' },
    menu: {
      morning: [ 'Mixed Fruit Yogurt', 'Vegetable Sandwich', 'Idli' ],
      lunch: [ 'Brown Rice, Rajma, Seasonal Veg, Salad' ],
      dinner: [ 'Roti, Paneer Curry, Soup' ]
    },
    contact: { phone: '+91-9765432100', email: 'hello@greenbite.example' }
  },
  {
    id: '5',
    servicename: 'Express Tiffins',
    description: 'Quick, tasty tiffins optimized for students with tight schedules — reliable morning & evening deliveries.',
    city: 'Hyderabad',
    cuisinetype: 'Hyderabadi',
    rating: 4.4,
    pricing: { monthly: 2800, yearly: 30000 },
    deliveryTimes: { morning: '7:15 - 8:15', lunch: '13:00 - 14:00', dinner: '20:00 - 21:00' },
    menu: {
      morning: [ 'Semiya Upma', 'Masala Omelette', 'Mini Idli' ],
      lunch: [ 'Biryani (veg/non-veg options), Raita, Salad' ],
      dinner: [ 'Keema (veg option available) + Chapati', 'Dal' ]
    },
    contact: { phone: '+91-9887766554', email: 'contact@expresstiffins.example' }
  }
];

// Try to hydrate from localStorage so created services survive reloads in dev
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = localStorage.getItem('mock_services');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        MOCK_SERVICES = parsed;
      }
    }
  }
} catch (err) {
  // ignore storage errors in restricted environments
}

function persistMockServices() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('mock_services', JSON.stringify(MOCK_SERVICES));
    }
  } catch (err) {
    // ignore
  }
}

export async function fetchServices() {
  // Prefer backend API if available
  try {
    const res = await fetch('/api/services');
    if (res.ok) return await res.json();
  } catch (err) {
    // ignore and fallback
  }
  // fallback to local mock
  await new Promise(r => setTimeout(r, 150));
  return MOCK_SERVICES;
}

export async function getServiceById(id) {
  try {
    const res = await fetch(`/api/services/${id}`);
    if (res.ok) return await res.json();
  } catch (err) {
    // ignore
  }
  await new Promise(r => setTimeout(r, 80));
  return MOCK_SERVICES.find(s => String(s.id) === String(id)) || null;
}

export async function bookService(serviceId, userDetails, subscriptionType) {
  // In real app, POST to backend. Here we simulate success and return booking id & price.
  const service = MOCK_SERVICES.find(s => String(s.id) === String(serviceId));
  const price = service ? (subscriptionType === 'Yearly' ? service.pricing.yearly : service.pricing.monthly) : 0;
  return { success: true, bookingId: Math.floor(10000 + Math.random() * 90000), charged: price };
}

export async function createService(service) {
  // Try backend POST first
  try {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    // ignore -> fallback to mock
  }
  // fallback to in-memory mock
  await new Promise(r => setTimeout(r, 120));
  const id = String(Date.now() + Math.floor(Math.random() * 1000));
  const newService = {
    id,
    servicename: service.servicename || 'New Service',
    description: service.description || '',
    city: service.city || '',
    cuisinetype: service.cuisinetype || 'Mixed',
    rating: service.rating || 4.0,
    pricing: service.pricing || (service.monthlyprice ? { monthly: Number(service.monthlyprice), yearly: Number(service.yearlyprice || 0) } : { monthly: 0, yearly: 0 }),
    deliveryTimes: service.deliveryTimes || { morning: '', lunch: '', dinner: '' },
    menu: service.menu || { morning: [], lunch: [], dinner: [] },
    contact: service.contact || { phone: '', email: '' }
  };
  MOCK_SERVICES.unshift(newService); // add to front so it's visible immediately
  persistMockServices();
  return newService;
}

export async function updateService(id, data) {
  // Try backend PUT first
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const res = await fetch(`/api/admin/services/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
    if (res.ok) return await res.json();
    // if backend returns error, fall back to mock update
  } catch (err) {
    // ignore and fallback
  }

  // Fallback to mock update (in-memory)
  try {
    const idx = MOCK_SERVICES.findIndex(s => String(s.id) === String(id));
    if (idx === -1) return { success: false, message: 'Not found (mock)' };
    const existing = MOCK_SERVICES[idx];
    const updated = { ...existing, ...data };
    // handle nested objects (pricing, menu, contact, deliveryTimes)
    if (data.pricing) updated.pricing = { ...existing.pricing, ...data.pricing };
    if (data.menu) updated.menu = { ...existing.menu, ...data.menu };
    if (data.contact) updated.contact = { ...existing.contact, ...data.contact };
    if (data.deliveryTimes) updated.deliveryTimes = { ...existing.deliveryTimes, ...data.deliveryTimes };
    MOCK_SERVICES[idx] = updated;
    persistMockServices();
    return { success: true, service: updated };
  } catch (err) {
    return { success: false, message: err.message || String(err) };
  }
}

const api = {
  fetchServices,
  getServiceById,
  bookService,
  createService
};

export default api;

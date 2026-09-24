import { Product, Order } from '../types';

/**
 * Format currency strictly in Indian Rupees (INR / ₹)
 * NEVER display USD, EUR or any other currency.
 */
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (mrp: number, salePrice: number): number => {
  if (!mrp || mrp <= salePrice) return 0;
  return Math.round(((mrp - salePrice) / mrp) * 100);
};

/**
 * Generate dynamic WhatsApp link for product enquiry / order
 */
export const generateWhatsAppProductUrl = (product: Product): string => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919495902904';
  
  const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'https://www.king-day.shop';
  const productUrl = `${currentDomain}/product/${product.slug}`;
  const formattedPrice = formatINR(product.salePrice);

  const message = `Hello KING DAY,

I am interested in this product:

🛒 Product: ${product.name}
🏷️ SKU: ${product.sku}
💰 Price: ${formattedPrice}

🔗 Link: ${productUrl}

Please confirm stock availability and shipping details. Thank you!`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

/**
 * Generate dynamic WhatsApp link for full Order confirmation
 */
export const generateWhatsAppOrderUrl = (order: Order): string => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919495902904';
  const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'https://www.king-day.shop';
  const trackingUrl = `${currentDomain}/track-order?id=${order.orderNumber}`;

  const itemList = order.items
    .map((item, idx) => `${idx + 1}. ${item.productName} (x${item.quantity}) - ${formatINR(item.total)}`)
    .join('\n');

  const message = `Hello KING DAY,

I have placed a new order on the website!

🆔 Order ID: ${order.orderNumber}
👤 Customer: ${order.customerName}
📞 Phone: ${order.phone}
📍 Address: ${order.address}${order.apartment ? `, ${order.apartment}` : ''}, ${order.city}, ${order.state} - ${order.pincode}

🛍️ ITEMS ORDERED:
${itemList}

💵 Subtotal: ${formatINR(order.subtotal)}
🚚 Shipping: ${order.shipping === 0 ? 'FREE' : formatINR(order.shipping)}
💰 TOTAL AMOUNT: ${formatINR(order.total)}

🔍 Track Order: ${trackingUrl}

Please confirm my order and send payment/delivery instructions. Thank you!`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

/**
 * General WhatsApp inquiry URL
 */
export const generateGeneralWhatsAppUrl = (customText?: string): string => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919495902904';
  const defaultMsg = 'Hello KING DAY! I have an enquiry regarding kids ride-on cars, toys & bicycles.';
  const text = encodeURIComponent(customText || defaultMsg);
  return `https://wa.me/${whatsappNumber}?text=${text}`;
};

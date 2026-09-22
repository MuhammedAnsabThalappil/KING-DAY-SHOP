import { Product } from '../types';

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
 * Uses window.location.origin dynamically (works on localhost, Vercel, or custom domains)
 */
export const generateWhatsAppProductUrl = (product: Product): string => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919495902904';
  
  const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'https://kingday.store';
  const productUrl = `${currentDomain}/product/${product.slug}`;
  const formattedPrice = formatINR(product.salePrice);

  const message = `Hello KING DAY,

I am interested in this product:

Product: ${product.name}

SKU: ${product.sku}

Price: ${formattedPrice}

Product URL:
${productUrl}

Please share availability and delivery details.

Thank you.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
};

/**
 * General WhatsApp inquiry URL
 */
export const generateGeneralWhatsAppUrl = (customText?: string): string => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919495902904';
  const defaultMsg = 'Hello KING DAY! I have an enquiry regarding kids products.';
  const text = encodeURIComponent(customText || defaultMsg);
  return `https://wa.me/${whatsappNumber}?text=${text}`;
};

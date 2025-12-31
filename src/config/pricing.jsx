// src/config/pricing.js

const DEFAULT_TICKET_PRICE = 6499;

let cachedPrice = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000;

export const getTicketPrice = async () => {
  if (cachedPrice && lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
    return cachedPrice;
  }

  try {
    const response = await fetch('/api/pricing/ticket-price', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const price = parseFloat(data.price);
      
      if (!isNaN(price) && price > 0) {
        cachedPrice = price;
        lastFetchTime = Date.now();
        return price;
      }
    }
  } catch (error) {
    console.warn('Failed to fetch ticket price from admin, using default:', error);
  }

  return DEFAULT_TICKET_PRICE;
};

export const getDefaultTicketPrice = () => DEFAULT_TICKET_PRICE;

export const clearPriceCache = () => {
  cachedPrice = null;
  lastFetchTime = null;
};
// src/utils/sanitize.js

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-+()]{10,20}$/;
const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;

export const sanitizeString = (str, maxLength = 500) => {
  if (typeof str !== 'string') return '';
  
  return str
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .substring(0, maxLength);
};

export const sanitizeEmail = (email) => {
  const cleaned = sanitizeString(email, 100).toLowerCase();
  return EMAIL_REGEX.test(cleaned) ? cleaned : '';
};

export const sanitizePhone = (phone) => {
  const cleaned = sanitizeString(phone, 20);
  return PHONE_REGEX.test(cleaned) ? cleaned : '';
};

export const sanitizeName = (name) => {
  const cleaned = sanitizeString(name, 50);
  return NAME_REGEX.test(cleaned) ? cleaned : '';
};

export const validateTicketQuantity = (qty) => {
  const parsed = parseInt(qty, 10);
  return isNaN(parsed) ? 1 : Math.max(1, Math.min(20, parsed));
};

export const validatePrice = (price) => {
  const parsed = parseFloat(price);
  return isNaN(parsed) || parsed < 0 ? 0 : parsed;
};

export const sanitizeFormData = (data) => {
  return {
    firstName: sanitizeName(data.firstName),
    lastName: sanitizeName(data.lastName),
    email: sanitizeEmail(data.email),
    phone: sanitizePhone(data.phone),
    location: sanitizeString(data.location, 100),
    whatsapp: sanitizePhone(data.whatsapp),
    tickets: validateTicketQuantity(data.tickets),
    message: sanitizeString(data.message, 1000),
  };
};

export const isValidFormData = (data) => {
  return (
    data.firstName?.length >= 2 &&
    data.lastName?.length >= 2 &&
    EMAIL_REGEX.test(data.email) &&
    PHONE_REGEX.test(data.phone) &&
    data.location?.length >= 2 &&
    PHONE_REGEX.test(data.whatsapp)
  );
};
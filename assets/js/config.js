
export const SITE_CONFIG = {
  brandName: "Daily Choice",

  tagline: "Better Choices, Brighter Tomorrow.",

  whatsappNumber: "91XXXXXXXXXX",

  fssaiNumber: "23626026002068",

  location: "Nizamabad, Telangana, India",

  dreamLaddersUrl: "https://dreamladders.github.io/Main/"
};


// Validate Indian WhatsApp number before creating a link.
export function getWhatsAppUrl(message) {
  const number = SITE_CONFIG.whatsappNumber.replace(/\D/g, "");

  if (!/^91[6-9]\d{9}$/.test(number)) {
    alert("Please configure a valid WhatsApp number in config.js.");
    return null;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

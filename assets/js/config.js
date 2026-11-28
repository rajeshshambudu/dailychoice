
export const SITE_CONFIG = {
  brandName: "Daily Choice",

  tagline: "Better Choices, Brighter Tomorrow.",

  whatsappNumber: "917093218658",

  fssaiNumber: "23626026002068",

  location: "Nizamabad, Telangana, India",

  dreamLaddersUrl: "https://dreamladders.github.io/Main/"
};



export function getWhatsAppUrl(message) {
  const number = String(SITE_CONFIG.whatsappNumber || "")
    .replace(/\D/g, "")
    .trim();

  console.log("WhatsApp number:", number);
  console.log("Number length:", number.length);
  console.log("Valid:", /^91[6-9]\d{9}$/.test(number));

  if (!/^91[6-9]\d{9}$/.test(number)) {
    alert("Invalid WhatsApp number. Please check config.js.");
    return null;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}





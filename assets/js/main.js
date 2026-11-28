
import { SITE_CONFIG, getWhatsAppUrl } from "./config.js";

import { PRODUCTS } from "./products.js";

import {
  getCartItems,
  getCartCount,
  addToCart,
  changeQuantity,
  clearCart
} from "./cart.js";


// ELEMENTS

const productGrid = document.getElementById("productGrid");
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const cartItemsContainer = document.getElementById("cartItems");
const closeCartButton = document.getElementById("closeCart");
const checkoutButton = document.getElementById("checkoutButton");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const contactForm = document.getElementById("contactForm");


// SAFE ELEMENT CREATOR

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) element.className = className;

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}


// PRODUCT RENDERING

function renderProducts() {
  productGrid.replaceChildren();

  PRODUCTS.forEach(product => {
    const card = createElement("article", "product-card");

    const imageContainer = createElement("div", "product-image");

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.imageAlt;
    image.loading = "lazy";

    image.onerror = () => {
      image.remove();

      const placeholder = createElement(
        "div",
        "product-placeholder",
        "🥜"
      );

      imageContainer.appendChild(placeholder);
    };

    imageContainer.appendChild(image);

    const info = createElement("div", "product-info");

    const title = createElement("h3", "", product.name);
    const description = createElement("p", "", product.description);
    const meta = createElement("div", "product-meta", product.size);
    const actions = createElement("div", "product-actions");

    const addButton = createElement(
      "button",
      "add-cart-btn",
      "Add to Enquiry Cart"
    );

    addButton.type = "button";

    addButton.addEventListener("click", () => {
      addToCart(product.id);
      updateCart();
      addButton.textContent = "Added ✓";

      setTimeout(() => {
        addButton.textContent = "Add to Enquiry Cart";
      }, 1200);
    });

    const enquireButton = createElement(
      "button",
      "product-enquire-btn",
      "Enquire Now"
    );

    enquireButton.type = "button";

    enquireButton.addEventListener("click", () => {
      const message =
        `Hello Daily Choice,\n\nI am interested in:\n${product.name} - ${product.size}\n\nPlease share the price and availability.`;

      openWhatsApp(message);
    });

    actions.append(addButton, enquireButton);

    info.append(title, description, meta, actions);
    card.append(imageContainer, info);

    productGrid.appendChild(card);
  });
}


// WHATSAPP

function openWhatsApp(message) {
  const url = getWhatsAppUrl(message);

  if (url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}


// CART

function updateCart() {
  cartCount.textContent = getCartCount();

  renderCartItems();
}


function renderCartItems() {
  cartItemsContainer.replaceChildren();

  const items = getCartItems();

  if (items.length === 0) {
    cartItemsContainer.appendChild(
      createElement("p", "empty-cart", "Your cart is empty.")
    );

    return;
  }

  items.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);

    if (!product) return;

    const row = createElement("div", "cart-item");

    const details = createElement("div");

    details.append(
      createElement("div", "cart-item-name", product.name),
      createElement("small", "", `${product.size} · ${item.quantity} selected`)
    );

    const controls = createElement("div", "cart-item-controls");

    const minus = createElement("button", "", "−");
    minus.type = "button";
    minus.setAttribute("aria-label", `Remove one ${product.size}`);

    minus.addEventListener("click", () => {
      changeQuantity(product.id, -1);
      updateCart();
    });

    const quantity = createElement("span", "", String(item.quantity));

    const plus = createElement("button", "", "+");
    plus.type = "button";
    plus.setAttribute("aria-label", `Add one ${product.size}`);

    plus.addEventListener("click", () => {
      changeQuantity(product.id, 1);
      updateCart();
    });

    controls.append(minus, quantity, plus);
    row.append(details, controls);

    cartItemsContainer.appendChild(row);
  });
}


function openCart() {
  cartModal.classList.add("open");
  cartModal.setAttribute("aria-hidden", "false");
  closeCartButton.focus();
}


function closeCart() {
  cartModal.classList.remove("open");
  cartModal.setAttribute("aria-hidden", "true");
  cartButton.focus();
}


function sendCartEnquiry() {
  const items = getCartItems();

  if (items.length === 0) {
    alert("Please add at least one product to your cart.");
    return;
  }

  const lines = items.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);

    return product
      ? `- ${product.name} (${product.size}) x ${item.quantity}`
      : "";
  }).filter(Boolean);

  const message =
    `Hello Daily Choice,\n\nI would like to enquire about these products:\n\n${lines.join("\n")}\n\nPlease share the pricing and availability.\n\nThank you.`;

  openWhatsApp(message);
}


// MOBILE MENU

function closeMobileMenu() {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}


menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
});


mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeMobileMenu);
});


// NAVIGATION BUTTONS

document.querySelectorAll("[data-scroll]").forEach(button => {
  button.addEventListener("click", () => {
    const selector = button.dataset.scroll;
    const target = document.querySelector(selector);

    target?.scrollIntoView({ behavior: "smooth" });

    closeMobileMenu();
  });
});


// CART EVENTS

cartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
checkoutButton.addEventListener("click", sendCartEnquiry);


cartModal.addEventListener("click", event => {
  if (event.target === cartModal) {
    closeCart();
  }
});


document.addEventListener("keydown", event => {
  if (event.key === "Escape" && cartModal.classList.contains("open")) {
    closeCart();
  }
});


// CONTACT FORM

contactForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const message = document.getElementById("customerMessage").value.trim();

  if (!name || !phone || !message) {
    alert("Please complete all fields.");
    return;
  }

  const whatsappMessage =
    `Hello Daily Choice,\n\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`;

  openWhatsApp(whatsappMessage);
});


// CTA AND FOOTER WHATSAPP LINKS

const ctaWhatsApp = document.getElementById("ctaWhatsApp");
const footerWhatsApp = document.getElementById("footerWhatsApp");


function configureWhatsAppLink(element, message) {
  element.addEventListener("click", event => {
    event.preventDefault();
    openWhatsApp(message);
  });
}


configureWhatsAppLink(
  ctaWhatsApp,
  "Hello Daily Choice, I would like to know more about your products."
);


configureWhatsAppLink(
  footerWhatsApp,
  "Hello Daily Choice, I have a business enquiry."
);


// FOOTER AND BUSINESS DETAILS

document.getElementById("currentYear").textContent =
  new Date().getFullYear();

document.getElementById("fssaiNumber").textContent =
  SITE_CONFIG.fssaiNumber;


// INITIALIZE WEBSITE

renderProducts();
updateCart();

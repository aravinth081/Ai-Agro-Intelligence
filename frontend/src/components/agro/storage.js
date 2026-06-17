const PROFILE_KEY = "agroRisk.profile";
const FEEDBACK_KEY = "agroRisk.feedback";
const CART_KEY = "agroRisk.cart";

export const getProfile = () => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setProfile = (profile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getFeedback = () => {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    return raw ? JSON.parse(raw) : { confidenceWeight: 1 };
  } catch {
    return { confidenceWeight: 1 };
  }
};

export const setFeedback = (feedback) => {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));
};

export const getCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const setCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

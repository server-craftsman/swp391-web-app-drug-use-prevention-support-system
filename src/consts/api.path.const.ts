export const API_PATH = {
  AUTH: {
    LOGIN: "/auth/",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    CONFIRM_EMAIL: "/auth/confirm-email",
    REQUEST_PASSWORD_RESET: "/auth/request-password-reset",
    RESET_PASSWORD: "/auth/reset-password",
  },
  USER: {
    GET_USER_PROFILE: "/user/profile",
    UPDATE_USER_PROFILE: "/user/profile/update",
    CHANGE_PASSWORD: "/user/password/change",
    GET_USER_BY_ID: (id: string) => `/user/${id}`,
  },
  PRODUCT: {
    GET_ALL_PRODUCTS: "/products",
    GET_PRODUCT_BY_ID: (id: string) => `/products/${id}`,
    CREATE_PRODUCT: "/products/create",
    UPDATE_PRODUCT: (id: string) => `/products/update/${id}`,
    DELETE_PRODUCT: (id: string) => `/products/delete/${id}`,
  },
  BLOG: {
    GET_ALL_BLOGS: "/blog",
    CREATE_BLOG: "/blog/create",
  },
};

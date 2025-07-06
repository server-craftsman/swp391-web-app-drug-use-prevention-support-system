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
    GET_USERS: "/user",
    GET_USER_PROFILE: "/user/profile",
    UPDATE_USER_PROFILE: "/user/profile",
    CHANGE_PASSWORD: "/user/password/change",
    GET_USER_BY_ID: (id: string) => `/user/${id}`,
    DELETE_USER: (id: string) => `/user/${id}`,
    CREATE_USER: "/user/create",
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
    DELETE_BLOG: (id: string) => `/blog/${id}`,
    UPDATE_BLOG: (id: string) => `/blog/${id}`,
  },
  APPOINTMENT: {
    CREATE_APPOINTMENT: "/appointments/book",
    SEARCH_APPOINTMENT: "/appointments/search",
    CHANGE_STATUS: (appointmentId: string, newStatus: string) =>
      `/appointments/status?appointmentId=${appointmentId}&newStatus=${newStatus}`,
    ASSIGN_CONSULTANT: "/appointments/assign",
    CANCEL_APPOINTMENT: (appointmentId: string) =>
      `/appointments/cancel/${appointmentId}`,
  },
  COURSE: {
    GET_ALL_COURSES: "/Course",
    CREATE_COURSE: "/course/create",
    UPDATE_COURSE: (id: string) => `/course/${id}`,
    DELETE_COURSE: (id: string) => `/course/${id}`,
    GET_COURSE_BY_ID: (id: string) => `/Course/${id}`,
  },
  CONSULTANT: {
    GET_ALL_CONSULTANTS: "/consultant",
    CREATE_CONSULTANT: "/consultant/create",
    UPDATE_CONSULTANT: (id: string) => `/consultant/update/${id}`,
    DELETE_CONSULTANT: (id: string) => `/consultant/${id}`,
    GET_CONSULTANT_BY_ID: (id: string) => `/consultant/${id}`,
  },
  CATEGORY: {
    GET_ALL_CATEGORIES: "/category",
    CREATE_CATEGORY: "/category/create",
  },
  CART: {
    GET_CART: "/cart/myCart",
    ADD_CART_ITEM: "/cart/addCourse",
    DELETE_CART_ITEM: (cartItemId: string) => `/cart/remove/${cartItemId}`,
  },
  SESSION: {
    GET_ALL_SESSIONS: "/session/all",
    CREATE_SESSION: "/session",
    UPDATE_SESSION: (id: string) => `/session/${id}`,
    DELETE_SESSION: (id: string) => `/session/${id}`,
    GET_SESSION_BY_COURSE_ID: (courseId: string) =>
      `/session/course/${courseId}`,
  },
  LESSON: {
    GET_ALL_LESSONS: "/lesson/paged",
    CREATE_LESSON: "/lesson",
    UPDATE_LESSON: (id: string) => `/lesson/${id}`,
    DELETE_LESSON: (id: string) => `/lesson/${id}`,
    GET_LESSON_BY_SESSION_ID: (sessionId: string) =>
      `/lesson/session/${sessionId}`,
  },
  PROGRAM: {
    GET_ALL_PROGRAMS: "/program",
    CREATE_PROGRAM: "/program/create",
    UPDATE_PROGRAM: (id: string) => `/program/${id}`,
    DELETE_PROGRAM: (id: string) => `/program/${id}`,
    GET_PROGRAM_BY_ID: (id: string) => `/program/${id}`,

  },
  ORDER: {
    GET_ORDERS: "/order/all",
    CREATE_ORDER: "/order/createOrderFromCart",
    GET_ORDER_BY_ID: (orderId: string) => `/order/${orderId}`,
    CHANGE_ORDER_STATUS: (orderId: string, newStatus: string) =>
      `/order/status/${orderId}/${newStatus}`,
  },
  PAYMENT: {
    CREATE_PAYMENT: "/payment/createPaymentFromOrder",
  },
  REVIEW: {
    GET_ALL_REVIEWS: "/review",
    GET_REVIEW_BY_ID: (id: string) => `/review/${id}`,
    CREATE_REVIEW: "/review/create",
    DELETE_REVIEW: (id: string) => `/review/${id}`,
  },
};

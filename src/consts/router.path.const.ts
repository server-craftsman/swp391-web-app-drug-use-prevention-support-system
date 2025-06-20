export const ROUTER_URL = {
  AUTH: {
    LOGIN: "/login",
    SIGN_UP: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    VERIFY_EMAIL: "/verify-email",
    CONFIRM_EMAIL: "/confirm-email",
    UNAUTHOZIZED: "/unauthorized",
  },
  ADMIN: {
    BASE: "/admin",
    OVERVIEW: "/admin/overview",
    USERS: "/admin/users",
    SETTINGS: "/admin/settings",
    MANAGER_BLOG: "/admin/manager-blog",
  },
  CONSULTANT: {
    BASE: "/consultant",
    OVERVIEW: "/consultant/overview",
    USERS: "/consultant/users",
    SETTINGS: "/consultant/settings",
  },
  COMMON: {
    HOME: "/",
    ABOUT: "/about",
    CONTACT: "/contact",
    FAQ: "/faq",
    COVER: "/cover",
  },
  CLIENT: {
    COURSE: "/courses",
    COURSE_DETAIL: "/courses/:courseId",
    BLOG: "/blog",
    COUNSEL: "/counseling",
    COMMUNITY: "/community",
    ASSESSMENT: "/assessment",
  },
};

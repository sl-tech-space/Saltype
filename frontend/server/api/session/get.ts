import { defineEventHandler } from "h3";

export default defineEventHandler((event) => {
  const user = event.context.session.user;

  if (user) {
    return {
      user: user,
      message: "User session retrieved successfully",
    };
  } else {
    return {
      message: "No user session found",
    };
  }
});

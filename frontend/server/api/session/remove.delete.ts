import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {

  event.context.session = null;

  return { success: true, message: "Session deleted successfully" };
});
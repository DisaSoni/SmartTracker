export const isEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const ADMIN = "admin";
const VIEWER = "viewer";

export const isAdmin = (type) => type === ADMIN;
export const isViewer = (type) => type === VIEWER;
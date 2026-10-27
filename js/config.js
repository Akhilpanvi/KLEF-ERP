// Where the backend (KLEF-ERP-Backend) is deployed. Change BACKEND after deploying it.
const BACKEND = "https://klef-erp-backend.vercel.app";
export const API = ["localhost", "127.0.0.1"].includes(location.hostname) ? "http://localhost:3000" : BACKEND;

// src/services/notify.js
import { toast } from "react-hot-toast"; // or whatever toast library you use

export const notify = (message, type = "success") => {
  if (type === "success") toast.success(message);
  else if (type === "error") toast.error(message);
  else toast(message);
};
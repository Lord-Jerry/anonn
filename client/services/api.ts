import axios from "axios";

export default (token?: string) =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    timeout: 10000,
    headers: { Authorization: token ? `Bearer ${token}` : undefined },
  });

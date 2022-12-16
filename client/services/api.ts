import axios from "axios";

export default (token?: string) =>
  axios.create({
    baseURL: "http://localhost:4000",
    timeout: 3000,
    headers: { Authorization: token ? `Bearer ${token}` : undefined },
  });

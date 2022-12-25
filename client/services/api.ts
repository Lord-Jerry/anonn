import axios from "axios";

export default (token?: string) =>
  axios.create({
    baseURL: "https://api.anonn.xyz/",
    timeout: 3000,
    headers: { Authorization: token ? `Bearer ${token}` : undefined },
  });

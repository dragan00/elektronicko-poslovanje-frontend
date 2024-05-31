// Axios
import axios from "axios";
import { getApiEndpoint } from "./endpoints";

// Instance
const instance = (options) =>
  axios.create({
    baseURL: getApiEndpoint() + "transport/",
    timeout: 15000,
    headers: {
      Authorization: "Token " + options.token,
    },
  });

export default instance;

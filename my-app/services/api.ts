import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.2.101:3001/api/tracks", 
  timeout: 10000, 
});

import { env } from "@all-chat/env/web";

export const API_URL = env.VITE_SERVER_URL;

export const USER_ID = localStorage.getItem("uid") as string;

import { io } from "socket.io-client";
import { API_URL } from "../constant";

// Single, app-wide socket connection. Import this everywhere instead of
// calling io() inside a component (which would open a new connection per render).
export const socket = io(API_URL, { autoConnect: true });

// File: fetch-quest/src/socket.js

import { io } from 'socket.io-client';

// 1. Set your LIVE backend URL here
const PRODUCTION_URL = "https://fetchquest-backend.onrender.com";

// 2. Set your LOCAL backend URL here
const DEVELOPMENT_URL = "http://localhost:8000";

// 3. This logic automatically chooses the correct URL
const SERVER_URL = import.meta.env.PROD ? PRODUCTION_URL : DEVELOPMENT_URL;

// Create the socket instance
export const socket = io(SERVER_URL, {
    autoConnect: false,
});
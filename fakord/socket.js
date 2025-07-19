"use client";

import { io } from "socket.io-client";

export const socket = io("http://localhost:3000",{
    // Pour pouvoir se reconnecter
    autoConnect: true,
    // pour autoriser les cookies dans le cas où je les ajouterai après
    withCredentials:true,
});

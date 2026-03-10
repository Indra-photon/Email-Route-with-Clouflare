"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

/**
 * AgentPresenceProvider
 *
 * Maintains a persistent Socket.io connection at the dashboard level
 * so the agent is registered as "online" for ALL their chat widgets,
 * regardless of which dashboard page they're on.
 *
 * Without this, agents only appear "online" to visitors when they're
 * inside a specific conversation page.
 *
 * This component renders nothing — it only manages the socket lifecycle.
 */
export default function AgentPresenceProvider() {
    const socketRef = useRef<Socket | null>(null);
    const joinedRef = useRef(false);

    const renderServerUrl = process.env.NEXT_PUBLIC_RENDER_CHAT_SERVER_URL || "";

    useEffect(() => {
        if (!renderServerUrl) return;

        let socket: Socket | null = null;
        let mounted = true;

        async function init() {
            // 1. Fetch the WS secret (agent auth)
            let secret = "";
            try {
                const tokenRes = await fetch("/api/chat/ws-token");
                if (tokenRes.ok) {
                    const tokenData = await tokenRes.json();
                    secret = tokenData.secret || "";
                }
            } catch {
                // Silent — will retry on reconnect
                return;
            }

            if (!secret || !mounted) return;

            // 2. Fetch all widget keys for this workspace
            let keys: string[] = [];
            try {
                const keysRes = await fetch("/api/chat/widgets/keys");
                if (keysRes.ok) {
                    const keysData = await keysRes.json();
                    keys = keysData.keys || [];
                }
            } catch {
                return;
            }

            if (keys.length === 0 || !mounted) return;

            // 3. Connect to the Render chat server
            socket = io(renderServerUrl, {
                transports: ["websocket"],
                reconnectionAttempts: Infinity,
                reconnectionDelay: 5000,
            });
            socketRef.current = socket;

            socket.on("connect", () => {
                if (!mounted) return;
                // Register as online for all widgets at once
                socket!.emit("join_presence", { keys, secret });
                joinedRef.current = true;
            });

            socket.on("disconnect", () => {
                joinedRef.current = false;
            });
        }

        init();

        return () => {
            mounted = false;
            if (socket) {
                socket.disconnect();
                socketRef.current = null;
            }
        };
    }, [renderServerUrl]);

    // This component renders nothing
    return null;
}

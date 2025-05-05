import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { GetRoomMessagesResponse } from "../http/get-room-messages";

interface useMessageWebSocketsParams {
  roomId: string;
}

type WebhookMessage = 
  | { kind: "message_created"; value: { id: string, message: string }; }
  | { kind: "message_answered"; value: { id: string }; }
  | { kind: "message_reaction_increased"; value: { id: string; count: number }; }
  | { kind: "message_reaction_decreased"; value: { id: string; count: number }; }

export function useMessageWebSockets({ roomId }: useMessageWebSocketsParams) {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (wsRef.current) {
      // Já existe uma conexão, não faz sentido abrir outra
      return;
    }

    let reconnectInterval: number | null = null; // Alteração para `number`

    const connectWebSocket = () => {
      wsRef.current = new WebSocket(`ws://localhost:8080/subscribe/${roomId}`);

      wsRef.current.onopen = () => {
        console.log("WebSocket connection opened");
        if (reconnectInterval) {
          clearInterval(reconnectInterval);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log("WebSocket connection closed:", event);
        // Tenta reconectar a cada 5 segundos
        reconnectInterval = window.setInterval(() => {
          connectWebSocket();
        }, 5000);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        if (wsRef.current) {
          wsRef.current.close(); // Fechar conexão se houver erro
        }
      };

      wsRef.current.onmessage = (event) => {
        const data: WebhookMessage = JSON.parse(event.data);

        switch (data.kind) {
          case "message_created":
            queryClient.setQueryData<GetRoomMessagesResponse>(["messages", roomId], (state) => {
              return {
                messages: [
                  ...(state?.messages ?? []),
                  {
                    id: data.value.id,
                    text: data.value.message,
                    amountOfReactions: 0,
                    answered: false,
                  },
                ],
              };
            });
            break;
          case "message_answered":
            queryClient.setQueryData<GetRoomMessagesResponse>(["messages", roomId], (state) => {
              if (!state) return undefined;

              return {
                messages: state?.messages.map((item) => {
                  if (item.id === data.value.id) {
                    return { ...item, answered: true };
                  }
                  return item;
                }),
              };
            });
            break;
          case "message_reaction_increased":
          case "message_reaction_decreased":
            queryClient.setQueryData<GetRoomMessagesResponse>(["messages", roomId], (state) => {
              if (!state) return undefined;

              return {
                messages: state?.messages.map((item) => {
                  if (item.id === data.value.id) {
                    return { ...item, amountOfReactions: data.value.count };
                  }
                  return item;
                }),
              };
            });
            break;
        }

        console.log(data);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close(); // Fechar somente se estiver aberto
      }
      if (reconnectInterval) {
        clearInterval(reconnectInterval);
      }
    };
  }, [roomId, queryClient]); // Adicionando queryClient às dependências

}

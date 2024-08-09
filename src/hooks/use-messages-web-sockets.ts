import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { GetRoomMessagesResponse } from "../http/get-room-messages";

interface useMessageWebSocketsParams {
  roomId: string;
}

type WebhookMessage = 
| {kind: "message_created"; value: {id: string, message: string};}
| {kind: "message_answered"; value: {id: string};}
| {kind: "message_reaction_increased"; value: {id: string; count: number};}
| {kind: "message_reaction_decreased"; value: {id: string; count: number};}

export function useMessageWebSockets({ roomId }: useMessageWebSocketsParams) {
  const queryClient = useQueryClient();
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/subscribe/${roomId}`);

    ws.onopen = () => {
      console.log("connection opened");
    };

    ws.onclose = () => {
      console.log("connection closed");
    };

    ws.onmessage = (event) => {
      const data: WebhookMessage = JSON.parse(event.data);

      //metodo setQueryData substitui a query feita anteriormente e retorna o que vai ser exibido na lita
      switch (data.kind) {
        case "message_created":
          //permite atualizar os dados de uma requisição que aconteceu anteriormente
          queryClient.setQueryData<GetRoomMessagesResponse>(["messages", roomId], (state) => {
            console.log(state);

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
            if (!state) {
              return undefined;
            }

            return {
              messages: state?.messages.map((item) => {
                if (item.id === data.value.id) {
                  return { ...item, answered: true };
                }
              }),
            };
          });
          break;
        case "message_reaction_increased":
        case "message_reaction_decreased":
          queryClient.setQueryData<GetRoomMessagesResponse>(["messages", roomId], (state) => {
            if (!state) {
              return undefined;
            }

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

    return () => {
      ws.close();
    };
  }, [roomId]);
}

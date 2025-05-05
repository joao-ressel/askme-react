type GetRoomMessagesRequest = {
  roomId: string;
};

type RoomMessageResponse = {
  id: string;
  room_id: string;
  message: string;
  reaction_count: number;
  answered: boolean;
};

export type GetRoomMessagesResponse = {
  messages: {
    id: string;
    text: string;
    amountOfReactions: number;
    answered: boolean;
  }[];
};

export async function getRoomMessages({ roomId }: GetRoomMessagesRequest): Promise<GetRoomMessagesResponse> {
  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/rooms/${roomId}/messages`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro ao buscar mensagens:", errorText);
    throw new Error("Erro ao buscar mensagens da sala.");
  }

  const data: RoomMessageResponse[] = await response.json();

  return {
    messages: data.map((item) => ({
      id: item.id,
      text: item.message,
      amountOfReactions: item.reaction_count,
      answered: item.answered,
    })),
  };
}

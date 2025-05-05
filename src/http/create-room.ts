interface CreateRoomRequest {
  theme: string;
}

export async function createRoom({ theme }: CreateRoomRequest) {
  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ theme }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Erro na API:", text);
    throw new Error("Erro ao criar sala");
  }

  const data: { id: string } = await response.json();
  return { id: data.id };
}
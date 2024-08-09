import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import amaLogo from "../assets/logo.png";
import { createRoom } from "../http/create-room";
import { toast } from "sonner";

export function CreateRoom() {
  const navigate = useNavigate();

  async function handleCreateRoom(data: FormData) {
    const theme = data.get("theme")?.toString();

    if (!theme) {
      return;
    }

    try {
      const { roomId } = await createRoom({ theme });
      console.log(theme);
      navigate(`/room/${roomId}`);
    } catch {
      toast.error("Falha ao criar sala");
    }
  }
  return (
    <main className="h-screen flex items-center justify-center px-4">
      <div className="max-w-[450px] flex flex-col gap-6 items-center">
        <img src={amaLogo} alt="AMA" className="w-10" />
        <p className="leading-relaxed text-zinc-300 text-center">
          Crie uma sala pública de AMA (Ask me anything) e priorize as perguntas mais importantes
          para a comunidade.
        </p>

        <form
          action={handleCreateRoom}
          className="focus-within:ring-1 ring-orange-400 ring-offset-2  bg-zinc-900 flex w-[100%] items-center gap-2 p-2 rounded-xl border border-zinc-800"
        >
          <input
            className="bg-transparent text-sm flex-1 mx-1 outline-none text-zinc-100 placeholder:text-zinc-500"
            type="text"
            name="theme"
            autoComplete="off"
            placeholder="Nome da sala"
            required
          />
          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-500 transition-colors text-orange-950 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm"
          >
            Criar sala <ArrowRight className="size-4" />
          </button>
        </form>
      </div>
    </main>
  );
}

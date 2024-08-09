import { ArrowRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { createMessage } from "../http/create-message";
import { toast } from "sonner";

export function CreateMessageForm() {
  const { roomId } = useParams();
  if (!roomId) {
    throw new Error("Messages components must be used within room page");
  }

  async function createMessageAction(data: FormData) {
    const message = data.get("message")?.toString();

    if (!message || !roomId) {
      return;
    }

    try {
      await createMessage({ message, roomId });
    } catch {
      toast.error("Falha ao enviar pergunta, tente novamente!");
    }
  }

  return (
    <form
      action={createMessageAction}
      className="focus-within:ring-1 ring-orange-400 ring-offset-2  bg-zinc-900 flex w-full items-center gap-2 p-2 rounded-xl border border-zinc-800"
    >
      <input
        className="bg-transparent text-sm flex-1 mx-1 outline-none text-zinc-100 placeholder:text-zinc-500"
        type="text"
        name="theme"
        autoComplete="off"
        placeholder="Qual sua pergunta"
      />
      <button
        type="submit"
        className="bg-orange-400 hover:bg-orange-500 transition-colors text-orange-950 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm"
      >
        Criar pergunta <ArrowRight className="size-4" />
      </button>
    </form>
  );
}

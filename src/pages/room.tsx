import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { ArrowRight, Share2 } from "lucide-react";

import amaLogo from "../assets/logo.png";
import { Message } from "../components/message";

export function Room() {
  const { roomId } = useParams();

  function handleShareRoom() {
    const url = window.location.href.toString();

    if (navigator.share != undefined && navigator.canShare()) {
      navigator.share({ url });
    } else {
      navigator.clipboard.writeText(url);
      toast("Copiado!");
    }
  }

  return (
    <div className="mx-auto max-w-[640px] flex flex-col gap-6 py-10 px-4">
      <div className="flex items-center gap-3 px-3">
        <img src={amaLogo} alt="AMA" className="h-5" />

        <span className="text-sm text-zinc-500 truncate">
          Código da sala: <span className="text-zinc-300">{roomId}</span>
        </span>

        <button
          type="submit"
          onClick={handleShareRoom}
          className="ml-auto bg-zinc-800 text-zinc-300 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm transition-colors hover:bg-zinc-500"
        >
          Compartilhar
          <Share2 className="size-4" />
        </button>
      </div>

      <div className="h-px w-full bg-zinc-900" />
      <form className="focus-within:ring-1 ring-orange-400 ring-offset-2  bg-zinc-900 flex w-full items-center gap-2 p-2 rounded-xl border border-zinc-800">
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

      <ol className="list-decimal list-outsid px-3 space-y-8">
        <Message
          text="O que é GoLang e quais são suas principais vantagens em comparação com outras linguagens de programação como Python, Java ou C++?"
          amountOfReactions={100}
          answered
        />
        <Message
          text="Como funcionam as goroutines em GoLang e por que elas são importantes para a concorrência e paralelismo?"
          amountOfReactions={50}
        />
        <Message
          text="Quais são as melhores práticas para organizar o código em um projeto GoLang, incluindo pacotes, módulos e a estrutura de diretórios?"
          amountOfReactions={10}
        />
      </ol>
    </div>
  );
}

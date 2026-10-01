const input = document.querySelector("textarea");
const botaoEnviar = document.querySelector(".send");
const chat = document.querySelector(".chat");

let aguardandoConfirmacao = false;

function adicionarMensagem(texto) {
    const novaMensagem = document.createElement("p");
    novaMensagem.textContent = texto;
    chat.appendChild(novaMensagem);
}

async function enviarMensagem() {
    const mensagem = input.value.trim();

    if (mensagem === "") {
        return;
    }

    adicionarMensagem(mensagem);
    input.value = "";

    const comando = mensagem.toLowerCase();

    if (aguardandoConfirmacao) {
        if (comando === "sim") {
            aguardandoConfirmacao = false;

            adicionarMensagem("🧹 Limpando arquivos temporários...");

            const resultado =
                await window.electronAPI.limparTemporarios();

            adicionarMensagem(resultado);
            return;
        }

        aguardandoConfirmacao = false;
        adicionarMensagem("❌ Operação cancelada.");
        return;
    }

    let resposta = null;

    if (comando === "ver espaço") {
        resposta = await window.electronAPI.verEspaco();

    } else if (comando === "ver memória") {
        resposta = await window.electronAPI.verMemoria();

    } else if (comando === "ver sistema") {
        resposta = await window.electronAPI.verSistema();

    } else if (comando === "ver segurança") {
        resposta = await window.electronAPI.verSeguranca();

    } else if (comando === "ver limpeza") {
        resposta = await window.electronAPI.verLimpeza();

    } else if (
        comando === "limpar temporários" ||
        comando === "fazer limpeza"
    ) {
        const limpeza =
            await window.electronAPI.verLimpeza();

        resposta =
            limpeza +
            "\n\n" +
            "⚠️ Posso tentar remover esses arquivos.\n" +
            "Digite \"sim\" para confirmar.";

        aguardandoConfirmacao = true;

    } else if (comando === "ver rede") {
        resposta = await window.electronAPI.verRede();

    } else if (comando === "ver firewall") {
        resposta = await window.electronAPI.verFirewall();

    } else if (
        comando === "verificar vírus" ||
        comando === "verificar virus" ||
        comando === "verificar malware"
    ) {
        resposta =
            await window.electronAPI.verificarVirus();

    } else if (comando === "diagnóstico" || comando === "diagnostico") {
        const resultado =
            await window.electronAPI.diagnostico();

        resposta = resultado.mensagem;

    } else {
        resposta =
            "❓ Não conheço esse comando ainda.";
    }

    if (resposta) {
        adicionarMensagem(resposta);
    }
}

botaoEnviar.addEventListener("click", enviarMensagem);

input.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" && !evento.shiftKey) {
        evento.preventDefault();
        enviarMensagem();
    }
});
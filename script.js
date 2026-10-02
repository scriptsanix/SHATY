const input = document.querySelector("textarea");
const botaoEnviar = document.querySelector(".send");
const chat = document.querySelector(".chat");

let aguardandoConfirmacao = false;


/* ============================= */
/*       SCROLL AUTOMÁTICO       */
/* ============================= */

function rolarParaBaixo() {

    chat.scrollTo({
        top: chat.scrollHeight,
        behavior: "smooth"
    });
}


function estaNoFinal() {

    const distancia =
        chat.scrollHeight -
        chat.scrollTop -
        chat.clientHeight;

    return distancia < 80;
}


/* ============================= */
/*       ADICIONAR MENSAGEM      */
/* ============================= */

function adicionarMensagem(texto) {

    const estavaNoFinal =
        estaNoFinal();

    const novaMensagem =
        document.createElement("p");

    novaMensagem.textContent = texto;

    chat.appendChild(novaMensagem);


    if (estavaNoFinal) {

        rolarParaBaixo();
    }


    return novaMensagem;
}


/* ============================= */
/*      COMANDO RÁPIDO            */
/* ============================= */

function detectarComandoRapido(mensagem) {

    const comando =
        mensagem
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();


    /* ============================= */
    /*        DATA E HORA             */
    /* ============================= */

    if (
        comando.includes("data de hoje") ||
        comando.includes("data hoje") ||
        comando.includes("dia de hoje") ||
        comando === "que dia e hoje" ||
        comando === "que dia e hoje?" ||
        comando.includes("que horas sao") ||
        comando.includes("que horas e") ||
        comando.includes("horario agora")
    ) {

        return "DATA_HORA";
    }


    /* ============================= */
    /*           MEMÓRIA              */
    /* ============================= */

    if (
        comando.includes("quanto de ram") ||
        comando.includes("quanta ram") ||
        comando.includes("memoria ram") ||
        comando.includes("quanto de memoria") ||
        comando.includes("quanta memoria")
    ) {

        return "MEMORIA";
    }


    /* ============================= */
    /*           SISTEMA              */
    /* ============================= */

    if (
        comando.includes("qual meu processador") ||
        comando.includes("qual e meu processador") ||
        comando.includes("qual meu sistema") ||
        comando.includes("especificacoes do pc") ||
        comando.includes("configuracao do pc")
    ) {

        return "SISTEMA";
    }


    /* ============================= */
    /*             DISCO              */
    /* ============================= */

    if (
        comando.includes("quanto espaco") ||
        comando.includes("espaco no hd") ||
        comando.includes("espaco no disco") ||
        comando.includes("quanto tenho de espaco")
    ) {

        return "DISCO";
    }


    /* ============================= */
    /*             REDE               */
    /* ============================= */

    if (
        comando.includes("como ta minha internet") ||
        comando.includes("como esta minha internet") ||
        comando.includes("minha internet") ||
        comando.includes("qual meu ip") ||
        comando.includes("informacoes da rede")
    ) {

        return "REDE";
    }


    /* ============================= */
    /*          SEGURANÇA             */
    /* ============================= */

    if (
        comando.includes("windows defender") ||
        comando.includes("defender") ||
        comando.includes("seguranca do windows") ||
        comando.includes("como esta minha protecao")
    ) {

        return "SEGURANCA";
    }


    /* ============================= */
    /*           FIREWALL             */
    /* ============================= */

    if (
        comando.includes("firewall") ||
        comando.includes("como esta o firewall")
    ) {

        return "FIREWALL";
    }


    /* ============================= */
    /*             VÍRUS              */
    /* ============================= */

    if (
        comando.includes("verificar virus") ||
        comando.includes("verifica virus") ||
        comando.includes("tenho virus") ||
        comando.includes("verificar malware") ||
        comando.includes("tenho malware")
    ) {

        return "VIRUS";
    }


    /* ============================= */
    /*            LIMPEZA             */
    /* ============================= */

    if (
        comando.includes("limpar temporarios") ||
        comando.includes("limpeza no pc") ||
        comando.includes("fazer limpeza") ||
        comando.includes("limpar o pc")
    ) {

        return "LIMPEZA";
    }


    return null;
}


/* ============================= */
/*      EXECUTAR INTENÇÃO        */
/* ============================= */

async function executarIntencao(
    intencao,
    mensagem
) {

    switch (intencao) {


        case "DATA_HORA":

            return await window.electronAPI
                .verDataHora();


        case "MEMORIA":

            return await window.electronAPI
                .verMemoria();


        case "SISTEMA":

            return await window.electronAPI
                .verSistema();


        case "DISCO":

            return await window.electronAPI
                .verEspaco();


        case "SEGURANCA":

            return await window.electronAPI
                .verSeguranca();


        case "REDE":

            return await window.electronAPI
                .verRede();


        case "FIREWALL":

            return await window.electronAPI
                .verFirewall();


        case "VIRUS":

            return await window.electronAPI
                .verificarVirus();


        case "LIMPEZA": {

            const limpeza =
                await window.electronAPI
                    .verLimpeza();


            return (
                limpeza +
                "\n\n" +
                "⚠️ Posso tentar remover esses arquivos.\n" +
                'Digite "sim" para confirmar.'
            );
        }


        default:

            return null;
    }
}


/* ============================= */
/*        ENVIAR MENSAGEM        */
/* ============================= */

async function enviarMensagem() {

    const mensagem =
        input.value.trim();


    if (mensagem === "") {

        return;
    }


    /* ============================= */
    /*      MOSTRA MENSAGEM USUÁRIO  */
    /* ============================= */

    adicionarMensagem(mensagem);

    input.value = "";


    /* ============================= */
    /*      CONFIRMAÇÃO LIMPEZA      */
    /* ============================= */

    const comando =
        mensagem
            .toLowerCase()
            .trim();


    if (aguardandoConfirmacao) {


        if (comando === "sim") {

            aguardandoConfirmacao = false;


            adicionarMensagem(
                "🧹 Limpando arquivos temporários..."
            );


            const resultado =
                await window.electronAPI
                    .limparTemporarios();


            adicionarMensagem(
                resultado
            );


            return;
        }


        aguardandoConfirmacao = false;


        adicionarMensagem(
            "❌ Operação cancelada."
        );


        return;
    }


    /* ============================= */
    /*     PRIMEIRA TENTATIVA        */
    /* ============================= */

    let intencao =
        detectarComandoRapido(
            mensagem
        );


    console.log(
        "⚡ Comando rápido:",
        intencao
    );


    /* ============================= */
    /*      EXECUTA COMANDO          */
    /* ============================= */

    if (intencao !== null) {

        const resposta =
            await executarIntencao(
                intencao,
                mensagem
            );


        if (intencao === "LIMPEZA") {

            aguardandoConfirmacao = true;
        }


        adicionarMensagem(
            resposta
        );


        return;
    }


    /* ============================= */
    /*       GEMMA CLASSIFICADOR     */
    /* ============================= */

    const carregando =
        adicionarMensagem(
            "..."
        );


    intencao =
        await window.electronAPI
            .identificarIntencao(
                mensagem
            );


    console.log(
        "🧠 Gemma classificou:",
        intencao
    );


    /* ============================= */
    /*       EXECUTA FERRAMENTA      */
    /* ============================= */

    const resposta =
        await executarIntencao(
            intencao,
            mensagem
        );


    if (resposta !== null) {

        carregando.remove();


        if (intencao === "LIMPEZA") {

            aguardandoConfirmacao = true;
        }


        adicionarMensagem(
            resposta
        );


        return;
    }


    /* ============================= */
    /*        CONVERSA NORMAL        */
    /* ============================= */

    const respostaIA =
        await window.electronAPI
            .falarComIA(
                mensagem
            );


    carregando.remove();


    adicionarMensagem(
        respostaIA
    );
}


/* ============================= */
/*            EVENTOS             */
/* ============================= */

botaoEnviar.addEventListener(
    "click",
    enviarMensagem
);


input.addEventListener(
    "keydown",
    (evento) => {

        if (
            evento.key === "Enter" &&
            !evento.shiftKey
        ) {

            evento.preventDefault();

            enviarMensagem();
        }
    }
);

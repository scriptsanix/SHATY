const { app, BrowserWindow, ipcMain } = require("electron");
const { exec, execFile } = require("child_process");
const os = require("os");


/* ============================= */
/*           CONFIG              */
/* ============================= */

const MODELO = "gemma3:4b";
const OLLAMA = "http://localhost:11434/api/chat";


/* ============================= */
/*           JANELA              */
/* ============================= */

function criarJanela() {

    const janela = new BrowserWindow({

        width: 360,
        height: 480,

        frame: false,
        transparent: true,
        resizable: true,

        icon: __dirname + "/icon.ico",

        webPreferences: {
            preload: __dirname + "/preload.js",
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    janela.loadFile("index.html");
}


/* ============================= */
/*        EXECUTAR COMANDO       */
/* ============================= */

function executar(comando) {

    return new Promise((resolve, reject) => {

        exec(comando, (erro, stdout) => {

            if (erro) reject(erro);
            else resolve(stdout);
        });
    });
}


/* ============================= */
/*          FUNÇÕES DO PC        */
/* ============================= */

async function verEspaco() {

    try {

        return await executar(
            "wmic logicaldisk get size,freespace,caption"
        );

    } catch {

        return "❌ Não consegui verificar o espaço.";
    }
}


function verMemoria() {

    const total = os.totalmem();
    const livre = os.freemem();

    const gb = valor =>
        (valor / 1024 ** 3).toFixed(2);

    const usada = gb(total - livre);

    return (
        "🧠 Memória RAM\n\n" +
        `Total: ${gb(total)} GB\n` +
        `Usada: ${usada} GB\n` +
        `Livre: ${gb(livre)} GB`
    );
}


function verSistema() {

    const cpu = os.cpus();

    return (
        "💻 Sistema\n\n" +
        `Sistema: ${os.type()}\n` +
        `Versão: ${os.release()}\n` +
        `Arquitetura: ${os.arch()}\n` +
        `Processador: ${cpu[0].model}\n` +
        `Núcleos: ${cpu.length}`
    );
}


async function verSeguranca() {

    try {

        const resultado = await executar(
            'powershell -Command "Get-MpComputerStatus | Select-Object AntivirusEnabled,RealTimeProtectionEnabled"'
        );

        return "🛡️ Segurança do Windows\n\n" + resultado;

    } catch {

        return "❌ Não consegui verificar o Windows Defender.";
    }
}


async function verLimpeza() {

    try {

        const resultado = await executar(
            'powershell -Command "$paths=@($env:TEMP, $env:WINDIR\\Temp); foreach($p in $paths){$size=(Get-ChildItem $p -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum; Write-Output \\"$p : $([math]::Round($size/1GB,2)) GB\\"}"'
        );

        return "🧹 Arquivos temporários\n\n" + resultado;

    } catch {

        return "❌ Não consegui verificar os arquivos temporários.";
    }
}


async function limparTemporarios() {

    try {

        await executar(
            'powershell -Command "Remove-Item \\"$env:TEMP\\*\\" -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item \\"$env:WINDIR\\Temp\\*\\" -Recurse -Force -ErrorAction SilentlyContinue"'
        );

        return "✅ Arquivos temporários removidos.";

    } catch {

        return "⚠️ Alguns arquivos não puderam ser removidos.";
    }
}


async function verRede() {

    try {

        return (
            "🌐 Informações da rede\n\n" +
            await executar("ipconfig")
        );

    } catch {

        return "❌ Não consegui verificar a rede.";
    }
}


async function verFirewall() {

    try {

        const resultado = await executar(
            'powershell -Command "Get-NetFirewallProfile | Select-Object Name,Enabled"'
        );

        return "🔥 Firewall\n\n" + resultado;

    } catch {

        return "❌ Não consegui verificar o firewall.";
    }
}


function abrirMRT() {

    return new Promise(resolve => {

        execFile(
            "C:\\Windows\\System32\\MRT.exe",
            erro => {

                resolve(
                    erro
                        ? "❌ Não consegui abrir a Ferramenta de Remoção de Software Mal-Intencionado."
                        : "🛡️ Ferramenta de Remoção de Software Mal-Intencionado aberta."
                );
            }
        );
    });
}


function diagnostico() {

    return {

        mensagem:
            "🔧 Diagnóstico do sistema\n\n" +
            verMemoria() +
            "\n\n" +
            verSistema()
    };
}


/* ============================= */
/*          DATA E HORA          */
/* ============================= */

function verDataHora() {

    const agora = new Date();

    const data = agora.toLocaleDateString("pt-BR", {

        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    const hora = agora.toLocaleTimeString("pt-BR");

    return `📅 Hoje é ${data}.\n🕐 Agora são ${hora}.`;
}


/* ============================= */
/*       CLASSIFICADOR IA        */
/* ============================= */

const INTENCOES = [

    "DATA_HORA",
    "MEMORIA",
    "SISTEMA",
    "DISCO",
    "SEGURANCA",
    "LIMPEZA",
    "REDE",
    "FIREWALL",
    "VIRUS",
    "CONVERSA"
];


const PROMPT_CLASSIFICADOR = `

Você é o classificador de intenções do SHATY.

Sua única função é identificar o que o usuário quer fazer.

Responda SOMENTE com uma das opções:

${INTENCOES.join("\n")}

Use:

DATA_HORA para perguntas sobre data e hora.

MEMORIA para perguntas sobre RAM.

SISTEMA para perguntas sobre processador,
Windows ou especificações do computador.

DISCO para perguntas sobre espaço em disco.

SEGURANCA para verificar o Windows Defender
ou proteção do computador.

LIMPEZA para verificar ou limpar arquivos temporários.

REDE para informações da rede ou IP.

FIREWALL para verificar o firewall.

VIRUS para verificar vírus ou abrir a ferramenta
de remoção de software mal-intencionado.

CONVERSA para qualquer conversa normal,
perguntas gerais, explicações ou assuntos que
não correspondam às funções acima.

Exemplos:

"que dia é hoje?" → DATA_HORA
"que horas são?" → DATA_HORA

"quanta memória tenho?" → MEMORIA
"quanto de RAM está sendo usada?" → MEMORIA

"qual meu processador?" → SISTEMA
"quais são as especificações do PC?" → SISTEMA

"quanto espaço tenho no HD?" → DISCO

"o Defender está funcionando?" → SEGURANCA

"faz uma limpeza no PC" → LIMPEZA

"como está minha rede?" → REDE
"qual meu IP?" → REDE

"como está o firewall?" → FIREWALL

"verifica se tenho vírus" → VIRUS

"oi" → CONVERSA
"tudo bem?" → CONVERSA
"quem é você?" → CONVERSA

Nunca responda à pergunta.

Retorne somente o nome da intenção.

`;


async function identificarIntencao(mensagem) {

    try {

        const resposta = await fetch(OLLAMA, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                model: MODELO,

                messages: [

                    {
                        role: "system",
                        content: PROMPT_CLASSIFICADOR
                    },

                    {
                        role: "user",
                        content: mensagem
                    }

                ],

                stream: false
            })
        });


        if (!resposta.ok) {
            return "CONVERSA";
        }


        const dados = await resposta.json();


        console.log(
            "🤖 Gemma respondeu:",
            dados.message.content
        );


        const texto =
            dados.message.content
                .trim()
                .toUpperCase();


        const intencao =
            INTENCOES.find(item =>
                texto.includes(item)
            ) || "CONVERSA";


        console.log(
            "🧠 Intenção:",
            intencao
        );


        return intencao;


    } catch (erro) {

        console.error(
            "❌ Erro no classificador:",
            erro
        );

        return "CONVERSA";
    }
}


/* ============================= */
/*          MEMÓRIA IA           */
/* ============================= */

let historicoConversa = [];


async function falarComIA(mensagem) {

    try {

        historicoConversa.push({

            role: "user",
            content: mensagem
        });


        const mensagens = [

            {

                role: "system",

                content: `

Você é SHATY, um assistente de Desktop.

Seu nome é SHATY.

Responda sempre em português brasileiro.
Converse de forma natural, informal e direta.

Não diga que é ChatGPT ou OpenAI.

Não invente informações.
Se não souber, diga que não sabe.

Nunca invente nomes, músicas, datas,
lugares ou fatos.

`
            },

            ...historicoConversa
        ];


        const resposta = await fetch(OLLAMA, {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                model: MODELO,

                messages: mensagens,

                stream: false
            })
        });


        if (!resposta.ok) {

            return "❌ Não consegui falar com o Gemma.";
        }


        const dados =
            await resposta.json();


        const texto =
            dados.message.content;


        historicoConversa.push({

            role: "assistant",

            content: texto
        });


        historicoConversa =
            historicoConversa.slice(-6);


        return texto;


    } catch (erro) {

        console.error(
            "❌ Erro ao conectar ao Ollama:",
            erro
        );


        return (
            "❌ Não consegui conectar ao Ollama.\n" +
            "Verifique se o Ollama está rodando."
        );
    }
}


/* ============================= */
/*             IPC               */
/* ============================= */

ipcMain.handle(

    "falar-com-ia",

    (evento, mensagem) =>
        falarComIA(mensagem)
);


ipcMain.handle(

    "identificar-intencao",

    (evento, mensagem) =>
        identificarIntencao(mensagem)
);


const funcoesPC = {

    "ver-data-hora": verDataHora,

    "ver-espaco": verEspaco,

    "ver-memoria": verMemoria,

    "ver-sistema": verSistema,

    "ver-seguranca": verSeguranca,

    "ver-limpeza": verLimpeza,

    "limpar-temporarios":
        limparTemporarios,

    "ver-rede": verRede,

    "ver-firewall":
        verFirewall,

    "verificar-virus":
        abrirMRT,

    "diagnostico":
        diagnostico
};


for (
    const [nome, funcao]
    of Object.entries(funcoesPC)
) {

    ipcMain.handle(
        nome,
        funcao
    );
}


/* ============================= */
/*       CONTROLES JANELA        */
/* ============================= */

ipcMain.on(

    "minimizar",

    evento => {

        BrowserWindow
            .fromWebContents(evento.sender)
            .minimize();
    }
);


ipcMain.on(

    "fechar",

    evento => {

        BrowserWindow
            .fromWebContents(evento.sender)
            .close();
    }
);


/* ============================= */
/*            ELECTRON            */
/* ============================= */

app.whenReady()
    .then(criarJanela);

const { app, BrowserWindow, ipcMain } = require("electron");
const { exec, execFile } = require("child_process");
const os = require("os");

function criarJanela() {
    const janela = new BrowserWindow({
        width: 360,
        height: 480,
        resizable: true,
        frame: false,
        transparent: true,

        icon: __dirname + "/icon.ico",

        webPreferences: {
            preload: __dirname + "/preload.js"
        }
    });

    janela.loadFile("index.html");
}

function verEspaco() {
    return new Promise((resolve) => {
        const comando =
            'powershell -NoProfile -Command "Get-PSDrive C | Select-Object @{Name=\\"LivreGB\\";Expression={[math]::Round($_.Free / 1GB, 2)}} | ConvertTo-Json -Compress"';

        exec(comando, (erro, stdout) => {
            if (erro) {
                resolve("❌ Não foi possível verificar o espaço do disco.");
                return;
            }

            try {
                const dados = JSON.parse(stdout);

                resolve(
                    `💿 Você tem ${dados.LivreGB.toString().replace(".", ",")} GB livres no disco C:`
                );
            } catch {
                resolve("❌ Não foi possível interpretar o espaço do disco.");
            }
        });
    });
}

function verMemoria() {
    const total = os.totalmem();
    const livre = os.freemem();

    const totalGB = total / 1024 / 1024 / 1024;
    const usadaGB = (total - livre) / 1024 / 1024 / 1024;

    return Promise.resolve(
        `🧠 RAM: ${usadaGB.toFixed(2)} GB usados de ${totalGB.toFixed(2)} GB.`
    );
}

function verSistema() {
    return Promise.resolve(
        `⚙️ Sistema: ${os.type()} ${os.arch()}\n` +
        `⚙️ Versão: ${os.release()}\n` +
        `⚙️ PC: ${os.hostname()}`
    );
}

function verSeguranca() {
    return new Promise((resolve) => {
        const comando =
            'powershell -NoProfile -Command "Get-MpComputerStatus | Select-Object AntivirusEnabled,RealTimeProtectionEnabled,AntivirusSignatureLastUpdated | ConvertTo-Json -Compress"';

        exec(comando, (erro, stdout) => {
            if (erro) {
                resolve("❌ Não foi possível verificar o Windows Defender.");
                return;
            }

            try {
                const dados = JSON.parse(stdout);

                const antivirus =
                    dados.AntivirusEnabled ? "ativo" : "inativo";

                const tempoReal =
                    dados.RealTimeProtectionEnabled ? "ativa" : "inativa";

                const atualizacao =
                    new Date(dados.AntivirusSignatureLastUpdated)
                        .toLocaleString("pt-BR");

                resolve(
                    `🛡️ Antivírus: ${antivirus}\n` +
                    `🛡️ Proteção em tempo real: ${tempoReal}\n` +
                    `🛡️ Última atualização: ${atualizacao}`
                );
            } catch {
                resolve("❌ Não foi possível interpretar o status do Defender.");
            }
        });
    });
}

function verLimpeza() {
    return new Promise((resolve) => {
        const comando =
            'powershell -NoProfile -Command "Get-ChildItem $env:TEMP -File -ErrorAction SilentlyContinue | Measure-Object Length -Sum | ConvertTo-Json -Compress"';

        exec(comando, (erro, stdout) => {
            if (erro) {
                resolve("❌ Não foi possível verificar os arquivos temporários.");
                return;
            }

            try {
                const dados = JSON.parse(stdout);

                const quantidade = dados.Count || 0;
                const bytes = dados.Sum || 0;
                const mb = bytes / 1024 / 1024;

                resolve(
                    `🧹 Encontrei ${quantidade} arquivos temporários.\n` +
                    `🧹 Eles ocupam aproximadamente ${mb.toFixed(2)} MB.\n` +
                    `⚠️ Nenhum arquivo foi apagado.`
                );
            } catch {
                resolve("❌ Não foi possível interpretar os arquivos temporários.");
            }
        });
    });
}

function limparTemporarios() {
    return new Promise((resolve) => {
        const comando =
            'powershell -NoProfile -Command "Get-ChildItem $env:TEMP -File -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue"';

        exec(comando, (erro) => {
            if (erro) {
                resolve("❌ Não foi possível executar a limpeza.");
                return;
            }

            resolve("🧹 Limpeza dos arquivos temporários concluída.");
        });
    });
}

function verRede() {
    return new Promise((resolve) => {
        const comando =
            'powershell -NoProfile -Command "Get-NetTCPConnection -State Established | Measure-Object | Select-Object -ExpandProperty Count"';

        exec(comando, (erro, stdout) => {
            if (erro) {
                resolve("❌ Não foi possível verificar as conexões de rede.");
                return;
            }

            const quantidade = parseInt(stdout.trim());

            resolve(
                `🌐 Conexões TCP ativas: ${quantidade}\n` +
                `✅ Consulta somente leitura.`
            );
        });
    });
}

function verFirewall() {
    return new Promise((resolve) => {
        const comando =
            'powershell -NoProfile -Command "Get-NetFirewallProfile | Select-Object Name, Enabled | ConvertTo-Json -Compress"';

        exec(comando, (erro, stdout) => {
            if (erro) {
                resolve("❌ Não foi possível verificar o Firewall.");
                return;
            }

            try {
                let dados = JSON.parse(stdout);

                if (!Array.isArray(dados)) {
                    dados = [dados];
                }

                let resposta = "🛡️ FIREWALL\n";

                dados.forEach((perfil) => {
                    const estado = perfil.Enabled
                        ? "ativo"
                        : "inativo";

                    resposta +=
                        `🛡️ ${perfil.Name}: ${estado}\n`;
                });

                resposta += "✅ Consulta somente leitura.";

                resolve(resposta);
            } catch {
                resolve("❌ Não foi possível interpretar o Firewall.");
            }
        });
    });
}

function abrirMRT() {
    return new Promise((resolve) => {
        const caminho =
            process.env.WINDIR + "\\System32\\mrt.exe";

        execFile(caminho, [], (erro) => {
            if (erro) {
                resolve(
                    "❌ Não foi possível abrir a Ferramenta de Remoção de Software Mal-Intencionado do Windows."
                );
                return;
            }

            resolve(
                "🦠 Ferramenta de Remoção de Software Mal-Intencionado aberta.\n" +
                "🔍 Use o MRT para escolher a verificação que deseja executar.\n" +
                "⚠️ A verificação é feita pela ferramenta oficial do Windows."
            );
        });
    });
}

async function diagnostico() {
    const espaco = await verEspaco();
    const memoria = await verMemoria();
    const sistema = await verSistema();
    const seguranca = await verSeguranca();
    const limpeza = await verLimpeza();
    const rede = await verRede();
    const firewall = await verFirewall();

    const mensagem =
        "🩺 DIAGNÓSTICO DO SHATY\n\n" +
        `${espaco}\n\n` +
        `${memoria}\n\n` +
        `${sistema}\n\n` +
        `${seguranca}\n\n` +
        `${limpeza}\n\n` +
        `${rede}\n\n` +
        `${firewall}\n\n` +
        "✅ Diagnóstico concluído.";

    return {
        mensagem: mensagem
    };
}

ipcMain.handle("ver-espaco", () => {
    return verEspaco();
});

ipcMain.handle("ver-memoria", () => {
    return verMemoria();
});

ipcMain.handle("ver-sistema", () => {
    return verSistema();
});

ipcMain.handle("ver-seguranca", () => {
    return verSeguranca();
});

ipcMain.handle("ver-limpeza", () => {
    return verLimpeza();
});

ipcMain.handle("limpar-temporarios", () => {
    return limparTemporarios();
});

ipcMain.handle("ver-rede", () => {
    return verRede();
});

ipcMain.handle("ver-firewall", () => {
    return verFirewall();
});

ipcMain.handle("verificar-virus", () => {
    return abrirMRT();
});

ipcMain.handle("diagnostico", () => {
    return diagnostico();
});

ipcMain.on("minimizar", (evento) => {
    const janela =
        BrowserWindow.fromWebContents(evento.sender);

    janela.minimize();
});

ipcMain.on("fechar", (evento) => {
    const janela =
        BrowserWindow.fromWebContents(evento.sender);

    janela.close();
});

app.whenReady().then(criarJanela);
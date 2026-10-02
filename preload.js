const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld(
    "electronAPI",
    {

        minimizar: () =>
            ipcRenderer.send("minimizar"),


        fechar: () =>
            ipcRenderer.send("fechar"),


        verEspaco: () =>
            ipcRenderer.invoke("ver-espaco"),


        verMemoria: () =>
            ipcRenderer.invoke("ver-memoria"),


        verSistema: () =>
            ipcRenderer.invoke("ver-sistema"),


        verSeguranca: () =>
            ipcRenderer.invoke("ver-seguranca"),


        verLimpeza: () =>
            ipcRenderer.invoke("ver-limpeza"),


        limparTemporarios: () =>
            ipcRenderer.invoke("limpar-temporarios"),


        verRede: () =>
            ipcRenderer.invoke("ver-rede"),


        verFirewall: () =>
            ipcRenderer.invoke("ver-firewall"),


        verificarVirus: () =>
            ipcRenderer.invoke("verificar-virus"),


        diagnostico: () =>
            ipcRenderer.invoke("diagnostico"),


        verDataHora: () =>
            ipcRenderer.invoke("ver-data-hora"),


        falarComIA: (mensagem) =>
            ipcRenderer.invoke(
                "falar-com-ia",
                mensagem
            ),


        identificarIntencao: (mensagem) =>
            ipcRenderer.invoke(
                "identificar-intencao",
                mensagem
            )

    }
);

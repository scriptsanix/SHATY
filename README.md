# • SHATY 🤖💜

Meu primeiro projeto na área de programação e IA.

O **SHATY** começou como uma ideia simples: criar meu próprio assistente para desktop e, ao mesmo tempo, aprender programação construindo alguma coisa de verdade.

Hoje ele já consegue conversar com o Windows, consultar informações do computador, executar algumas tarefas do sistema e conversar com uma **IA local através do Ollama**.

Esse projeto está sendo construído enquanto eu aprendo JavaScript, Electron e Node.js na prática.

---

# • O que já tem

🤖 **IA local com Ollama + Gemma 3 4B**

💬 Conversação natural com memória recente da conversa

🧠 Classificação automática de intenções

💿 Informações de espaço em disco

🧠 Informações e uso da memória RAM

⚙️ Informações do sistema e processador

🛡️ Status do Windows Defender

🧹 Verificação de arquivos temporários

🧹 Limpeza de arquivos temporários com confirmação

🌐 Informações da rede

🔥 Status do Windows Firewall

🦠 Acesso à Ferramenta de Remoção de Software Mal-Intencionado do Windows

🩺 Diagnóstico básico do computador

📅 Data e hora do sistema

🖥️ Interface desktop feita com Electron

---

# • Como o SHATY entende os comandos

O SHATY possui dois caminhos para entender o que o usuário quer.

Primeiro ele verifica alguns comandos conhecidos diretamente no JavaScript.

Se não encontrar uma correspondência, a mensagem é enviada para o **Gemma 3 4B**, rodando localmente através do **Ollama**.

O modelo identifica a intenção da mensagem e o SHATY decide qual função do Windows deve executar.

Por exemplo:

```text
Usuário:
"quanto de RAM eu tenho?"

↓

Gemma:
MEMORIA

↓

SHATY:
consulta a memória do Windows

↓

Resposta:
Total: 15.89 GB
Usada: 9.53 GB
Livre: 6.35 GB
```

Isso permite que o usuário não precise decorar exatamente uma frase específica para cada função.

---

# • Comandos

Alguns exemplos de coisas que o SHATY já entende:

| Comando              | O que faz                                                            |
| -------------------- | -------------------------------------------------------------------- |
| `ver espaço`         | Mostra informações de espaço em disco                                |
| `ver memória`        | Mostra o uso da memória RAM                                          |
| `ver sistema`        | Mostra informações do Windows e do PC                                |
| `ver segurança`      | Verifica o status do Windows Defender                                |
| `ver limpeza`        | Verifica os arquivos temporários                                     |
| `limpar temporários` | Mostra os temporários e pede confirmação antes de limpar             |
| `fazer limpeza`      | Inicia o processo de limpeza                                         |
| `ver rede`           | Mostra informações da rede                                           |
| `ver firewall`       | Mostra o status do Firewall                                          |
| `verificar vírus`    | Abre a Ferramenta de Remoção de Software Mal-Intencionado do Windows |
| `verificar malware`  | Mesmo comando acima                                                  |
| `diagnóstico`        | Executa algumas verificações do computador                           |
| `que horas são?`     | Mostra a data e hora do sistema                                      |

Além desses comandos, o SHATY também consegue conversar normalmente com o usuário através do Gemma.

---

# • IA local

Atualmente o SHATY utiliza:

**Ollama**

para executar o modelo de inteligência artificial localmente.

O modelo utilizado é:

**Gemma 3 4B**

A comunicação acontece localmente entre o SHATY e o Ollama.

Isso significa que, na versão atual, a conversa básica com a IA não depende de uma API externa paga.

---

# • Como foi feito

* JavaScript
* Electron
* Node.js
* HTML
* CSS
* PowerShell
* Ollama
* Gemma 3 4B

O **Electron** é responsável pelo aplicativo desktop.

O **Node.js** permite que o SHATY execute funções do sistema.

O **PowerShell** é utilizado para consultar alguns recursos do Windows.

O **Ollama** executa o modelo de IA localmente.

O **Gemma** é responsável pela conversa e pela classificação das intenções.

---

# • Estrutura atual

O projeto utiliza principalmente:

```text
SHATY/
│
├── main.js
├── preload.js
├── script.js
├── index.html
├── style.css
├── package.json
├── package-lock.json
├── icon.ico
├── icon.png
└── logo.svg
```

O `main.js` concentra a comunicação com o sistema e com o Ollama.

O `preload.js` faz a ponte segura entre a interface e as funções do Electron.

O `script.js` controla a interface, os comandos e o fluxo das mensagens.

---

# • Ainda estou construindo

O SHATY ainda está no começo.

A ideia é continuar transformando esse projeto em um assistente de desktop cada vez mais completo.

Algumas das coisas que quero explorar no futuro:

* Melhorar o entendimento dos comandos
* Aumentar a quantidade de ferramentas do Windows
* Criar diagnósticos mais completos
* Melhorar a memória da conversa
* Criar novas funções de segurança
* Pesquisar informações externas quando necessário
* Criar uma versão `.exe`
* Melhorar a interface
* Adicionar novas formas de interação com o PC

Mas por enquanto é isso. 



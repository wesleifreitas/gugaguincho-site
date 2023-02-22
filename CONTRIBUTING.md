# Guia de contribuição 
 - [Workstation](#workstation)
 - [Regras do commit](#commit)
 - [Release](#release)
 
 ### <a name="workstation"></a>Workstation

* **Editor**: [Visual Studio Code](https://code.visualstudio.com/)

|EXTENSIONS                |             |
|------------------------- | -------------
|Angular Material Snippets | 4tron
|Stylesheet Formatter      | Balazs Deak
|vscode-icons              | Roberto Huertas

**Settings:**
```
{    
    "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",    
    "workbench.iconTheme": "vscode-icons",    
    "editor.formatOnSave": true
}
```

* **GIT**

Para utilizar e compartilhar códigos será necessário uma chave SSH.

Site: https://git-scm.com

**Git — Configurar usuário e email*
```bash
git config --global user.name "Nome Sobrenome"
git config --global user.email "email@example.com"
```

**Git — Configurar editor*

```
git config --global core.editor "'code' -w"
```


**SSH**

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

Informe no comando seu e-mail cadastrado no GitHub. Dê **Enter** na próxima pergunta (sobre o arquivo a ser criado – deixe o padrão).
A próxima pergunta irá pedir uma senha (passphrase). Invente uma senha e a informe. Será solicitado uma confirmação. Digite a senha novamente e tecle **Enter**.

Agora digite:

```bash
clip < ~/.ssh/id_rsa.pub
```
Este comando irá copiar sua chave pública.

Agora acesse sua conta GitHub, vá em **Configurações** -> **SSH Keys**, clique em **Add SSH key**;
Defina um **Título** e cole sua chave pública no campo **Key**.

Para se certificar de que tudo está funcionando digite no bash:

```bash
ssh -T git@GitHub.com
```

## <a name="commit"></a>Regras do commit

### Commit Message (Formato)
Cada mensagem de commit deve possuir um **header**(obrigatório), e pode conter um **body** e um **footer**.  O header inclui um **type**(obrigatório), um **scope**(obrigatório) e um **subject**(obrigatório):

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Type
Deve ser um destes:

* **feat**: Um novo recurso
* **fix**: Uma correção de bug
* **docs**: Mudanças referentes a documentação
* **style**: Alterações que não afetam o código (espaço em branco, formatação, falta de ponto e vírgula, etc)
* **refactor**: Melhoria de código que não corrige um bug e nem adiciona um novo recurso
* **perf**: Alteração no código que melhora o desempenho
* **chore**: Processo de construção (build) ou ferramentas auxiliares e bibliotecas, tais como geração de documentação.

### Scope
O escopo pode ser qualquer coisa especificando o que o commit está alterando. Por exemplo `login`.

### Subject
Descrição objetiva da mudança:

* use frases no presente e modo imperativo: "alterar" e não "alterado" nem "alterações", por exemplo: `alterar o formulário`
* não utilize letra maiúscula na primeira letra
* não inclua o ponto no final no título

### Body
Assim como o **subject**, utilize frases no presente e modo imperativo.
O body pode descrever a motivação da alteração e comparar seu comportamento atual com a anterior.

### Footer
Considerações finais.

[Feche issues automaticamente](https://help.github.com/articles/closing-issues-using-keywords/)

Exemplo: **close #8** ou para mais de uma issue: **close #5 #8**

## <a name="release"></a> Release

```bash
gulp build
```

O site (build) será gerado na pasta **src/build**

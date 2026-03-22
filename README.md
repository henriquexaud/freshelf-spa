# Freshelf SPA

Interface web para o sistema Freshelf de controle de validade de produtos perecíveis. Desenvolvida como SPA (Single Page Application) com HTML, CSS e JavaScript puro, sem frameworks.

---

## Funcionalidades

- **Cards de estatísticas** — resumo em tempo real: total de itens, dentro do prazo, vencendo em breve e vencidos
- **Alertas de vencimento** — cards destacados para produtos vencidos ou próximos do vencimento (≤ 7 dias)
- **Cadastro de produtos** — formulário com validação básica
- **Listagem completa** — tabela com todos os produtos e badge de status colorido
- **Remoção** — botão por item na tabela
- **Feedback visual** — mensagens temporárias de sucesso e erro, além de bloqueio de ações durante requisições

Nesta versão do MVP, o cadastro trabalha com nome, quantidade e validade. Categoria e local de armazenamento foram removidos para simplificar o fluxo.

---

## Pré-requisito

A **FreshElf API** deve estar em execução em `http://localhost:5001`.  
Consulte o repositório `freshelf-api` para instruções de instalação e execução.

Se precisar apontar para outra URL da API no navegador, execute no console:

```javascript
localStorage.setItem("freshelf.api", "http://localhost:5001")
```

---

## Como executar

Abra o arquivo `index.html` **diretamente no navegador** — não é necessário servidor, extensão ou configuração adicional:

```
Duplo clique em index.html
```

ou via terminal:

```bash
# macOS
open index.html

# Linux
xdg-open index.html
```

---

## Rotas da API consumidas

| Rota                         | Onde é chamada                          |
|------------------------------|-----------------------------------------|
| `POST /produtos`             | Envio do formulário de cadastro         |
| `GET /produtos`              | Carregamento da tabela de produtos      |
| `GET /produtos/vencendo`     | Carregamento dos cards de alerta        |
| `GET /produtos/estatisticas` | Carregamento dos cards de resumo        |
| `DELETE /produtos/<id>`      | Botão "Remover" em cada linha da tabela |

---

## Estrutura

```
freshelf-spa/
├── index.html
├── app.js
└── style.css
```

## Comportamentos de feedback

- ao cadastrar com sucesso, a mensagem aparece e some automaticamente após 5 segundos
- erros de cadastro e remoção aparecem de forma temporária e são limpos quando um novo fluxo começa
- durante o cadastro, o botão fica desabilitado e mostra estado de envio
- durante a remoção, o botão do item muda para estado de processamento

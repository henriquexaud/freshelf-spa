# FreshElf SPA

Interface web para o sistema FreshElf de controle de validade de produtos perecíveis. Desenvolvida como SPA (Single Page Application) com HTML, CSS e JavaScript puro, sem frameworks.

---

## Funcionalidades

- **Cards de estatísticas** — resumo em tempo real: total de itens, dentro do prazo, vencendo em breve e vencidos
- **Alertas de vencimento** — cards destacados para produtos vencidos ou próximos do vencimento (≤ 7 dias)
- **Cadastro de produtos** — formulário com validação básica
- **Listagem completa** — tabela com todos os produtos e badge de status colorido
- **Remoção** — botão por item na tabela

---

## Pré-requisito

A **FreshElf API** deve estar em execução em `http://localhost:5001`.  
Consulte o repositório `freshelf-api` para instruções de instalação e execução.

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
└── index.html    # SPA completa (HTML + CSS + JS em arquivo único)
```

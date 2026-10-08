# SPADONI

Site da pizzaria em Next.js, com cardápio, páginas dos sabores, apresentação animada dos ingredientes, montador de pizzas, sacola, área do cliente e administração. O visual mantém a identidade da casa: creme, terracota, tipografia editorial e fotografias ilustrativas das pizzas.

## Rodar localmente

Requer **Node.js 24 ou superior**, incluindo `node:sqlite`, e uma pasta gravável para o banco.

```sh
npm install
npm run dev
```

Abra `http://localhost:3000`. Para conferir a versão de produção:

```sh
npm run build
npm start
```

Não é necessário configurar um serviço de banco ou credenciais para explorar o site e criar contas. A instalação começa sem telefone ou endereço reais e com novos pedidos pausados. Em `/admin`, configure o WhatsApp e o endereço para retirada antes de ativar **Aceitar novos pedidos**. O banco SQLite nasce automaticamente em `.data/spadoni.sqlite`, usando o catálogo original como ponto de partida. Depois da primeira execução, mudanças no catálogo são feitas pelo administrador e ficam no banco. Alterar os arquivos de seed não sobrescreve dados existentes.

## Primeiro acesso administrativo

1. Abra `/admin/configurar`.
2. Copie a chave privada gerada em **`.data/admin-setup.key`** para o campo “Chave de configuração”.
3. Escolha seu nome, e-mail e uma senha ou frase com pelo menos 15 caracteres.
4. Entre normalmente por `/admin/login` nas próximas visitas.

A chave permite criar somente o primeiro administrador. Clientes não conseguem escolher ou promover seu próprio papel. Não publique essa chave. Também é possível definir `ADMIN_SETUP_TOKEN` no servidor em vez de usar o arquivo local.

O login administrativo antigo por `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `ADMIN_SESSION_SECRET` continua disponível quando os três valores estão configurados. Nesse caso, o primeiro acesso por chave fica desabilitado. O fluxo com conta no banco é o recomendado: ele também permite usar a área do cliente e trocar a senha. Não há senha administrativa pública ou padrão.

## O que está disponível

- **Cliente — `/conta`**: cadastro e login, favoritos, pedidos e acompanhamento, dados pessoais, endereço e troca de senha. O pedido pode ser repetido usando os valores e a disponibilidade atuais.
- **Montador — `/montar`**: tamanhos, até três sabores conforme a regra do administrador, combinação dentro da mesma categoria, bordas recheadas, retirada de ingredientes, até três porções de cada adicional e observações para a cozinha. O preço aparece decomposto na revisão.
- **Sacola — `/sacola`**: configurações e quantidades persistem no navegador; retirada ou entrega, endereço, contato, revisão do subtotal e registro do pedido.
- **Administração — `/admin`**: visão dos pedidos, atualização do preparo, exportação CSV, criação/edição/remoção de sabores, composição das receitas, imagens, preços por tamanho, ingredientes e adicionais, bordas, limites de personalização, clientes e configurações da casa.
- **Cardápio**: busca, categorias, favoritos, disponibilidade e entrada direta no montador. Novos sabores ganham sua própria página com os ingredientes cadastrados.
- **Página de sabor — `/pizzas/[slug]`**: pizza ilustrativa que se abre em camadas. Miniaturas e setas exploram os ingredientes; Escape fecha a apresentação. A animação respeita movimento reduzido.

No administrador, as edições ficam em rascunho até clicar em **Publicar alterações**. Se outra sessão publicar primeiro, o servidor exige recarregar os dados. Os valores de bordas e adicionais iniciais são sugestões editáveis; revise-os para a sua operação. As imagens são ilustrativas e a montagem visual representa os sabores escolhidos.

## Regras de preço e pedidos

Todos os valores são conferidos no servidor e calculados em centavos. O administrador escolhe cobrar pelo sabor mais caro ou pela média dos sabores. Bordas e adicionais são somados; retirar ingredientes mantém o preço da receita. Receitas que dependem de um ingrediente pausado deixam de aceitar pedidos.

Os pedidos preservam a receita, os valores e as observações do momento do registro. Atualizar ou remover itens do catálogo não muda o histórico. Uma chave de idempotência impede duplicação ao reenviar a confirmação. O cliente acompanha os estados alterados pela equipe; a atualização automática ocorre a cada 15 segundos na tela de acompanhamento e a cada 20 segundos na conta.

O registro no site **não envia uma mensagem automaticamente**. A tela do pedido oferece um link do WhatsApp com a combinação e o número do pedido, para o cliente confirmar com a equipe. Na entrega, cobertura e frete ficam a confirmar: o subtotal não inclui um frete inventado. O status de preparo é separado do pagamento.

## Configuração e persistência

Use `.env.example` como referência para criar `.env.local`, apenas se precisar das opções abaixo:

| Variável | Uso |
| --- | --- |
| `SPADONI_DB_PATH` | Caminho do banco; padrão `.data/spadoni.sqlite`. |
| `ADMIN_SETUP_TOKEN` | Chave privada opcional para o primeiro administrador. |
| `NEXT_PUBLIC_APP_URL` | URL base para retorno de pagamento. |
| `MERCADOPAGO_ACCESS_TOKEN` | Credencial privada opcional para Checkout Pro de retirada. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número usado na carga inicial; depois é editável no painel. |
| `NEXT_PUBLIC_STORE_ADDRESS` | Endereço usado na carga inicial; depois é editável no painel. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | Compatibilidade com o acesso administrativo anterior. |

Variáveis `NEXT_PUBLIC_*` são públicas: nunca coloque senhas, chaves ou tokens nelas. Telefone e endereço configurados no painel também aparecem no site. O repositório inclui somente `.env.example` com campos privados vazios; arquivos `.env`, bancos SQLite, chaves, `.data/` e `.qa/` ficam ignorados. Não envie essas pastas em arquivos ZIP junto com o código.

Para hospedar este projeto, use um servidor Node com **volume persistente** e mantenha uma única instância da aplicação ligada a esse banco. Arquivos temporários de funções serverless não preservam as alterações. Para mais instâncias, migre a camada de armazenamento para um banco compartilhado. Faça backup consistente do SQLite; `VACUUM INTO` ou a API de backup são opções, em vez de copiar apenas o arquivo principal enquanto há gravações no WAL. `.data/` e `.env.local` são privados e ignorados pelo controle de versão.

Senhas usam scrypt com sal individual. Sessões são guardadas como hashes no banco e cookies HttpOnly, SameSite Lax, com oito horas de duração e Secure em produção. Trocar a senha encerra outras sessões. Rotas privadas conferem o papel no servidor; mutações conferem a origem; tentativas de autenticação são limitadas no banco.

## Pagamento online

Sem uma credencial do Mercado Pago, a sacola oferece registro e confirmação com a equipe. Com a credencial e a URL base configuradas, a retirada também oferece Checkout Pro, com valores obtidos do catálogo no servidor e número do pedido na referência externa. Reutilizar a mesma tentativa reaproveita o pedido/link já criado.

A confirmação automática de pagamento por **Webhook ainda não está implementada**. O retorno do provedor não marca o pedido como pago. O painel mostra o pagamento como não confirmado ou aguardando confirmação. Também não foram incluídos recuperação de senha por e-mail, verificação de e-mail, cálculo automático de frete ou envio automático de mensagens.

## Organização

- `lib/commerce.js`: validação de catálogo, regras de montagem e preço.
- `lib/database.js`, `lib/server-auth.js`, `lib/orders.js`: persistência, autenticação e pedidos.
- `app/api/`: APIs públicas, da conta e da administração.
- `app/components/portal-provider.js`: estado compartilhado da conta, catálogo e sacola.
- `app/admin/workspace.js`, `app/conta/dashboard.js`: painéis.
- `app/montar/`, `app/sacola/`, `app/pedido/[id]/`: montagem e pedido.
- `app/portal.css`: estilos das novas áreas; `styles.css`: identidade da loja.
- `app/pizzas/[slug]/`: páginas dos sabores e animação de ingredientes.
- `public/images/pizzas/`: imagens ilustrativas; os prompts estão no README da pasta.

## Referências usadas

As referências orientaram as opções do produto; a interface foi desenhada para a identidade da SPADONI.

- [Square — modificadores do cardápio](https://squareup.com/us/en/square-university/items-menus-modifiers/set-up-item-modifiers-with-square): escolhas, adicionais e limites configuráveis.
- [Square — regras de modificadores](https://developer.squareup.com/docs/catalog-api/enable-modifiers-on-items): restrições e valores por seleção.
- [Toast — operação de pizzarias](https://pos.toasttab.com/restaurant-pos/pizza-pos): combinações de sabores e gestão de pedidos.
- [Domino’s — bordas recheadas](https://atendimentodominos.zendesk.com/hc/pt-br/articles/31362051463444-E-tem-novidade-na-%C3%A1rea-Novos-sabores-de-Borda-Recheada): borda como escolha separada na montagem.
- [OWASP — armazenamento de senhas](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [autenticação](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) e [sessões](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html): proteção do acesso.
- [Node.js — SQLite](https://nodejs.org/api/sqlite.html): armazenamento local persistente.

## Verificação local

`npm run build` verifica a compilação e as rotas. Os cenários de integração em `.qa/` usam um banco separado em `.qa/commerce-test/`, sem criar clientes ou pedidos de teste no banco da loja. A revisão inclui cálculos de combinação, rejeição de preços adulterados, permissões, pedidos duplicados, preservação do histórico, mudança de senha e navegação nos tamanhos de tela 1440, 768, 390 e 320 pixels. Os scripts de navegador usam Playwright/Edge disponíveis na máquina de desenvolvimento.

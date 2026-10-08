# Revisão antes da publicação

Revisão realizada em 8 de outubro de 2026.

## Correções

- Removidos o telefone e o endereço reais dos valores iniciais e de `.env.example`.
- Novas instalações começam com os pedidos pausados. O administrador precisa configurar o WhatsApp e, se houver retirada, o endereço antes de ativar pedidos.
- Catálogos pausados podem ser salvos sem contatos. Links de mapa e WhatsApp não são exibidos quando falta o respectivo contato.
- Ampliado o `.gitignore` para excluir variações de `.env`, bancos, arquivos auxiliares do SQLite e chaves privadas. `.env.example` permanece versionado.
- Removidos os contatos públicos do catálogo local existente, preservando contas e pedidos no banco privado ignorado pelo Git.
- O primeiro commit local foi substituído para remover os contatos do histórico a publicar. O e-mail de autoria usa o endereço noreply do GitHub.

## Verificação

- `npm run build`: compilação de produção concluída.
- `npm audit --omit=dev --audit-level=high`: nenhuma vulnerabilidade conhecida reportada.
- Testes de integração com banco separado: primeiro administrador, cadastro, login, bloqueio de mutações de outra origem, permissões administrativas, isolamento de pedidos, cálculo de preços, idempotência, edição de catálogo, troca de senha e revogação de sessões.
- Verificação de privacidade: contatos vazios na instalação, APIs privadas exigindo autenticação e recusa de abertura da loja sem os contatos necessários.

Os scripts e resultados de teste permanecem em `.qa/`, fora do repositório. Esta revisão não substitui uma auditoria de segurança completa.

## Para colocar o site em operação

- Configurar os contatos no painel, revisar os preços e ativar o atendimento.
- Hospedar com Node.js 24 ou superior, HTTPS e volume persistente para o SQLite. Manter uma única instância usando esse banco e configurar backups.
- O webhook de pagamento ainda não está implementado: o retorno do Mercado Pago não confirma pagamentos automaticamente.
- Recuperação de senha por e-mail, verificação de e-mail, cálculo automático de frete e envio automático de mensagens ainda não estão implementados.

O código pode ser publicado no GitHub com essas limitações documentadas. A licença de distribuição ainda não foi definida.

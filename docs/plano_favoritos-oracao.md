DESCRIÇÃO PARA IMPLEMENTAÇÃO
Módulo: Ore
Feature: Acesso rápido às orações favoritas

Objetivo
Criar um acesso rápido e unificado a todas as orações favoritadas pelo usuário, independentemente da categoria original, facilitando o uso em momentos de pressa ("correrias do dia a dia").

Onde implementar
Na tela principal do módulo Ore, entre as seções:
"Para o Momento" (acima)
"Ambiente de Sintonia" (abaixo)
Inserir um novo card intitulado "Favoritos".

Estilo visual (igual ao card "Pergunte ao Sr. Allan" da tela Estude)
Especificações:
Ícone: (coração) à esquerda do título
Título: "Favoritos"
Subtítulo: "Acesso rápido às suas orações preferidas"
Botão: "Ver todas"

Comportamento esperado
Ao tocar no botão "Ver todas":
O usuário é direcionado para a tela de filtro de orações (igual as que já existem no próprio modulo Ore), porém com o filtro "Apenas Favoritos" já ativo por padrão.
Comportamento da tela (baseado nas imagens fornecidas):
Título da categoria: permanece dinâmico? Ou podemos definir como "Favoritos" ou "Minhas Orações"?
Subtítulo: "Todas as suas orações favoritas" (ou manter o padrão "Orações")
Campo de busca: 🔍 "Buscar uma oração..." (funcional dentro da lista de favoritos)
Lista de orações: exibe apenas as orações favoritadas pelo usuário, vindas de qualquer categoria

Filtros disponíveis na parte inferior: igual ao padrão, mas o filtro "Apenas Favoritos" já vem selecionado
Estrutura de filtros (igual às imagens):

- **Todos** (mostraria todas, mas ao vir de "Favoritos", talvez não faça sentido)
- **Apenas Favoritos** (selecionado por padrão)
- **Por Autor**
- **Por Fonte**
  Observação importante: Como o usuário veio do card "Favoritos", talvez faça sentido ocultar ou desabilitar a opção "Todos" nesse contexto, ou então manter mas com um aviso. Avaliar a melhor abordagem.

Integração com o sistema de favoritos existente
O ícone de coração já utilizado nas telas de categoria deve ser o mesmo
Favoritar/desfavoritar em qualquer lugar (categoria, lista de favoritos) deve refletir em tempo real em todas as telas
A lista de favoritos deve ser persistente entre sessões (armazenamento local ou nuvem, conforme a arquitetura atual)

Casos de uso
Usuário com favoritos: vê o card na tela principal do Ore → toca → vê lista com todas as orações favoritas
Usuário sem favoritos: vê o card → toca → vê tela com estado vazio e sugestão para explorar
Usuário navegando pelas categorias: favorita uma oração → ela aparece imediatamente na lista de favoritos
Usuário na lista de favoritos: desfavorita uma oração → ela some da lista em tempo real

Critérios de aceite
Card "Favoritos" visível na tela principal do Ore, entre as seções "Para o Momento" e "Ambiente de Sintonia"
Toque no botão "Ver todas" leva à tela "Minhas Orações Favoritas"
Lista de favoritos exibe todas as orações favoritadas, independentemente da categoria
Ícone de estrela permite favoritar/desfavoritar com atualização em tempo real
Estado vazio tratado com mensagem amigável e call to action
Busca funcional (se implementada)
Performance fluida, mesmo com muitas orações favoritadas

DESCRIÇÃO PARA IMPLEMENTAÇÃO
Módulo: Medite
Feature: Acesso rápido às reflexões favoritas

Objetivo
Criar um acesso rápido e unificado a todas as reflexões favoritadas pelo usuário, independentemente da categoria original, facilitando o uso em momentos de pressa ("correrias do dia a dia").

Onde implementar
Na tela principal do módulo Medite, dentro da aba "Leitura Diária" (pílula selecionada), posicionado acima da seção "Textos para Reflexão", mantendo o mesmo padrão de hierarquia visual já utilizado na tela "Ore".

Estilo visual (igual ao card "Pergunte ao Sr. Allan" da tela Estude)
Especificações:
Ícone: (creflexão) à esquerda do título
Título: "Favoritos"
Subtítulo: "Acesso rápido às suas reflexões preferidas"
Botão: "Ver todas"

Comportamento esperado (igual implementação Favoritas do módulo Ore)
Ao tocar no botão "Ver todas":
O usuário é direcionado para a tela de filtro de reflexões (igual as que já existem no próprio modulo Medite), porém com o filtro "Apenas Favoritos" já ativo por padrão.
Comportamento da tela (baseado nas imagens fornecidas):
Título da categoria: permanece dinâmico? Ou podemos definir como "Favoritos" ou "Minhas Reflexões"?
Subtítulo: "Todas as suas reflexões favoritas" (ou manter o padrão "Reflexões")
Campo de busca: 🔍 "Buscar uma reflexão..." (funcional dentro da lista de favoritos)
Lista de reflexões: exibe apenas as reflexões favoritadas pelo usuário, vindas de qualquer categoria

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
Usuário com favoritos: vê o card na tela principal do Medite → toca → vê lista com todas as reflexões favoritas
Usuário sem favoritos: vê o card → toca → vê tela com estado vazio e sugestão para explorar
Usuário navegando pelas categorias: favorita uma reflexão → ela aparece imediatamente na lista de favoritos
Usuário na lista de favoritos: desfavorita uma reflexão → ela some da lista em tempo real

Critérios de aceite
Card "Favoritos" visível na tela principal do Medite, posicionado acima da seção "Textos para Reflexão"
Toque no botão "Ver todas" leva à tela "Minhas Reflexões Favoritas"
Lista de favoritos exibe todas as reflexões favoritadas, independentemente da categoria
Ícone de coração permite favoritar/desfavoritar com atualização em tempo real
Estado vazio tratado com mensagem amigável e call to action
Busca funcional (se implementada)
Performance fluida, mesmo com muitas reflexões favoritadas

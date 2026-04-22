Especificação Técnica: Ajustes de Lógica do Player (Módulo Meditação)
Nota Crítica: Nenhuma alteração visual (UI), layout, cores ou componentes deve ser realizada. O foco é estritamente na lógica de negócio, gerenciamento de estado e ciclo de vida do componente.

Lib utilizada: react-native-track-player

1. Comunicação entre Telas (Data Transfer)
   Requisito: A transferência da meditação escolhida para a tela do Player deve ser feita via Gerenciamento de Estado Global (ex: Zustand, Context API ou Redux).

Fluxo: 1. Ao clicar na meditação, o estado global currentMeditation deve ser atualizado com o objeto selecionado. 2. A navegação deve ser disparada logo em seguida. 3. Na tela de destino, o Player deve consumir esse estado global para identificar qual arquivo de áudio e metadados carregar.

2. Gatilho de Reprodução (Autoplay)
   Lógica Interna: Utilizar o hook de efeito (useEffect ou similar) para disparar o método .play() do controlador de áudio assim que o componente for montado e o estado da meditação estiver disponível.
   UI Invariante: O botão deve refletir o estado de playing automaticamente, conforme a lógica já existente, sem mudar seu design.

3. Persistência e Controle de Interrupção
   Gestão de Buffer: Garantir que o pause() e play() não resetem o buffer ou a posição atual (currentTime).
   Estado de Reprodução: O código deve garantir a reentrância. O usuário pode pausar e dar play infinitas vezes sem que o estado de carregamento (loading) seja disparado novamente de forma desnecessária.

4. Reset Lógico Pós-Finalização
   Ao detectar o evento de término do arquivo (onEnded):
   Seek Reset: O currentTime do player deve ser definido programaticamente como 0.
   Toggle State: O estado booleano de controle do botão deve ser setado para false (estado de Play), forçando a atualização visual do ícone existente para o símbolo de reprodução.
   Replay: A função de Play deve estar preparada para reiniciar o áudio caso o currentTime seja 0 e o áudio tenha terminado.

5. Descarte de Instância (Memory Cleanup)
   Unmount/OnBack: No encerramento da tela ou retorno à Home:
   Chamar obrigatoriamente o método .stop() ou .unload().
   Limpar o estado global currentMeditation (opcional, conforme regra de negócio) para garantir que não haja "vazamento" de áudio tocando em segundo plano.
   Importante: O processo de "matar" o áudio deve ser funcional (lógica), não visual.

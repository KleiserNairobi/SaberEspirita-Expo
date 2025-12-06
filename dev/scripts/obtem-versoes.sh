#!/bin/bash
echo "" 
echo "Verificando versões instaladas:"
echo ""


# --- SDKMAN! ---
echo "--- SDKMAN! e Java ---"
# Verifica se o SDKMAN_DIR está definido e se o script de inicialização existe
if [ -n "$SDKMAN_DIR" ] && [ -s "$SDKMAN_DIR/bin/sdkman-init.sh" ]; then
    source "$SDKMAN_DIR/bin/sdkman-init.sh"
    if command -v java &> /dev/null; then
        echo "Java (via SDKMAN!): $(java -version 2>&1 | head -n 1)"
    else
        echo "Java (via SDKMAN!): Nenhuma versão de Java ativa."
    fi
elif [ -s "$HOME/.sdkman/bin/sdkman-init.sh" ]; then
    source "$HOME/.sdkman/bin/sdkman-init.sh"
    if command -v java &> /dev/null; then
        echo "Java (via SDKMAN!): $(java -version 2>&1 | head -n 1)"
    else
        echo "Java (via SDKMAN!): Nenhuma versão de Java ativa."
    fi
else
    echo "SDKMAN!: Não encontrado (SDKMAN_DIR não definido ou script de inicialização não encontrado)."
    echo "Java: Não verificado (SDKMAN! não disponível)."
fi
echo "" # Linha em branco para melhor leitura


# --- Android SDK (adb) ---
echo "--- Android SDK ---"
# Tenta encontrar adb no PATH ou em locais comuns do SDK
if command -v adb &> /dev/null; then
    echo "Android SDK (adb): $(adb version | head -n 1)"
else
    # Verifica variável ANDROID_HOME ou ANDROID_SDK_ROOT
    if [ -n "$ANDROID_HOME" ] && [ -x "$ANDROID_HOME/platform-tools/adb" ]; then
        echo "Android SDK (adb): $(${ANDROID_HOME}/platform-tools/adb version | head -n 1) (via ANDROID_HOME)"
    elif [ -n "$ANDROID_SDK_ROOT" ] && [ -x "$ANDROID_SDK_ROOT/platform-tools/adb" ]; then
        echo "Android SDK (adb): $(${ANDROID_SDK_ROOT}/platform-tools/adb version | head -n 1) (via ANDROID_SDK_ROOT)"
    else
        echo "Android SDK (adb): Não encontrado (adb não está no PATH e variáveis ANDROID_HOME/ANDROID_SDK_ROOT não definidas/válidas)."
    fi
fi
echo ""


# --- NVM (Node Version Manager) ---
echo "--- NVM e Node ---"
# Verifica se o NVM_DIR está definido e se o script de inicialização existe
if [ -n "$NVM_DIR" ] && [ -s "$NVM_DIR/nvm.sh" ]; then
    # Carrega o NVM dentro do script para que 'nvm' seja reconhecido
    source "$NVM_DIR/nvm.sh"
    echo "NVM: $(nvm --version)"
    if command -v node &> /dev/null; then
        echo "Node (via NVM): $(node -v)"
    else
        echo "Node (via NVM): Nenhuma versão de Node ativa."
    fi
elif [ -s "$HOME/.nvm/nvm.sh" ]; then
    # Caso NVM_DIR não esteja definido, tenta carregar do local padrão
    source "$HOME/.nvm/nvm.sh"
    echo "NVM: $(nvm --version)"
    if command -v node &> /dev/null; then
        echo "Node (via NVM): $(node -v)"
    else
        echo "Node (via NVM): Nenhuma versão de Node ativa."
    fi
else
    echo "NVM: Não encontrado (NVM_DIR não definido ou script de inicialização não encontrado)."
    echo "Node: Não verificado (NVM não disponível)."
fi
echo "" # Linha em branco para melhor leitura


# --- RBENV (Ruby Environment) ---
echo "--- RBENV e Ruby ---"
if command -v rbenv &> /dev/null; then
    echo "RBENV: $(rbenv --version)"
    # A versão ativa do Ruby pode ser obtida via 'ruby -v' ou 'rbenv version'
    echo "Ruby (via RBENV): $(ruby -v | head -n 1)"
else
    echo "RBENV: Não encontrado (RBENV não está no PATH ou não foi inicializado)."
    echo "Ruby: Não verificado (RBENV não disponível)."
fi
echo "" # Linha em branco para melhor leitura






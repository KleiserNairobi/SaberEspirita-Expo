#!/bin/bash

# --- Variáveis Globais (Pode ajustar conforme sua instalação) ---
NVM_DIR="$HOME/.nvm"
RBENV_ROOT="$HOME/.rbenv"
SDKMAN_DIR="$HOME/.sdkman"
ANDROID_SDK_HOME="$HOME/Library/Android/sdk"
# Se você usa uma versão específica de NDK, ajuste aqui.
# Caso contrário, o script tentará encontrar a mais nova ou a padrão do Android Studio.
ANDROID_NDK_VERSION="" # Ex: "23.1.7779620"

# --- NOVO: Caminho para a pasta de configurações dentro do projeto ---
# Assumimos que a pasta 'config' está no mesmo nível que este script
PROJECT_CONFIG_DIR="./config"

# --- Fim das Variáveis Globais ---

echo "🚀 Configurando ambiente para o projeto React Native..."

# --- 1. Ativar NVM e Carregar Versão do Node.js ---
echo ""
echo "✨ Verificando NVM e Node.js..."
if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh" # Carrega NVM
    # Agora procura o .nvmrc dentro da pasta de configuração do projeto
    if [ -f "$PROJECT_CONFIG_DIR/.nvmrc" ]; then
        nvm install "$(cat "$PROJECT_CONFIG_DIR/.nvmrc")" # Instala a versão especificada
        nvm use "$(cat "$PROJECT_CONFIG_DIR/.nvmrc")"     # Usa a versão especificada
        echo "✅ Node.js $(node -v) ativado via $PROJECT_CONFIG_DIR/.nvmrc."
    else
        echo "⚠️ Arquivo $PROJECT_CONFIG_DIR/.nvmrc não encontrado. Usando a versão padrão ou já ativa."
        nvm use default > /dev/null 2>&1 || nvm alias default node # Tenta usar a default, ou cria se não existir
        echo "✅ Node.js $(node -v) ativado (padrão ou existente)."
    fi
else
    echo "❌ NVM não encontrado em $NVM_DIR. Certifique-se de que está instalado."
fi

# --- 2. Ativar rbenv e Carregar Versão do Ruby ---
echo ""
echo "✨ Verificando rbenv e Ruby..."
if [ -s "$RBENV_ROOT/bin/rbenv" ]; then
    eval "$(rbenv init -)" # Carrega rbenv
    # Agora procura o .ruby-version dentro da pasta de configuração do projeto
    if [ -f "$PROJECT_CONFIG_DIR/.ruby-version" ]; then
        rbenv install "$(cat "$PROJECT_CONFIG_DIR/.ruby-version")" # Instala a versão especificada
        rbenv shell "$(cat "$PROJECT_CONFIG_DIR/.ruby-version")"   # Usa a versão especificada
        echo "✅ Ruby $(ruby -v | awk '{print $2}') ativado via $PROJECT_CONFIG_DIR/.ruby-version."
    else
        echo "⚠️ Arquivo $PROJECT_CONFIG_DIR/.ruby-version não encontrado. Usando a versão global do rbenv."
        rbenv shell $(rbenv global) # Tenta usar a versão global
        echo "✅ Ruby $(ruby -v | awk '{print $2}') ativado (global ou existente)."
    fi
    # Instalar gems do Bundler se houver Gemfile (na raiz do projeto)
    if [ -f "Gemfile" ]; then
        echo "⚙️ Executando bundle install para dependências do Ruby..."
        bundle install || { echo "❌ Falha ao executar bundle install. Verifique suas gems."; exit 1; }
        echo "✅ Bundle install concluído."
    fi
else
    echo "❌ rbenv não encontrado em $RBENV_ROOT. Certifique-se de que está instalado."
fi

# --- 3. Configurar Variáveis de Ambiente Android ---
echo ""
echo "✨ Configurando ambiente Android..."
if [ -d "$ANDROID_SDK_HOME" ]; then
    export ANDROID_HOME="$ANDROID_SDK_HOME"
    export PATH="$PATH:$ANDROID_HOME/emulator"
    export PATH="$PATH:$ANDROID_HOME/platform-tools"
    # Adiciona o NDK ao PATH
    if [ -n "$ANDROID_NDK_VERSION" ]; then
        if [ -d "$ANDROID_HOME/ndk/$ANDROID_NDK_VERSION" ]; then
            export ANDROID_NDK_HOME="$ANDROID_HOME/ndk/$ANDROID_NDK_VERSION"
            export PATH="$PATH:$ANDROID_NDK_HOME"
            echo "✅ ANDROID_HOME e ANDROID_NDK_HOME ($ANDROID_NDK_VERSION) definidos."
        else
            echo "⚠️ NDK versão $ANDROID_NDK_VERSION não encontrado. Verifique sua instalação do NDK."
        fi
    else
        # Tenta encontrar a versão mais recente do NDK se não especificada
        LATEST_NDK=$(ls -v "$ANDROID_HOME/ndk/" | grep -E '^[0-9]+\.[0-9]+\.[0-9]+' | tail -1)
        if [ -n "$LATEST_NDK" ] && [ -d "$ANDROID_HOME/ndk/$LATEST_NDK" ]; then
            export ANDROID_NDK_HOME="$ANDROID_HOME/ndk/$LATEST_NDK"
            export PATH="$PATH:$ANDROID_NDK_HOME"
            echo "✅ ANDROID_HOME definido. NDK_HOME ($LATEST_NDK) definido automaticamente."
        else
            echo "⚠️ NDK não encontrado. Por favor, instale o NDK via SDK Manager."
        fi
    fi
    echo "✅ Caminhos do Android adicionados ao PATH."
else
    echo "❌ ANDROID_HOME ($ANDROID_SDK_HOME) não encontrado. Verifique sua instalação do Android SDK."
fi

# --- 4. Instalar Dependências do Node.js (Yarn/NPM) ---
echo ""
echo "✨ Verificando e instalando dependências do Node.js..."
# Os lockfiles (yarn.lock, package-lock.json) ainda são esperados na raiz do projeto
if [ -f "yarn.lock" ]; then
    echo "⚙️ Detectado yarn.lock. Executando yarn install..."
    yarn install --frozen-lockfile || { echo "❌ Falha ao executar yarn install. Verifique suas dependências."; exit 1; }
    echo "✅ Yarn install concluído."
elif [ -f "package-lock.json" ]; then
    echo "⚙️ Detectado package-lock.json. Executando npm install..."
    npm install --legacy-peer-deps || { echo "❌ Falha ao executar npm install. Verifique suas dependências."; exit 1; }
    echo "✅ npm install concluído."
else
    echo "⚠️ Nenhum lockfile (yarn.lock ou package-lock.json) encontrado. Não foram instaladas dependências do Node.js."
fi

# --- 5. Configurar CocoaPods para iOS ---
echo ""
echo "✨ Configurando CocoaPods para iOS..."
# O Podfile e a pasta iOS são esperados na raiz do projeto
if [ -d "ios" ]; then
    echo "⚙️ Entrando na pasta iOS para configurar CocoaPods..."
    pushd ios > /dev/null
    if [ -f "Podfile" ]; then
        if command -v bundle &> /dev/null && [ -f "../Gemfile" ]; then # Gemfile está na raiz, então '..'
            echo "⚙️ Executando bundle exec pod install (com Bundler)..."
            bundle exec pod install || { echo "❌ Falha ao executar bundle exec pod install. Verifique suas dependências do CocoaPods."; popd > /dev/null; exit 1; }
        else
            echo "⚙️ Executando pod install (sem Bundler)..."
            pod install || { echo "❌ Falha ao executar pod install. Verifique suas dependências do CocoaPods."; popd > /dev/null; exit 1; }
        fi
        echo "✅ CocoaPods configurado."
    else
        echo "⚠️ Podfile não encontrado na pasta iOS. Ignorando configuração do CocoaPods."
    fi
    popd > /dev/null # Volta para a pasta original
else
    echo "⚠️ Pasta 'ios' não encontrada. Ignorando configuração do CocoaPods."
fi

echo ""
echo "🎉 Configuração de ambiente concluída! Você pode iniciar seu projeto."
echo "--------------------------------------------------------"
echo "Versão do Node.js: $(node -v 2>/dev/null || echo 'Não encontrado')"
echo "Versão do Ruby: $(ruby -v 2>/dev/null | awk '{print $2}' || echo 'Não encontrado')"
echo "Caminho do Android SDK: ${ANDROID_HOME:-'Não definido'}"
echo "Caminho do Android NDK: ${ANDROID_NDK_HOME:-'Não definido'}"
echo "--------------------------------------------------------"
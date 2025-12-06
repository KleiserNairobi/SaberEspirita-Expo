const fs = require('fs');
const path = require('path');

// Altere esses caminhos:
const gradlePropsPath = path.join(__dirname, '..', '..', 'android', 'gradle.properties');
const buildGradlePath = path.join(__dirname, '..', '..', 'android', 'app', 'build.gradle');

const signingProps = `
MYAPP_UPLOAD_STORE_FILE=saber-espirita.jks
MYAPP_UPLOAD_KEY_ALIAS=saber-espirita-key
MYAPP_UPLOAD_STORE_PASSWORD=kno140469
MYAPP_UPLOAD_KEY_PASSWORD=kno140469
`;

const signingConfigReleaseBlock = `
        release {
            storeFile file(MYAPP_UPLOAD_STORE_FILE)
            storePassword MYAPP_UPLOAD_STORE_PASSWORD
            keyAlias MYAPP_UPLOAD_KEY_ALIAS
            keyPassword MYAPP_UPLOAD_KEY_PASSWORD
        }
`;

function patchGradleProperties() {
  try {
    // Adicionado try-catch para lidar com erros de arquivo
    const content = fs.readFileSync(gradlePropsPath, 'utf8');
    if (!content.includes('MYAPP_UPLOAD_STORE_FILE')) {
      fs.appendFileSync(gradlePropsPath, signingProps);
      console.log('✅ gradle.properties atualizado.');
    } else {
      console.log('ℹ️ gradle.properties já está configurado.');
    }
  } catch (error) {
    console.error(`❌ Erro ao acessar gradle.properties: ${error.message}`);
  }
}

function patchBuildGradle() {
  try {
    // Adicionado try-catch para lidar com erros de arquivo
    let content = fs.readFileSync(buildGradlePath, 'utf8');
    let lines = content.split('\n');
    let newLines = [];

    let releaseBlockAddedToSigningConfigs = false;

    let debugBlockClosingLineIndex = -1;
    let signingConfigsClosingLineIndex = -1;
    let currentDepth = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.includes('signingConfigs {')) {
        currentDepth = 1;
        continue;
      }

      if (currentDepth > 0) {
        if (line.includes('{')) {
          currentDepth++;
        }
        if (line.includes('}')) {
          currentDepth--;
          if (currentDepth === 1) {
            if (lines[i - 1] && lines[i - 1].includes('keyPassword')) {
              debugBlockClosingLineIndex = i;
            }
          } else if (currentDepth === 0) {
            signingConfigsClosingLineIndex = i;
          }
        }
      }
    }

    let tempLines = [...lines];

    if (!content.includes('storeFile file(MYAPP_UPLOAD_STORE_FILE)')) {
      if (debugBlockClosingLineIndex !== -1) {
        tempLines.splice(debugBlockClosingLineIndex + 1, 0, signingConfigReleaseBlock.trim());
        console.log('✅ release adicionado corretamente ao signingConfigs.');
        releaseBlockAddedToSigningConfigs = true;
      } else if (signingConfigsClosingLineIndex !== -1) {
        tempLines.splice(signingConfigsClosingLineIndex, 0, signingConfigReleaseBlock.trim());
        console.log('✅ release adicionado (fallback) ao signingConfigs.');
        releaseBlockAddedToSigningConfigs = true;
      } else {
        console.log('⚠️ Não foi possível encontrar local para inserir signingConfigs.release.');
      }
    } else {
      console.log('ℹ️ signingConfigs.release já existe.');
    }

    content = tempLines.join('\n');
    lines = content.split('\n');
    newLines = [];

    let inBuildTypesReleaseBlock = false;
    let buildTypesReleaseBlockDepth = 0;
    let signingConfigHandledInRelease = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      newLines.push(line);

      if (
        line.includes('release {') &&
        !inBuildTypesReleaseBlock &&
        newLines.join('\n').includes('buildTypes')
      ) {
        inBuildTypesReleaseBlock = true;
        buildTypesReleaseBlockDepth = 1;
      }

      if (inBuildTypesReleaseBlock) {
        if (line.includes('{')) {
          buildTypesReleaseBlockDepth++;
        }

        if (line.includes('}')) {
          buildTypesReleaseBlockDepth--;
        }

        if (line.includes('signingConfig signingConfigs.debug')) {
          newLines.pop();
          newLines.push('            signingConfig signingConfigs.release');
          console.log('✅ signingConfig debug substituído por release no buildTypes.release.');
          signingConfigHandledInRelease = true;
        } else if (
          buildTypesReleaseBlockDepth === 0 &&
          line.trim() === '}' &&
          !signingConfigHandledInRelease &&
          !newLines.join('\n').includes('signingConfig signingConfigs.release')
        ) {
          newLines.pop();
          newLines.push('            signingConfig signingConfigs.release');
          newLines.push(line);
          console.log('✅ signingConfig release adicionado ao buildTypes.release.');
          signingConfigHandledInRelease = true;
        }

        if (buildTypesReleaseBlockDepth === 0) {
          inBuildTypesReleaseBlock = false;
          signingConfigHandledInRelease = false;
        }
      }
    }

    fs.writeFileSync(buildGradlePath, newLines.join('\n'), 'utf8');
    console.log('✅ build.gradle finalizado.');
  } catch (error) {
    console.error(`❌ Erro ao acessar build.gradle: ${error.message}`);
  }
}

patchGradleProperties();
patchBuildGradle();

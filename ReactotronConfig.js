import Reactotron from "reactotron-react-native";
// import mmkvPlugin from 'reactotron-react-native-mmkv';

// import { storage } from './src/utils/storage';

Reactotron.configure() // Configura conexão e comunicação
  // .use(mmkvPlugin({ storage })) // Adiciona o plugin MMKV
  .useReactNative() // Incluído por padrão
  .connect(); // Conecta o Reactotron

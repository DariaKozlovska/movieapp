## Get started

WAZNE! By projekt działał nalezy wygenerować osobisty API key korzystając ze strony https://www.themoviedb.org/, 
a dalej naley umieścić kluch do pliku .env w głównym folderze projektu. EXPO_PUBLIC_TMDB_API_KEY='Twoj_API_Key'

1. Zainstaluj node.js, a po instalacji sprawdź czy działa

   ```bash
   node -v
   npm -v
   ```

2. Zainstaluj niezbędne biblioteki do obsługi projektu 

   ``` bash 
   npm install -g expo
   npm install
   npx expo install expo-router
   npx expo install react-native-root-toast
   npx expo install @react-native-async-storage/async-storage
   npm install axios
   ``` 

3. Urochom aplikacje 

   ``` bash 
   npm start
   ```

3. By wybrać środowisko nalezy wcisnąc i dla IOS Simulatora albo a dla Android Emulatora

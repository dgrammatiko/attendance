import App from './App.svelte';

// Initialize Firebase
firebase.initializeApp({
  apiKey: "__apiKey__",
  authDomain: "__authDomain__",
  databaseURL: "__databaseURL__",
  projectId: "__projectId__",
  storageBucket: "__storageBucket__",
  appId: "__appId__"
});

const app = new App({
  target: document.body
});

export default app;

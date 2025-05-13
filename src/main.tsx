import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import WalletContextProvider from "./components/WalletContextProvider.tsx";

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <WalletContextProvider>
        <App />
      </WalletContextProvider>
    </React.StrictMode>
  );
}

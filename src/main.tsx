import ReactDOM from "react-dom/client";
import './index.css'
import { App } from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/Auth.context.tsx'
import { Provider } from "react-redux";
import { store } from "./app/store/redux.ts"; // Ensure this is the correct path to your store

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // Create a root

  root.render(
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
} else {
  console.error("Root element not found. Ensure there is a div with id 'root' in your HTML.");
}

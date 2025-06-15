
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// ADD: Import QueryClient and Provider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ADD: Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  // ADD: Wrap <App /> in <QueryClientProvider>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)

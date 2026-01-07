import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import LiveApp from './LiveApp.jsx'
import './index.css'

// Hostname kontrolü ile uygulama seçimi
function RootApp() {
  const hostname = window.location.hostname
  
  // live.arhaval.com subdomain kontrolü
  const isLiveSubdomain = hostname.includes('live.')
  
  // Development modunda ?live=true query parametresi ile test edilebilir
  const urlParams = new URLSearchParams(window.location.search)
  const forceLive = urlParams.get('live') === 'true'
  const forcePortfolio = urlParams.get('portfolio') === 'true'
  
  // Query parametresi varsa ona öncelik ver
  if (forcePortfolio) {
    return <App />
  }
  
  if (isLiveSubdomain || forceLive) {
    return <LiveApp />
  }
  
  // Ana domain (arhaval.com) veya localhost - Portfolio (default)
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <RootApp />
    </BrowserRouter>
  </React.StrictMode>,
)


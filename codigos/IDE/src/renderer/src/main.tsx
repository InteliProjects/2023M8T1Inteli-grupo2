import React from 'react'
import ReactDOM from 'react-dom/client'
import VLibras from '@djpfs/react-vlibras'
import Router from './routes/router'

import './assets/index.css'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <VLibras forceOnload={true} />
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </React.StrictMode>
)

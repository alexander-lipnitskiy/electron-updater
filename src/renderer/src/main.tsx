import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import AppComponent from './App'
import { App } from 'antd'
import ElectronUpdaterProvider from './ElectronUpdaterProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App>
      <ElectronUpdaterProvider>
        <AppComponent />
      </ElectronUpdaterProvider>
    </App>
  </React.StrictMode>
)

import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import { useEffect, useState } from 'react'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [available, setAvailable] = useState<string>()
  const [downloaded, setDownloaded] = useState<string>()
  const [downloadProgress, setDownloadProgress] = useState<string>()

  useEffect(() => {
    window.update.onUpdateAvailable((value) => {
      console.log(JSON.stringify(value))
      setAvailable(JSON.stringify(value))
    })

    window.update.onUpdateDownloaded((value) => {
      console.log(JSON.stringify(value))
      setDownloaded(JSON.stringify(value))
    })

    window.update.onDownloadProgress((value) => {
      console.log(JSON.stringify(value))
      setDownloadProgress(JSON.stringify(value))
    })
  }, [])

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <button onClick={() => window.update.downloadUpdate()}>download update</button>
      <button onClick={() => window.update.installUpdate()}>install update</button>
      {available}
      {downloaded}
      {downloadProgress}
      <div className="creator">UPDATE FROM GITHUB</div>
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App

import React, { useEffect, useState } from 'react'
import './peer-puppet.js'
const {ipcRenderer} = window.require('electron')

function App() {
  const [remoteCode, setRemoteCode] = useState('')
  const [localCode, setLocalCode] = useState('')
  const [controlStatus, setControlStatus] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [ratio, setRatio] = useState(1)

  const login = async () => {
    let code = await ipcRenderer.invoke('login')
    setLocalCode(code)
  }
  const handleControlState = (e, name, type) => {
    if (type === 1) {
      setControlStatus(`正在远程控制${name}`)
    } else if (type === 0) {
      setControlStatus(`正在被${name}控制`)
    } else if (type === 2) {
      setControlStatus('')
    }
  }
  const startControl = (remoteCode) => {
    ipcRenderer.send('control', remoteCode)
  }
  const handleContextMenu = (event) => {
    event.preventDefault()
    ipcRenderer.send('copy-popup')
  }
  const handleExit = (event) => {
    ipcRenderer.send('exit-control')
  }
  const handleError = (event, message) => {
    setErrorMessage(message)
  }
  const handleRatio = (e) => {
    setRatio(Number(e.target.value))
  }

  useEffect(() => {
    login()
    ipcRenderer.on('control-state-change', handleControlState)
    ipcRenderer.on('error', handleError)
    return () => {
      ipcRenderer.removeListener('control-state-change', handleControlState)
      ipcRenderer.removeListener('error', handleError)
    }
  }, [])

  useEffect(() => {
    ipcRenderer.send('set-ratio', ratio)
  }, [ratio])

  return (
    <div className="App" style={{position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)'}}>
      {
        controlStatus === '' ?
          <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <h3 style={{ textAlign: 'center' }}>
              你的状态码:
              <span onContextMenu={e => handleContextMenu(e)}>
                {localCode}
              </span>
            </h3>
            <div>
              <label htmlFor="setRatio">设置屏幕缩放比</label>
              <select id="setRatio" onChange={e => handleRatio(e)} defaultValue={ratio.toString()}>
                <option value="1" selected={ratio === 1}>1</option>
                <option value="1.25" selected={ratio === 1.25}>1.25</option>
                <option value="1.5" selected={ratio === 1.5}>1.5</option>
              </select>
              <button onClick={() => login()}>刷新状态码</button>
            </div>
            <input type="text" value={remoteCode} onChange={(e) => {setRemoteCode(e.target.value)}} />
            <button onClick={() => startControl(remoteCode)}>确认连接</button>
            {errorMessage && <p>{errorMessage}</p>}
          </div> :
          <div>
            <h3>{controlStatus}</h3>
            <h5>你的状态码:{localCode}</h5>
            <button onClick={ (e) => {handleExit(e)}}>退出连接</button>
          </div>
      }    
    </div>
  );
}

export default App;

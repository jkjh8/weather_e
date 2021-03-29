import { app, BrowserWindow, nativeTheme, net, ipcMain } from 'electron'
import db from '../api/db'
import { server, bridge } from '../api/socket'

const setupList = {}

global.db = db

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true
      // webSecurity: false
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', async () => {
  createWindow()
  await getSetupFromDb()
  initMainServer()
  initBridgeServer()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

async function getSetupFromDb () {
  let port = await db.findOne({ id: 'serverport' })
  if (!port) { setupList.serverPort = 9999 } else { setupList.serverPort = port.value }
  port = await db.findOne({ id: 'bridgeport' })
  if (!port) { setupList.bridgePort = 9998 } else { setupList.bridgePort = port.value }
}

async function initMainServer () {
  server.read(setupList.serverPort, async (data) => {
    switch (data) {
      case 'weat': {
        const result = await db.findOne({ id: 'weather' })
        server.send(JSON.stringify(result.value))
        break
      }
      case 'dust': {
        const result = await db.findOne({ id: 'dust' })
        server.send(JSON.stringify(result.value[0]))
        break
      }
    }
  })
}

async function initBridgeServer () {
  bridge.read(setupList.bridgePort, (data) => {
    console.log('bridge', data)
  })
}

ipcMain.on('getSetup', (e) => {
  console.log(setupList)
  e.returnValue = setupList
})

ipcMain.on('req', (e, query) => {
  const req = net.request(query)
  req.on('response', (response) => {
    // console.log(`STATUS: ${response.statusCode}`)
    // console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    response.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`)
      mainWindow.webContents.send('weatherData', JSON.parse(chunk.toString()))
    })
    response.on('end', () => {
      console.log('No more data in response.')
    })
  })
  req.end()
})

ipcMain.on('getLocation', (e, query) => {
  const req = net.request(query)
  req.on('response', (response) => {
    // console.log(`STATUS: ${response.statusCode}`)
    // console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    response.on('data', (chunk) => {
      console.log(chunk.toString())
      mainWindow.webContents.send('locationData', JSON.parse(chunk.toString()))
    })
    response.on('end', () => {
      console.log('No more data in response.')
    })
  })
  req.end()
})

ipcMain.on('dustLocation', (e, query) => {
  const req = net.request(query)
  req.on('response', (response) => {
    // console.log(`STATUS: ${response.statusCode}`)
    // console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    response.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`)
      mainWindow.webContents.send('dustLocationRt', JSON.parse(chunk.toString()))
    })
    response.on('end', () => {
      console.log('No more data in response.')
    })
  })
  req.end()
})

ipcMain.on('dust', (e, query) => {
  const req = net.request(query)
  req.on('response', (response) => {
    // console.log(`STATUS: ${response.statusCode}`)
    // console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    response.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`)
      mainWindow.webContents.send('dust', JSON.parse(chunk.toString()))
    })
    response.on('end', () => {
      console.log('No more data in response.')
    })
  })
  req.end()
})

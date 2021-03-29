const net = require('net')

const tcpClient = []
const bridgeClient = []
let tcpServer
let bridgeServer

export const server = {
  read: (port, callback) => {
    tcpServer = net.createServer((socket) => {
      socket.on('data', (data) => {
        callback(data.toString())
      })
      socket.on('close', () => {
        console.log('close', socket)
        tcpClient.splice(tcpClient.indexOf(socket), 1)
      })
      socket.on('error', (err) => {
        console.log('socket error: ', JSON.stringify(err))
      })
    })
    tcpServer.addListener('connection', (socket) => {
      console.log('client connect')
      tcpClient.push(socket)
      socket.write('connect wether app')
    })
    tcpServer.addListener('data', (data) => {
      callback(data.toString())
    })
    tcpServer.listen(port, () => {
      console.log(`start tcpServer on ${port}`)
      tcpServer.on('close', () => {
        console.log('tcpServer close')
      })
      tcpServer.on('error', (err) => {
        console.log('tcpServer error: ', JSON.stringify(err))
      })
    })
  },
  send: (data) => {
    tcpClient.forEach(client => {
      client.write(data)
    })
  },
  close: () => { tcpServer.close() }
}

export const bridge = {
  read: (port, callback) => {
    bridgeServer = net.createServer((socket) => {
      socket.on('data', (data) => {
        callback(data.toString())
      })
      socket.on('close', () => {
        console.log('close', socket)
        bridgeClient.splice(bridgeClient.indexOf(socket), 1)
      })
      socket.on('error', (err) => {
        console.log('socket error: ', JSON.stringify(err))
      })
    })
    bridgeServer.addListener('connection', (socket) => {
      console.log('client connect')
      bridgeClient.push(socket)
      socket.write('connect wether app')
    })
    bridgeServer.addListener('data', (data) => {
      callback(data.toString())
    })
    bridgeServer.listen(port, () => {
      console.log(`start bridgeServer on ${port}`)
      bridgeServer.on('close', () => {
        console.log('bridgeServer close')
      })
      bridgeServer.on('error', (err) => {
        console.log('bridgeServer error: ', JSON.stringify(err))
      })
    })
  },
  send: (data) => {
    bridgeClient.forEach(client => {
      client.write(data)
    })
  },
  close: () => { bridgeServer.close() }
}

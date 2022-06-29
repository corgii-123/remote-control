if (process.platform === 'darwin') {
  // mac部分
  require('./darwin.js')
} else if (process.platform === 'win32') {
  // windows
  require('./win32.js')
}
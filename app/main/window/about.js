const openAboutWindow = require('about-window').default
const path = require('path')

const create = () => openAboutWindow({
  icon_path: path.resolve(__dirname, './icon.png'),
  package_json_dir: path.resolve(__dirname, '../../../'),
  copyright: 'Copyright (c) 2020 corgii-123',
  homepage: 'https://github.com/corgii-123'
})

module.exports = {create}
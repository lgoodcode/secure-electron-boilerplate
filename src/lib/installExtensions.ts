import installer, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'

const installExtensions = async () => {
  await installer(REACT_DEVELOPER_TOOLS)
}

export default installExtensions()

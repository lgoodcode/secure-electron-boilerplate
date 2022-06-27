const installExtensions = async () => {
	const { default: installExtensions, REACT_DEVELOPER_TOOLS } = await import(
		'electron-devtools-installer'
	)
	await installExtensions(REACT_DEVELOPER_TOOLS)
}

export default installExtensions()

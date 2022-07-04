window.electron.ipcRenderer.on('click', (args) => {
	console.log('[clicked]', args)
})

export default function Home() {
	const handleClick = () => {
		window.electron.ipcRenderer.send('click', [])
	}

	return (
		<div className="container">
			<h1>Screen Capture</h1>

			<div className="video">
				<video></video>
			</div>

			<div className="is-flex is-justify-content-space-between">
				<button id="startBtn" className="button is-primary">
					Start
				</button>
				<button id="stopBtn" className="button is-warning">
					Stop
				</button>
			</div>

			<hr />

			<button id="videoSelectBtn" className="button is-info">
				Choose a Video Source
			</button>

			<a href="https://github.com/lgoodcode" className="is-full" target="_blank" rel="noreferrer">
				<button className="button is-secondary is-fullwidth mt-4">Github</button>
			</a>

			<a href="https://www.youtube.com/" className="is-full" target="_blank" rel="noreferrer">
				<button onClick={handleClick} className="button is-danger is-fullwidth mt-4">
					YouTube
				</button>
			</a>

			<button className="button is-primary is-fullwidth mt-4" onClick={handleClick}>
				Clicker
			</button>
		</div>
	)
}

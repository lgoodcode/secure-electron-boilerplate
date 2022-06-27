export default function Home() {
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

			<button className="button is-secondary">
				<a href="https://github.com/lgoodcode" className="is-full" target="_blank" rel="noreferrer">
					Github
				</a>
			</button>
		</div>
	)
}

import { useRef } from 'react'
import useRecorder from '../../lib/useRecorder'

const { ipcRenderer } = window.electron

export default function Main() {
	const videoRef = useRef<HTMLVideoElement>(null)
	const { hasSource, recording, processing, startRecording, stopRecording } = useRecorder(videoRef)

	const handleGetSources = async () => {
		ipcRenderer.send('getVideoSources')
	}

	return (
		<div className="w-full h-full flex flex-col">
			<div className="px-4 py-8 text-center w-full">
				<h1 className="text-5xl">Screen Capture</h1>
			</div>

			<video ref={videoRef} className="w-full flex-grow flex h-auto max-h-[75vh]"></video>

			<div className="w-full flex justify-between mt-4 py-4 px-8 fixed bottom-0">
				<button
					id="videoSelectBtn"
					className="py-3 px-6 bg-amber-500 rounded text-xl disabled:opacity-70 disabled:cursor-not-allowed"
					onClick={handleGetSources}
					disabled={processing}
				>
					Choose a Video Source
				</button>

				{recording && <span>Recording</span>}
				<button
					id="stopBtn"
					className="py-3 px-6 bg-red-500 rounded text-xl disabled:opacity-70 disabled:cursor-not-allowed"
					onClick={() => startRecording()}
					disabled={!hasSource || recording || processing}
				>
					Record
				</button>

				<button
					id="stopBtn"
					className="py-3 px-6 bg-sky-500 rounded text-xl disabled:opacity-70 disabled:cursor-not-allowed"
					onClick={() => stopRecording()}
					disabled={!recording || processing}
				>
					Stop
				</button>
			</div>
		</div>
	)
}

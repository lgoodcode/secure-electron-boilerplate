import { useEffect, useState } from 'react'

const getStreamConstraints = (id: string) => ({
	audio: false,
	video: {
		mandatory: {
			chromeMediaSource: 'desktop',
			chromeMediaSourceId: id,
		},
		minWidth: 720,
		maxWidth: 1280,
		minHeight: 720,
		maxHeight: 1280,
	},
})

/**
 * useRecorder hook. Used to manage the recording process of desktop sources.
 */
export default function useRecorder(videoRef?: React.RefObject<HTMLVideoElement>) {
	const [video, setVideo] = useState<HTMLVideoElement | null>(null)
	const [stream, setStream] = useState<MediaStream | null>(null)
	const [recorder, setRecorder] = useState<MediaRecorder | null>(null)
	const [chunks, setChunks] = useState<Blob[]>([])
	const [hasSource, setHasSource] = useState(false)
	const [recording, setRecording] = useState(false)
	const [processing, setProcessing] = useState(false)
	const recorderOptions = { mimeType: 'video/webm;codecs=vp9' }

	const startRecording = () => {
		if (recorder) {
			recorder.start()
			setRecording(true)
		}
	}

	const stopRecording = () => {
		if (recorder) {
			recorder.stop()
			setRecording(false)
			setProcessing(true)

			if (video) {
				video.pause()
			}
		}
	}

	// If we are given a video element to manage, set it in state
	useEffect(() => {
		if (videoRef && videoRef.current) {
			setVideo(videoRef.current)
		}
	}, [videoRef?.current])

	// Manage the video when given a new stream
	useEffect(() => {
		if (video) {
			// Once the main process has sent the video sources, get the stream
			// using the navigator, set the playback source, and create the recorder.
			window.electron.ipcRenderer.on('getVideoSources', async (id) => {
				// Need to set type to any because the chromeMediaSource properties
				// are not part of the standard.
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const stream = await (navigator.mediaDevices as any).getUserMedia(
					getStreamConstraints(id as string)
				)

				// Set the stream to preview the video
				video.srcObject = stream
				// Prevent video from playing before it is ready.
				video.onloadeddata = () => video.play()

				setStream(stream)
			})
		}
	}, [video])

	useEffect(() => {
		if (stream) {
			const newRecorder = new MediaRecorder(stream, recorderOptions)

			newRecorder.addEventListener('dataavailable', (e) => {
				chunks.push(e.data)
			})

			newRecorder.addEventListener('stop', async () => {
				const blob = new Blob(chunks, {
					type: 'video/webm; codecs=vp9',
				})

				window.video.process(await blob.arrayBuffer())
				setStream(null)
				setHasSource(false)
				setChunks([])
			})

			setHasSource(true)
			setRecorder(newRecorder)
		}
	}, [stream])

	useEffect(() => {
		if (video) {
			// Once the main process has finished handling the video
			window.electron.ipcRenderer.on('processVideo', (err) => {
				if (err) {
					console.error(err)
				} else {
					console.log('Video processed')
				}

				if (video) {
					video.srcObject = null
				}

				setProcessing(false)
			})
		}
		return () => window.electron.ipcRenderer.off('processVideo')
	}, [video])

	return {
		hasSource,
		recording,
		processing,
		setStream,
		startRecording,
		stopRecording,
	}
}

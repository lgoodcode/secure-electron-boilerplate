import { useEffect, useState } from 'react'

const { ipcRenderer, processVideo } = window

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

  /**
   * If a video element was passed in to manage, set it in state. Because React
   * will re-render and execute this useEffect hook because the videoRef will
   * change, we check if the video element is already set to not repeat it.
   */
  useEffect(() => {
    if (videoRef && videoRef.current && !video) {
      setVideo(videoRef.current)
    }
  }, [videoRef?.current])

  /**
   * Once the video element is set, we setup the listener on the renderer
   * process for when the user selects a video source. When selected, we
   * get the id and get the stream and set it to the video element for
   * previewing.
   */
  useEffect(() => {
    if (video) {
      // Once the main process has sent the video sources, get the stream
      // using the navigator, set the playback source, and create the recorder.
      ipcRenderer.on('getVideoSources', async (id) => {
        // Need to set type to any because the chromeMediaSource properties
        // are not part of the standard.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const stream = await (navigator.mediaDevices as any).getUserMedia(
          getStreamConstraints(id as string)
        )

        // Set the stream to preview the video
        video.srcObject = stream
        // Play video when stream is loaded
        video.onloadeddata = () => video.play()

        setStream(stream)
      })
    }
  }, [video])

  /**
   * Whenever a stream is set, by the user selecting a new source to record,
   * we create and set a new recorder for that stream. We set the event
   * listeners for the recorder on recording and when stopped.
   */
  useEffect(() => {
    if (stream) {
      const newRecorder = new MediaRecorder(stream, recorderOptions)

      // When recording, add the chunks to the chunks array
      newRecorder.addEventListener('dataavailable', (e) => {
        chunks.push(e.data)
      })

      // When done recording, create a blob and send it to the main process
      newRecorder.addEventListener('stop', async () => {
        const blob = new Blob(chunks, {
          type: 'video/webm; codecs=vp9',
        })

        // Ipc communication to main process
        processVideo(await blob.arrayBuffer())

        // Done recording; remove stream, clear source flag, and reset chunks
        setStream(null)
        setHasSource(false)
        setChunks([])
      })

      // Set source flag and recorder
      setHasSource(true)
      setRecorder(newRecorder)
    }
  }, [stream])

  /**
   * Once a video element is set, we want to start listening for when the
   * main process has finished processing the video that was sent when the
   * recording concluded.
   */
  useEffect(() => {
    if (video) {
      ipcRenderer.on('processVideo', (err) => {
        if (err) {
          console.warn(err)
        } else {
          console.log('Video processed')
        }

        if (video) {
          video.srcObject = null
        }

        setProcessing(false)
      })
    }
    // Cleanup, remove event listener if video is changed
    return () => ipcRenderer.off('processVideo')
  }, [video])

  return {
    hasSource,
    recording,
    processing,
    setVideo,
    startRecording,
    stopRecording,
  }
}

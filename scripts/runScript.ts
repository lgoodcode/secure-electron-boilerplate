import { spawn } from 'child_process'

/**
 * Specify a name for a job to run the command with the supplied arguments
 * and returns a promise with a boolean value indicating whether the job
 * was successful or not.
 */
const runScript = (name: string, command: string, args: string[]) =>
  new Promise<string | null>((res) => {
    // Keep track of whether callback has been invoked to prevent multiple invocations
    let invoked = false
    const process = spawn(command, args, {
      shell: true,
      stdio: 'inherit',
    })

    process.on('error', () => {
      if (invoked) return
      invoked = true
      res(name)
    })

    process.on('exit', (code: number) => {
      if (invoked) return
      invoked = true
      res(code === 0 ? null : name)
    })
  })

export default runScript

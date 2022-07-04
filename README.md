# Fast, secure, unopinionated, Electron boilerplate

Quick start building a Electron application with a clean and simple boilerplate.

This contains the basic configuration and structure to allow you to build any kind
of Electron application you want. Whatever framework you want to use, you easily
implement it without having to deal with removing the packages you don't need!

The security of this boilerplate is based on the checklist provided by Electron
[Electron Security Guide](https://electronjs.org/docs/security)
and inspired from [secure-electron-template](https://github.com/reZach/secure-electron-template/blob/master/app/electron/main.js)].

## TODO

- [ ] Allow no-typescript
- [ ] Complete the basic example app
- [ ] Remove React
- [ ] Fix tests (need to mock ipcRenderer for frontend tests)

## Table of contents
- [Description](#description)
- [Get Started](#get-started)
- [Project Structre](#project-structure)
- [Security Features](#security-features)
- [Configuration](#configuration)

## Description

This was put together in mind to build Electron apps that doesn't come with
a type of frontend library like React or Vue. Instead, it contains all the 
basics needed to begin building an Electron app with any library by simply
installing it and getting started.

## Get Started

You can quickly create a clone using the template button.

Or, you can do it manually by cloning the repository and running the following
```bash
# Clone the repository and specify an optional name to clone it as
git clone https://github.com/lgoodcode/secure-electron-boilerplate [app-name]

# Change to the cloned directory
cd secure-electron-boilerplate (or app-name)

# Install dependencies
npm install (or yarn)

# Run the development server
npm start (or yarn start)
```

## Project Structure

### `config`

Contains the different webpack configuration files for each part as well as other utilities.

`env.ts` is used to load environment variables and perform checks to ensure required variables
are set.

`paths.ts` contains the paths to the different parts of the project.

Then there are the different webpack configurations.

### UNDER CONSTRUCTION


## Security Features

Security is a big deal, especially with Electron apps. They ship with a NodeJS
server and Chromium browser so it can be open to malicious attacks if not used
properly.

This includes features included in the security focused template
[secure-electron-template](https://github.com/reZach/secure-electron-template/blob/master/app/electron/main.js)].
It builds off of it and makes some changes that make it easier for a developer
to understand what's going on and to easily make the changes they want for their
app without worrying about undoing the security of the app.

It covers all the main security concerns covered in the 
[Electron Security Guide](https://electronjs.org/docs/security). I will briefly cover
each item from their checklist and how this app handles them.

### 1. [Only load secure content](https://www.electronjs.org/docs/latest/tutorial/security#1-only-load-secure-content)

This, is ultimately up to the developer of the app to make sure handle, as once an app
is being developed and external resources are being loaded, it's important to make sure
the a secure protocol is being used.

### 2. [Do not enable Node.js integration for remote content](https://www.electronjs.org/docs/latest/tutorial/security#2-do-not-enable-nodejs-integration-for-remote-content)

This is disabled by default by Electron, and explicitly in the `src/main/window.ts` file.
To access content remotely, it is recommended to use IPC to communicate between the 
renderer and the main process via the [`contextBridge API`](https://www.electronjs.org/docs/latest/api/context-bridge).

### 3. [Enable Context Isolation for remote content](https://www.electronjs.org/docs/latest/tutorial/security#3-enable-context-isolation-for-remote-content)

This is enabled by default by Electron, and explicitly in the `src/main/window.ts` file. 

It is a feature that allows code to run in preload scripts in a separate isolated context. This, in combination with
`nodeIntegration: false` provides strong isolation.

### 4. [Enable process sandboxing](https://www.electronjs.org/docs/latest/tutorial/security#4-enable-process-sandboxing)

This limits what renderer processes have access to. 

This is enabled globally in the `src/main/main.ts` file.

### 5. [Handle session permission requests from remote content](https://www.electronjs.org/docs/latest/tutorial/security#5-handle-session-permission-requests-from-remote-content)

By default, Electron automatically approves all permission requests, which are based on Chromiums permissions
API. This includes the camera, location, and microphone.

This is handled with the `src/lib/permissionsHandler.ts` file. It is imported into `src/main/main.ts` chained after
when the initial window is created. The file contains an a constant that will contain the allowed permissions.
It first validates the url that it is `HTTPS` or if it is originating from the origin of the app.

After that, if it's a valid request, then it checks if the requested permission is in the whitelist. If it is,
it's approved, otherwise it's denied.

### 6. [Do no disable `webSecurity`](https://www.electronjs.org/docs/latest/tutorial/security#6-do-not-disable-websecurity)

This is enabled by default by Electron, and explicitly in the `src/main/window.ts` file. 

Disabling `webSecurity` will disable the same-origin policy and set allowRunningInsecureContent property to true. 
In other words, it allows the execution of insecure code from different domains.

### 7. [Define a Content Security Policy](https://www.electronjs.org/docs/latest/tutorial/security#7-define-a-content-security-policy)

There is a ton of resources about what Content Security Policies (CSPs) are and how to use them, like [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).

The proper CSP headers are used to safely allow local content to be loaded and parsed while prohibiting external content
that isn't explicitly allowed by including origin in the CSP for the required source.

The CSP HTTP headers are set in the `index.html` template file as well as configured in the `src/main/main.ts` file with
the `src/lib/configureCSP.ts` for cases where the `webRequest.onHeadersReceived` cannot be used, such as when loading
a resource using the `file://` protocol.

### 8. [Do not enable allowRunningInsecureContent](https://www.electronjs.org/docs/latest/tutorial/security#8-do-not-enable-allowrunninginsecurecontent)

This is enabled by default by Electron, and explicitly in the `src/main/window.ts` file. 

This prevents websites loaded over `HTTPS` to load and execute scripts, CSS, or plugins from insecure sources (`HTTP`).

### 9. [Do not enable experimental features](https://www.electronjs.org/docs/latest/tutorial/security#9-do-not-enable-experimental-features)

This is disabled by default by Electron, and explicitly in the `src/main/window.ts` file. 

This enables experimental Chromium features that are not yet fully tested.

### 10. [Do not use enableBlinkFeatures](https://www.electronjs.org/docs/latest/tutorial/security#10-do-not-use-enableblinkfeatures)

This is disabled by default by Electron, and explicitly in the `src/main/window.ts` file. 

Generally speaking, there are likely good reasons if a feature was not enabled by default. Legitimate use cases for enabling specific features exist. As a developer, you should know exactly why you need to enable a feature, what the ramifications are, and how it impacts the security of your application. Under no circumstances should you enable features speculatively.

### 11. [Do not use allowpopups for WebViews](https://www.electronjs.org/docs/latest/tutorial/security#11-do-not-use-allowpopups-for-webviews)

Electron's `WebView` is disabled in the `src/main/window.ts` file. 

The `allowpopups` attribute is used on the `<webview>` tag to allow popups. Since they are disabled, the attribute
isn't an issue either.

### 12. [Verify WebView options before creation](https://www.electronjs.org/docs/latest/tutorial/security#12-verify-webview-options-before-creation)

Electron's `WebView` is disabled in the `src/main/window.ts` file. 

However, for future implementation once `WebView` becomes stable, the creation of a `<webview>` is handled in the 
`src/main/main.ts` file, under the `app.on('web-contents-created')` listener.

It strips preload scripts, disables `nodeIntegration`, and then determines if the URL is valid to allow or deny the creation of the `<webview>`.

### 13. [Disable or limit navigation](https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation)

This is handled in the `src/main/main.ts` file, under the `app.on('web-contents-created')` with the `navigationHandler` function.
There function references an environment variable, `ALLOWED_ORIGINS`, which is a comma separated list of allowed origins. On 
any navigation or redirect, it will validate the origin of the URL and if it is allowed, it will allow the navigation.

Only the whitelisted origins are allowed and all other requests will be blocked.

### 14. [Disable or limit creation of new windows](https://www.electronjs.org/docs/latest/tutorial/security#14-disable-or-limit-creation-of-new-windows)

This is handled in the `src/main/main.ts` file, under the `app.on('web-contents-created')` listener. Using the `setWindowOpenHandler`
function, it will open a window with the user's default browser.

### 15. [Do not use shell.openExternal with untrusted content](https://www.electronjs.org/docs/latest/tutorial/security#15-do-not-use-shellopenexternal-with-untrusted-content)

This is a practice where you don't want to just load untrusted content on your browser with the `shell.openExternal` API. It
can potentially be leveraged to execute arbitrary commands.

This is handled by using the `lib/isValidOrigin.ts` function in combination by the developer specifying a whitelist of
origins that are allowed. It can be used for a given url prior to invoking the `openExternal` API to determine if the
origin is allowed.

*Note: Similar to number one, this is on the developer to actually perform the check before calling the API.*

### 16. [Use a current version of Electron](https://www.electronjs.org/docs/latest/tutorial/security#16-use-a-current-version-of-electron)

This one has to be handled by the developer. A possible solution would be to setup a Github Action with dependabot so
that it can check when there is a new update.

### 17. [Validate the `sender` of all IPC messages](https://www.electronjs.org/docs/latest/tutorial/security#17-validate-the-sender-of-all-ipc-messages)

All Web Frames can in theory send IPC messages to the main process, including iframes and child windows in some scenarios. If you have an IPC message that returns user data to the sender via event.reply or performs privileged actions that the renderer can't natively, you should ensure you aren't listening to third party web frames.

This is handled using `lib/validateIpcSender.ts` which validates that the sender is the origin, comparing the host of the
url of the `senderFrame` with the environment variables that are set.


## UNDER CONSTRUCTION
## Configuration



### Content Security Policy (CSP) Headers

- `connect-src` should include the domain that it will be hosted on.
- `script-src` should include CDN that will deliver scripts, like cloudfront.net for CloudFlare.
- `style-src` should include the domain if importing any content within stylesheets like fonts.googleapis.com.
- `font-src` should include the domain if directly importing fonts.

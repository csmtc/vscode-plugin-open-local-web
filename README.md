# Local Web Server VSCode Extension

A Visual Studio Code extension that allows you to open a specified local web server (default: http://127.0.0.1:8888) directly within the VSCode editor using an embedded webview.

## Features

- Open a local web server in an embedded webview within VSCode
- Access via command palette or sidebar button
- Customizable URL configuration
- Error handling for connection issues

## Installation

1. Download the extension package
2. In VSCode, open the Extensions view (Ctrl+Shift+X)
3. Click on the "..." menu in the top-right corner
4. Select "Install from VSIX..."
5. Navigate to the downloaded extension package and select it

## Usage

### Open Local Web Server

#### Method 1: Command Palette
1. Open the Command Palette (Ctrl+Shift+P)
2. Type "Open Local Web Server" and select the command

#### Method 2: Sidebar
1. Click on the "Local Web Server" icon in the Activity Bar
2. In the sidebar, click on "打开本地Web服务器"

### Configure URL

#### Method 1: Command Palette
1. Open the Command Palette (Ctrl+Shift+P)
2. Type "Configure Local Web Server URL" and select the command
3. Enter the new URL in the input box that appears

#### Method 2: Sidebar
1. Click on the "Local Web Server" icon in the Activity Bar
2. In the sidebar, click on "配置服务器URL"
3. Enter the new URL in the input box that appears

### Configure WebView Title

#### Method 1: Command Palette
1. Open the Command Palette (Ctrl+Shift+P)
2. Type "Configure WebView Title" and select the command
3. Enter the new title in the input box that appears

#### Method 2: Sidebar
1. Click on the "Local Web Server" icon in the Activity Bar
2. In the sidebar, click on "配置WebView标题"
3. Enter the new title in the input box that appears

## Configuration

The extension will remember your configuration across sessions. You can configure the settings using the methods described above or by modifying the extension settings directly:

1. Open VSCode settings (File > Preferences > Settings)
2. Search for "Local Web Server"
3. You can configure the following settings:
   - **URL**: The URL of the local web server to open (default: http://127.0.0.1:8888)
   - **Title**: The title of the WebView panel (default: Local Web Server)

## Troubleshooting

If you encounter connection issues:
1. Ensure your local web server is running
2. Check that the URL in the settings is correct
3. Try reloading the webview using the reload button in the error message

## License

MIT
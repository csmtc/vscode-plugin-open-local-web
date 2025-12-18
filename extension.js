const vscode = require('vscode');
const path = require('path');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let webviewPanel = null;

    // 注册命令
    let disposable = vscode.commands.registerCommand('local-web-server.open', function () {
        openWebview(context);
    });

    context.subscriptions.push(disposable);

    // 注册配置命令
    let configDisposable = vscode.commands.registerCommand('local-web-server.configure', function () {
        configureUrl(context);
    });

    context.subscriptions.push(configDisposable);

    // 注册配置标题命令
    let titleConfigDisposable = vscode.commands.registerCommand('local-web-server.configureTitle', function () {
        configureTitle(context);
    });

    context.subscriptions.push(titleConfigDisposable);

    // 注册侧边栏视图
    vscode.window.registerTreeDataProvider('local-web-server-sidebar', new SidebarProvider(context));

    // 注册侧边栏点击事件
    vscode.commands.registerCommand('local-web-server-sidebar.open', () => {
        openWebview(context);
    });
}

/**
 * 打开Webview面板
 * @param {vscode.ExtensionContext} context
 */
function openWebview(context) {
    // 获取配置
    const config = vscode.workspace.getConfiguration('local-web-server');
    const title = config.get('title', 'Local Web Server');
    const url = config.get('url', 'http://127.0.0.1:8888');
    
    const panel = vscode.window.createWebviewPanel(
        'localWebServer',
        title,
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    // 设置Webview内容
    panel.webview.html = getWebviewContent(url);

    // 处理面板关闭事件
    panel.onDidDispose(() => {
        webviewPanel = null;
    });

    webviewPanel = panel;
}

/**
 * 生成Webview内容
 * @param {string} url
 * @returns {string}
 */
function getWebviewContent(url) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Local Web Server</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                height: 100vh;
                overflow: hidden;
            }
            iframe {
                width: 100%;
                height: 100%;
                border: none;
            }
            .error-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                padding: 20px;
                text-align: center;
            }
            .error-title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .error-message {
                font-size: 16px;
                margin-bottom: 20px;
            }
            .reload-button {
                padding: 8px 16px;
                background-color: #0078d4;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            .reload-button:hover {
                background-color: #0063b1;
            }
        </style>
    </head>
    <body>
        <iframe id="webview-frame" src="${url}" sandbox="allow-scripts allow-forms allow-same-origin"></iframe>
        <div id="error-overlay" class="error-container" style="display: none;">
            <div class="error-title">无法连接到服务器</div>
            <div class="error-message">请确保本地服务器正在运行，然后尝试重新加载。</div>
            <button class="reload-button" onclick="location.reload()">重新加载</button>
        </div>

        <script>
            const iframe = document.getElementById('webview-frame');
            const errorOverlay = document.getElementById('error-overlay');

            // 监听加载错误
            iframe.addEventListener('error', () => {
                showError();
            });

            // 监听加载超时
            setTimeout(() => {
                if (iframe.contentDocument && iframe.contentDocument.readyState !== 'complete') {
                    showError();
                }
            }, 5000);

            function showError() {
                iframe.style.display = 'none';
                errorOverlay.style.display = 'flex';
            }
        </script>
    </body>
    </html>`;
}

/**
 * 配置URL函数
 * @param {vscode.ExtensionContext} context
 */
async function configureUrl(context) {
    const config = vscode.workspace.getConfiguration('local-web-server');
    const currentUrl = config.get('url', 'http://127.0.0.1:8888');
    
    // 显示输入框让用户输入新的URL
    const newUrl = await vscode.window.showInputBox({
        prompt: '请输入本地Web服务器的URL',
        value: currentUrl,
        validateInput: (value) => {
            // 简单的URL验证
            try {
                new URL(value);
                return null; // 验证通过
            } catch (e) {
                return '请输入有效的URL';
            }
        }
    });
    
    // 如果用户输入了新的URL并点击了确定
    if (newUrl) {
        // 更新配置
        await config.update('url', newUrl, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`已更新URL为: ${newUrl}`);
    }
}

/**
 * 配置标题函数
 * @param {vscode.ExtensionContext} context
 */
async function configureTitle(context) {
    const config = vscode.workspace.getConfiguration('local-web-server');
    const currentTitle = config.get('title', 'Local Web Server');
    
    // 显示输入框让用户输入新的标题
    const newTitle = await vscode.window.showInputBox({
        prompt: '请输入WebView面板的标题',
        value: currentTitle,
        validateInput: (value) => {
            // 简单的标题验证
            if (!value || value.trim() === '') {
                return '标题不能为空';
            }
            return null; // 验证通过
        }
    });
    
    // 如果用户输入了新的标题并点击了确定
    if (newTitle) {
        // 更新配置
        await config.update('title', newTitle, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`已更新WebView标题为: ${newTitle}`);
    }
}

/**
 * 侧边栏数据提供者
 */
class SidebarProvider {
    constructor(context) {
        this.context = context;
    }

    getTreeItem(element) {
        return element;
    }

    getChildren(element) {
        const items = [];
        
        // 打开服务器按钮
        const openItem = new vscode.TreeItem(
            '打开本地Web服务器',
            vscode.TreeItemCollapsibleState.None
        );
        openItem.command = {
            command: 'local-web-server-sidebar.open',
            title: 'Open Local Web Server'
        };
        openItem.iconPath = {
            light: path.join(__filename, '..', 'media', 'icon.png'),
            dark: path.join(__filename, '..', 'media', 'icon.png')
        };
        items.push(openItem);
        
        // 配置URL按钮
        const configItem = new vscode.TreeItem(
            '配置服务器URL',
            vscode.TreeItemCollapsibleState.None
        );
        configItem.command = {
            command: 'local-web-server.configure',
            title: 'Configure Local Web Server URL'
        };
        configItem.iconPath = {
            light: path.join(__filename, '..', 'media', 'icon.png'),
            dark: path.join(__filename, '..', 'media', 'icon.png')
        };
        items.push(configItem);
        
        // 配置标题按钮
        const titleConfigItem = new vscode.TreeItem(
            '配置WebView标题',
            vscode.TreeItemCollapsibleState.None
        );
        titleConfigItem.command = {
            command: 'local-web-server.configureTitle',
            title: 'Configure WebView Title'
        };
        titleConfigItem.iconPath = {
            light: path.join(__filename, '..', 'media', 'icon.png'),
            dark: path.join(__filename, '..', 'media', 'icon.png')
        };
        items.push(titleConfigItem);
        return items;
    }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
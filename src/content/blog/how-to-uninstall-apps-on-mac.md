---
title: 小技巧｜在 Mac 上如何卸载程序
publishDate: '2026-04-20-10-30'
excerpt: 从 App Store、Homebrew 到官网安装的软件，我整理了几种在 Mac 上卸载应用的方法，尽量把程序和残留文件一起清理干净。
tags:
- tips
isFeatured: false
# isDraft: true
# seo:
#   image:
#     src: '../../assets/images/post-1.jpg'
#     alt: A person standing at the window
---

<!-- ![image](../../assets/images/post-3.jpg) -->

<!-- --- -->

前阵子我尝试用本地 LLM 自动补全代码，于是在 VSCode 里装了 Continue 插件。这个插件会通过 Ollama 拉起模型。之前我就因为觉得它不太好用卸载过一次，结果后来重新安装时，发现上次留下的用户配置还在。那时候我就有点不爽，心说 Mac 上删东西这件事好像也没想象的那么省心。

这次又要卸载，我就顺手研究了一下怎么才能删得更干净，也整理成这篇文章，顺便分享几种常见的卸载方式。

## 如果是从 App Store 安装

这种方式和 iOS 很像，直接在启动台里长按图标删除就可以了。

## 如果是从 Homebrew 安装

[Homebrew](https://brew.sh/) 是 Mac 上非常流行的包管理工具，我的 Python、uv 都是通过 brew 安装的。

用 brew 安装的软件，卸载起来也比较简单，在控制台里直接执行下面的指令就可以。

```bash
brew uninstall XXX
```
最后再顺手清理一下残留内容。

```bash
brew cleanup
```

## 如果是从官网安装

这种情况通常最麻烦，也是我这次真正遇到的问题。下面就以 Ollama 为例，演示一下怎么把它删干净。

### **0. 先把程序关掉**

这一步可以在 Dock 里右键退出，也可以打开控制台（Terminal），执行下面这行命令。

```bash
pkill -f ollama
```

顺带一提，如果你不太熟悉控制台，可以把它理解成一种用文本指令操控电脑的方式。和鼠标点来点去相比，很多时候它反而更快。

### **1. 删除本体**

这一步可以在 Finder 左侧的 `Applications` 中找到对应 App，然后把它拖进垃圾桶；当然，也可以直接执行下面的指令。

```bash
sudo rm -rf /Applications/ollama.app
```

### **2. 删除用户数据（可能在这些地方）**

接下来可以手动检查一下这些文件夹，看看里面有没有包含 `ollama` 的文件；如果有，就一并删掉。

```
~/Library/Application Support/
~/Library/Caches/
~/Library/Preferences/
~/Library/Logs/
~/Library/Saved Application State/
```

### **3. 删除隐藏文件夹**

如果要在 Finder 里显示隐藏文件，快捷键是 `Cmd + Shift + .`。然后到 Home 目录下找到 `.ollama` 文件夹并删除，或者直接执行下面的指令。

```bash
rm -rf ~/.ollama
```

### **4. 删除 CLI (Command Line Interface) 工具（如果有的话）**

在控制台输入下面这条命令，看看这个软件有没有安装命令行工具。

```
which ollama
```

如果输出了类似下面这样的路径，就说明它确实装了 CLI。

```
/usr/local/bin/ollama
```

接着执行下面这行命令删掉它就可以了。

```bash
sudo rm /usr/local/bin/ollama
```

### **5. 清理 Launch Agent**

`Launch Agent` 可以简单理解成 Mac 登录或启动时会自动运行的一类配置。这一步的作用，就是把 App 从开机自动启动的相关配置里清掉。

```bash
rm -rf ~/Library/LaunchAgents/com.ollama.*
```

### **最后，检查一下是否清理干净**

最后全局搜索一下包含 App 名称的文件和文件夹，确认它真的已经被删干净。

```bash
find ~ -iname "*ollama*" 2>/dev/null
```

## 好累啊

今天才发觉，原来想把一个软件卸载干净要花这么大力气。相比之下，安装软件简直轻松太多了！

可能对抗熵增的过程就是这么费劲吧。为了一个干净的环境，也只能慢慢收拾咯 😮‍💨

---
title: LeetFlash 上线啦
date: 2022-04-14 22:57:32
tags: [leetflash, react, nestjs]
categories: [fullstack]
banner_img: /img/icon.png

---

## LeetFlash是什么🤔

<!-- more -->

LeetFlash是一款基于[Spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition)思想而开发的高效复习算法题的网站。在下载并链接网站插件成功后，插件会自动记录你的刷题活动并且提供全自动化的复习时间建议。启发于各类背单词APP, 本APP非常适用于**刚刚开始刷题但苦恼于经常忘记思路和正在为面试冲刺的小伙伴**。为了方便海外和国内的小伙伴使用，LeetFlash同时支持 英文区和国区。

LeetFlash的核心目的为利用科学的间隔复习时间提升你对算法知识点的掌握能力。**请注意**，LeetFlash并不倡导对题目的死记硬背。

## 怎么使用LeetFlash 😎

### 如何下载 ⬇️

1. 进入 [LeetFlash.com](LeetFlash.com) 注册账号
2. 打开设置页面，复制API Token
3. 进入chrome插件商店下载LeetFlash插件：[地址](https://chrome.google.com/webstore/detail/leetflash/gffjifokdnkmfcjihfgnalbabnghedjc)， 并固定插件在右上角
4. 在弹出的选项页面（或手动右键插件图标）粘贴复制好的API Token
5. 链接成功后，刷题活动（例如成功提交答案）便会被自动同步到网站！

### 如何使用 🧐

#### 1️⃣Popup 弹出窗口

当你成功登陆后，在网站的任何页面都会**实时同步**你的刷题活动，成功的提交会弹出窗口并且询问你的下一次复习时间。

现在网站的Popup功能只允许对同一个账号的**一个页面**（最新打开的）进行同步。

1. 成功提交答案并通过后，网站会记录下当前的提交活动，并且设定下次的复习日期。
2. 如果题目的下一次复习时间是在**未来**，新的提交会允许你直接进入下一个stage，默认stage不会改变。
3. 如果题目的下一次复习时间**已经过去**，你可以选择在明天或者三天后复习，默认stage不会改变。
4. 如果题目的下一次复习时间是在**今天**，你可以选择在明天或者进入下一个stage，默认stage不会改变。

#### 2️⃣Daily Review 每日复习

在每日复习tab下，你可以浏览到截止日期在今天或之前的所有题的题目和笔记。笔记为你在LeetCode使用笔记本功能记录的笔记（开发中）。你可以根据对每道题的掌握能力对下一次复习时间进行调整。

#### 3️⃣DashBoard 面板 

在这个页面你可以看到所有被记录的题目，正在开发的功能有：

1. 允许手动清空一道题的stage。（回到 stage one）
2. 允许手动对已经没有复习必要的题目进行归档。
3. 允许根据`Archive` 和 `Topic Tags` 进行筛选。

# 关于LeetFlash😊

主站：https://LeetFlash.com

LeetFlash是一款基于[GPLv3](https://www.gnu.org/licenses/quick-guide-gplv3.html)的免费开源网站。核心目的是帮助正在刷题的你提供一个更方便，高效，自动化的定期复习题目的小帮手~

如果你对开发感兴趣的话，欢迎pr！源码仓库地址：[GitHub](https://github.com/q815101630/LeetFlash)

如果你觉得LeetFlash还不错，你的捐助是对我的巨大鼓励，也会给网站的正常运作带来帮助~

<img src="https://raw.githubusercontent.com/q815101630/pic_storage/main/img/202204141458456.png" alt="" style="zoom: 50%;" />
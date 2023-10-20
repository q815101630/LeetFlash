<div id="top"></div>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

[![LeetFlash][website-shield]][website-url]
[![LeetFlash][deployment-shield]][website-url]

[![Chrome][chrome-users]][chrome-url]
[![Chrome][chrome-version]][chrome-url]
[![Chrome][chrome-price]][chrome-url]

[![Follow][follows-shield]][follows-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/q815101630/LeetFlash">
    <img src="client/src/assets/logo.png" alt="Logo" width="200" height="200">
  </a>

  <h3 align="center">LeetFlash</h3>

  <p align="center">
    A reliable flashcard app for reviewing algorithm problems
    <br />
    <a href="https://leetflash.com"><strong>Explore the website »</strong></a>
    <br />
    <br />
    <a href="https://lucheng.xyz/2022/04/14/leetflash/">View Tutorial</a>
    ·
    <a href="https://www.bilibili.com/video/BV1fg411f7aC/">Video Intro (Chinese)</a>
    ·
    <a href="https://github.com/q815101630/LeetFlash/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

# 关于LeetFlash的通知 更新与 2023/10/20 

首先，我要感谢大家选择使用LeetFlash。LeetFlash是我为数不多的开源项目，我很高兴能够帮助到大家。因为我刚刚毕业和找工作的原因，我今年没有什么机会开发新的功能，我感到十分的无奈和抱歉。不过，我也偶尔能够看见一些用户在我的博客提出建议并给我打赏，非常感谢你们给我的鼓励！

然而，我需要与你们分享一个重要的事情：为了保证应用的正常运营，我个人每个月都需要承担服务器费用。尽管这个金额并不多，但是日积月累下来，这对于我来说变得越来越困难，也使得我必须考虑新的解决方案。

为了继续提供优质的服务，我需要你们的帮助和支持。

有两种方式可以帮助LeetFlash：

1. 推荐更便宜的服务器供应商： 如果你了解一些经济实惠但性能稳定的服务器供应商，请务必在[Issue页面](https://github.com/q815101630/LeetFlash/issues/25)与我分享。你的建议将对我们的项目产生深远的影响。

2. 每月捐款支持： 如果你愿意，你可以考虑每月向我们捐款，帮助我们承担服务器费用。关于具体的捐款数额和捐款方式，我还没有决定，不过我能够保证的是，这个费用只会用来cover服务器费用。如果愿意捐款的朋友不少，每个人分摊的金额将会很少（literally, 很少，几块人民币一个月）。

如果你有其他建议，欢迎留言！

我最近工作已经安顿下来，将会重新投入项目开发当中。谢谢大家。

## Updates

5/4/2022： Allow users to set a custom review sequence. 

5/16/2022: 发现中文leetcode最近换域名了，已经适配新域名

7/9/2022:

1. Disabled the popup window on the website, now the extension automatically increment the review stage after every review.
2. Users can archive a question from the Chrome notification after each new submission.
3. Allow users to archive a question from the daily review page.

7/12/2022:
Allow users to perform Archive, Reset, Activate, Delete multiple questions at once on dashboard.

2/6/2023:
Fixed some open bugs: question format in daily review page and the problem about clicking Next stage has no effect.


**请尽量通过Chrome Extension 商店下载插件**。如果因为网络原因，的确需要离线下载，[链接](https://github.com/q815101630/LeetFlash/releases/tag/offline-package)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- ABOUT THE PROJECT -->

## About The Project

When I was preparing for my interview, I always forgot how to do some questions even though I did it just several days ago. Therefore, this website is meant to help you build a more solid foundation for algorithm questions by spaced repetition.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

- [Nest.js](https://nestjs.com/)
- [React.js](https://reactjs.org/)
- [Chakra UI](https://chakra-ui.com/)
- [Mongoose](https://mongoosejs.com/)
- [TypeScript](https://www.typescriptlang.org/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

If you want to run locally, you may not run successfully because of lack of configs files.
Because the full tech-stack uses TypeScript and NPM, you can refer package.json for further details.

If you want to use the app, visit https://leetflash.com

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Finish the `Daily Review` page
- [ ] Allow users to clear states for one question
- [ ] Manually archive questions
- [ ] Allow users to filter by `Archive` AND `question topic`

See the [open issues](https://github.com/q815101630/LeetFlash/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

If you have any questions on how to contribute to this project, please contact me at lqing3@illinois.edu 

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the GPL3.0 License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Lucheng - [@blog](https://lucheng.xyz/) - q815101630@gmail.com

Project Link: [https://github.com/q815101630/LeetFlash](https://github.com/q815101630/LeetFlash)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/q815101630/leetflash?style=for-the-badge
[contributors-url]: https://github.com/q815101630/LeetFlash/graphs/contributors
[follows-shield]: https://img.shields.io/github/followers/q815101630?style=social
[follows-url]: https://github.com/q815101630
[forks-shield]: https://img.shields.io/github/forks/q815101630/leetflash?style=social
[forks-url]: https://github.com/q815101630/LeetFlash
[stars-shield]: https://img.shields.io/github/stars/q815101630/leetflash?style=social
[stars-url]: https://github.com/q815101630/LeetFlash
[issues-shield]: https://img.shields.io/github/issues/q815101630/leetflash?style=for-the-badge
[issues-url]: https://github.com/q815101630/LeetFlash/issues
[license-shield]: https://img.shields.io/github/license/q815101630/leetflash?style=for-the-badge
[license-url]: https://github.com/q815101630/LeetFlash/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[chrome-users]: https://img.shields.io/chrome-web-store/users/gffjifokdnkmfcjihfgnalbabnghedjc?color=green&label=Extension%20Users&style=flat-square
[chrome-url]: https://chrome.google.com/webstore/detail/leetflash/gffjifokdnkmfcjihfgnalbabnghedjc
[chrome-version]: https://img.shields.io/chrome-web-store/v/gffjifokdnkmfcjihfgnalbabnghedjc?label=LeetFlash%20Chrome&style=flat-square
[chrome-price]: https://img.shields.io/chrome-web-store/price/gffjifokdnkmfcjihfgnalbabnghedjc?style=flat-square
[website-shield]: https://img.shields.io/website?down_message=offline&label=LeetFlash%20Web&style=for-the-badge&up_message=online&url=https%3A%2F%2Fleetflash.com
[website-url]: https://leetflash.com
[deployment-shield]: https://img.shields.io/github/deployments/q815101630/leetflash/leetflash?label=Deployment&style=for-the-badge

---
title: LeetFlash Tutorial
date: 2022-05-12 22:57:32
tags: [leetflash, react, nestjs]
categories: [fullstack]
banner_img: /img/icon.png


---

## What is LeetFlash🤔

<!-- more -->

LeetFlash is a website based on the idea of [Spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition) to efficiently review LeetCode algorithm problems. After downloading and linking the Chrome plug-in, **LeetFlash will automatically record your question activities and provide fully automatic review time suggestions**. Inspired by Anki, this app is very suitable for those who have just started to prepare for algorithm questions but are troubled by often forgetting their thought process. In order to facilitate the use of both LeetCode and LeetCode-CN users, LeetFlash supports both sites.

The core purpose of LeetFlash is to use a scientific interval review time to improve your mastery of algorithm knowledge points. **Please note, LeetFlash does not advocate rote memorization of topics.**

## How to use LeetFlash 😎

### How to download ⬇️

1. Go to [https://leetflash.com](https://leetFlash.com) to register an account

   Now it supports two login methods: Google and email registration.

   ![Registration Page](https://raw.githubusercontent.com/q815101630/pic_storage/main/img/202204241526827.png)

2. Open the settings page and copy the API Token.

   ![Copy Token](https://raw.githubusercontent.com/q815101630/pic_storage/main/img/202204241535876.gif)

3. Enter the Chrome Extension Store to download the LeetFlash plug-in:

   ![Adding Extension](https://raw.githubusercontent.com/q815101630/pic_storage/main/img/202204241538652.gif)

4. Paste the copied API Token on the pop-up options page and click save. After receiving the following two notifications, linking is successful.

   ![Linking Success](https://raw.githubusercontent.com/q815101630/pic_storage/main/img/202204241543799.png)

5. You can now start coding and submissions will be synced at LeetFlash.

### How to use 🧐

### Workflow

1. Every time you submit a question successfully, you will receive a LeetFlash sync notification.

   ![Sync Question](https://raw.githubusercontent.com/q815101630/pic_storage/main/img/202204241557581.gif)

   

2. If you open the webpage (https://leetflash.com) while submitting the question, you will receive one of the following three popup windows: New, Review, and Early Review. Please see the **Popup window** section below.

   

3. When **a next repetition date comes**, you can view the details through **Daily Review** (Note: Daily Review will only display the questions due today or before).

   ![Daily Review](https://raw.githubusercontent.com/q815101630/pic_storage/main/img/202204241613252.gif)

   

4. You can sync notes from LeetCode as well.

   ![Sync Notes](https://raw.githubusercontent.com/q815101630/pic_storage/main/img/202204241632839.gif)

   

5. After submitting the question, you can manually select the next review date or select the time through the pop-up window

   ![Review-Pop-up](https://raw.githubusercontent.com/q815101630/pic_storage/main/img/202204241636180.gif)

   ![Review-Manual](https://raw.githubusercontent.com/q815101630/pic_storage/main/img/202204241638274.gif)

   The only difference between the two is that the pop-up window needs to be triggered by successfully submitting a question, and there is no trigger requirement for manual selection.

   

   After completing all daily review questions, you can refresh the page, and you will be prompted that all the reviews have been completed today, good job! (●'◡'●)

   

6. You can switch to open either LeetCode or LeetCode CN and switch the question language.

   ![Swtich Language](https://raw.githubusercontent.com/q815101630/pic_storage/main/img/202204241615228.gif)



### More Info

#### 1️⃣Popup

When you successfully log in, any page of the website will **sync** your practice activities, and a successful submission will pop up a window and ask your next review time.

Now the popup page of the website only allows **one page** (the latest opened) of the same account to be synchronized.。

What each button represents:

1. After the question is successfully submitted and passed, the website will record the current submission activity and set the next review date.
2. **(Early Review)** If the next review time for the topic is in the future, the new submission will allow you to go directly to the next stage, and the default stage will not change.
3. **(Overdue review)** If the next review time for the topic has passed, you can choose to review it tomorrow or three days later, and the default stage will not change.
4. **(Review in time)** If the next review time for the topic is **today**, you can choose to review it tomorrow or go directly to the next stage. The default stage will not change.



#### 2️⃣Daily Review 

Under the Daily Review tab, you can browse the questions and notes with due dates on or before today. Here you can manually select:

1. Review again tomorrow, staying at the current stage.
2. Go to the next stage.

In this way, you can consider whether you need to consolidate your memory according to your understanding of each question.

**Notes** are the notes you take using the notebook function in LeetCode. Taking into account some factors, now only the latest notes of a specific question (without distinguishing between CN and EN sites) will be synchronized.



#### 3️⃣DashBoard 

On this page you can see all the topics that have been recorded and the features under development are:

**Supported:** Manually set the review interval date

**Other features coming:**

1. Allows to manually clear the stage of a question. (back to stage one)
2. Allows manual filing of topics that are no longer necessary for review.
3. Allows filtering based on `Archive` and `Topic Tags`.

# About LeetFlash😊

Domain：https://LeetFlash.com

LeetFlash is a free and open source website based on [GPLv3](https://www.gnu.org/licenses/quick-guide-gplv3.html). The core purpose is to help you review the questions more conveniently, efficiently.

If you are interested in development, welcome to pr! Source code warehouse address: [GitHub](https://github.com/q815101630/LeetFlash)

If you think LeetFlash is not bad, your donation is a huge encouragement to me, and it will also help the normal operation of the website~

<img src="https://raw.githubusercontent.com/q815101630/pic_storage/main/img/202204141458456.png" alt="" style="zoom: 50%;" />
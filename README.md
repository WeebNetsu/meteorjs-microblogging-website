# Meteor.js Learning Material

This will become my Meteor.js course.

---

What needs to be covered

- [x] Installing Meteor.js
- [x] Creating a TypeScript React Meteor Project (feel free to cover some https://v2-docs.meteor.com/commandline)
- [ ] Collections
- [ ] Allaning Roles
- [ ] Startup
- [ ] Accounts (signup/login)
- [ ] USE UNDERSCORE instead of lodash
- [ ] Method Calls
- [ ] Trackers
- [ ] Check https://v2-docs.meteor.com/api/check
- [ ] Deploying Galaxy
- [ ] Deploying to AWS with MUP

Tutorials (plan: Admin Dashboard):

1. What is Meteor (slideshow)
2. Installing METEOR and creating a simple project
   - meteor create --typescript project name
   - Show all the folders and files in the generated project
   - Delete tests folder
3. Add proper typescript support and implement router (https://github.com/WeebNetsu/meteor-typescript-template)
   - cp -R ../meteor-typescript-template/typings/ .
   - cp -R ../meteor-typescript-template/imports/types ./imports/
   - npm install antd @ant-design/icons
   - mention https://docs.meteor.com/packages/accounts-ui.html (we will not be using it)
   - Delete hello and info .tsx files
   - Fix app.tsx to be a default export and fix main.tsx to reflect that
   - Delete everyting in api/ folder
   - Delete everything inside server/main.ts
   - Create HomePage folder and file
   - Create NotFoundPage folder and file
   - Create LoginPage folder and file (no styling needed yet)
   - Install wouter meteor npm i wouter (react router has issues in meteor)
   - Install js utils meteor npm i @netsu/js-utils
   - Add accounts-password package (to see if user is logged in and later to help them log in)
   - Create routes.tsx file and add routes (order matters)
   - Add routes to App.tsx (note that we do not use route renderer yet)

---

If you want to support the work I do, please consider donating to me on one of these platforms:

[<img alt="liberapay" src="https://img.shields.io/badge/-LiberaPay-EBC018?style=flat-square&logo=liberapay&logoColor=white" />](https://liberapay.com/stevesteacher/)
[<img alt="kofi" src="https://img.shields.io/badge/-Kofi-7648BB?style=flat-square&logo=ko-fi&logoColor=white" />](https://ko-fi.com/stevesteacher)
[<img alt="patreon" src="https://img.shields.io/badge/-Patreon-F43F4B?style=flat-square&logo=patreon&logoColor=white" />](https://www.patreon.com/Stevesteacher)
[<img alt="paypal" src="https://img.shields.io/badge/-PayPal-0c1a55?style=flat-square&logo=paypal&logoColor=white" />](https://www.paypal.com/donate/?hosted_button_id=P9V2M4Q6WYHR8)
[<img alt="youtube" src="https://img.shields.io/badge/-YouTube-fc0032?style=flat-square&logo=youtube&logoColor=white" />](https://www.youtube.com/@Stevesteacher/join)

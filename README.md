# Cookie game
This is a mobile game built with [Phaser.js](http://phaser.io/) and [Cordova](https://cordova.apache.org/). My goal was to try out Phaser and see how it performs. In the end, I think that it is kind of slow, especially on the older devices (maybe something like [Cocoonjs](https://www.ludei.com/cocoonjs/) could help). I thought that since this code just lies around unused, maybe someone will find it to be good as a reference.

P.S. I have built a similar game using [cocos2d-x](http://cocos2d-x.org/) (C++ version), it's available for [Android](https://play.google.com/store/apps/details?id=com.ces.thisismycookie), [iOS](https://itunes.apple.com/us/app/this-is-my-cookie/id1003018165) and [Windows Phone](http://windowsphone.com/s?appid=03111cd2-4506-48f1-9779-2f8e415486db).

## Simple instructions
1. Install Cordova if you haven't already (follow instructions here [Cordova docs](http://cordova.apache.org/docs/en/5.0.0/guide_cli_index.md.html#The%20Command-Line%20Interface))
2. Create a new project (follow instructions from the previous step further)
3. Remove `www` folder from your new Cordova project
4. Clone or download this repository
5. Copy `www` folder and `config.xml` over to your Cordova project
6. Install cordova plugins (if you don't want to use google play services, just leave APP_ID as it is)
```
cordova plugins add https://github.com/ptgamr/cordova-google-play-game.git --variable APP_ID=your_app_id_here
cordova plugins add https://github.com/toluhta/Immersify.git
cordova plugins add org.apache.cordova.device
cordova plugins add org.apache.cordova.media
```
7. Install npm packages (phaser and underscore)
```
cd www
npm install
```
8. Run app from project directory
`cordova run ios --emulator` or `cordova run android --emulator` or `cordova run android --device`

## Nicer Instructions (for the ones who want to be able to pull changes from the repository)
1. Install Cordova if you haven't already (follow instructions here [Cordova docs](http://cordova.apache.org/docs/en/5.0.0/guide_cli_index.md.html#The%20Command-Line%20Interface))
2. Create a new project (follow instructions from the previous step further)
3. Go into the direcotry `cd your-project-name`
4. Initialize new git repository `git init`
5. Add remote `git remote add origin git@github.com:csk157/this-is-my-cookie-cordova.git`
6. Fetch all the files from the repo and reset all the current changes (the files that were generated with a Cordova project, but are overwritten by the ones in the repository) `git fetch origin && git reset --hard origin/master`
7. Add platforms that you want to support, for example: `cordova platforms add ios`, `cordova platforms add android`
8. Install cordova plugins (if you don't want to use google play services, just leave APP_ID as it is)
```
cordova plugins add https://github.com/ptgamr/cordova-google-play-game.git --variable APP_ID=your_app_id_here
cordova plugins add https://github.com/toluhta/Immersify.git
cordova plugins add org.apache.cordova.device
cordova plugins add org.apache.cordova.media
```
9. Install npm packages (phaser and underscore)
```
cd www
npm install
```
10. Run app from project directory
`cordova run ios --emulator` or `cordova run android --emulator` or `cordova run android --device`

## Setting up achievements and leaderboards
If you wish to try using Google Play Game Services, you will need a developer account. I am sure you can find out to create achievements and leaderboards yourself.

Once you have the ids, you can plug them in: `www/src/AchievementManager.js` (achievements) and `www/src/GameResult.js` (leaderboard - line 133)
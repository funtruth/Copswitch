# HuddleC

ANDROID
Setting up from Scratch

1. Download git
https://git-scm.com/download/win
2. Create folder and git init
3. git remote add origin https://github.com/CoffeePaste/HuddleC
4. git pull origin master

5. Download Visual Studio Code

6. Follow Guide
https://facebook.github.io/react-native/docs/getting-started.html

7. Restart Powershell -> npm install

8. Go to folder /node_modules/react-native-tab-view/src/TabViewAnimated
at the 'renderHeader' and 'renderFooter' lines (approx 265 & 278),
remove the Collapsable 'View' Components
it should look like:
{renderHeader && renderHeader(props)}
and
{renderFooter && renderFooter(props)}

9. react-native run-android


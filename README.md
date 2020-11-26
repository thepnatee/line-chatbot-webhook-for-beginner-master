
# Step 1 #
- Create Project Firebase
## Config Project Setting ##
- Change Location -> Default GCP resource location  Not yet selected : asia-east2
- Change Supoort Email : xxxx@mail.com
- Upgrad Plan Project Spark to Blaze
- Create Database -> Cloud Firestore



# Step 2 #
- New Floder
- Clone Source
- cd project
- sudo npm install
- npm install firebase-admin
- npm install -g firebase-tools
- firebase login
- firebase init functions
## Install Function ##
- cd /project/function/
- sudo npm install
- npm install cors
- npm install tslint
- npm install request
- npm install request-promise
- npm install npm-check-updates
- npm install -g firebase-tools
- npm install firebase-admin
- npm install line-notify-nodejs
- npm install lineapihelper
- firebase deploy --only functions
### Go to file Webhook.ts ##


# Step 3 #
## Firebase Setting ##
- Service Accounts -> Firebase Admin SDK -> Choice Node JS. -> Copy text to ../function/src/store.ts
- Generate new private key -> copy text to ../function/config.json

### bot api ###
- sudo npm install
- npm install cors
- npm install tslint
- npm install request
- npm install request-promise
- npm install npm-check-updates
- npm install -g firebase-tools
- npm install firebase-admin
- npm install line-notify-nodejs
- npm install lineapihelper

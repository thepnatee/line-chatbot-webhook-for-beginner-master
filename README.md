
# Step 1 #
- Go to https://firebase.google.com/
- Go to Console
- Create Project Firebase (Add Profile)
- Profile Name : chatbotlab101
## Config Project Setting ##
- *** Change Location -> Default GCP resource location  Not yet selected ==> asia-east2
- ** Change Supoort Email : xxxx@mail.com
- **** Upgrad Plan Project Spark to Blaze (ใช้ Cloud Function ต้องผูกบัตร. *** หรือ หนีไป Emulator ได้เลย)
- Create Database -> Cloud Firestore
- Create Realtime Database (ต้องเอา Database URL)

# Step 2 #
- Create New Floder : {NAME}_LAB
- Clone Source : 'git clone https://github.com/thepnatee/line-chatbot-webhook-for-beginner-master.git ChatBotLAB101'
- cd ChatBotLAB101/functions/
- sudo npm install
- npm install -g firebase-tools
- npm install firebase-admin
- firebase login
## Firebase Setting ##
- ต้องมั่นใจว่า Firebase Login แล้วนะ
- firebase init functions (Enter อย่างเดียวนะไม่ต้องแก้)
- เลือกภาษา : TypeScript
## Firebase Setting ##
- เมนู Service Accounts -> Firebase Admin SDK -> Choice Node JS. -> Copy text แก้ไขที่ file นี้ ../function/src/store.ts
- Generate new private key -> copy text to ../function/config.json
- Edit Project ID From Firebase -> .firebaserc (แก้ project id จาก project setting)
- firebase deploy --only functions

### Go to file Webhook.ts ##
- แก้ token = xxxxxxxxxx. ที่ได้จาก Messaging API IN LINE Developer Console
### Option ###
- เชื่อมต่อ Dialogflow แก้ dialogflowid = yyyyyyyyyyyy
- เชื่อมต่อ LINE Notify แก้ lineNotify = zzzzzzzzzz


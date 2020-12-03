
# Step 1 #
- Create Project Firebase
## Config Project Setting ##
- Change Location -> Default GCP resource location  Not yet selected ::> asia-east2
- Change Supoort Email : xxxx@mail.com
- Upgrad Plan Project Spark to Blaze (เพื่อใช้ Cloud Function ต้องผูกบัตร)
- Create Database -> Cloud Firestore

# Step 2 #
- Create New Floder : {NAME}_LAB
- Clone Source : git clone https://github.com/thepnatee/line-chatbot-webhook-for-beginner-master.git ChatBotLAB101
- cd ChatBotLAB101/functions/
- sudo npm install
- npm install -g firebase-tools
- npm install firebase-admin
- firebase login
- firebase init functions (Enter อย่างเดียวนะไม่ต้องแก้)
## Install Function ##
- cd /project/function/
- npm install
### Firebase Setting ###
- Service Accounts -> Firebase Admin SDK -> Choice Node JS. -> Copy text to ../function/src/store.ts
- Generate new private key -> copy text to ../function/config.json
- Edit Project ID From Firebase -> .firebaserc (แก้ project id จาก project setting)
- firebase deploy --only functions

### Go to file Webhook.ts ##




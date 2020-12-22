import * as functions from 'firebase-functions'
import request = require('request-promise');

const REGION: any = process.env.FUNCTION_REGION || "asia-east2"
export const onRequest = functions.region(REGION).runWith({ timeoutSeconds: 300, memory: '1GB' }).https.onRequest

// Create By Thepnatee Phojan
// config LINE TOKEN MESSAGING API
// 1. https://developers.line.biz/console/
// 2. LINE Messaging API -> เมนู Messaging API -> Channel Access Token Copy to Replace xxxxxxxxxx
const token = 'Bearer xxxxxxxxxx'





// LINE_MESSAGING_API สำหรับใช้ในการส่งกลับหา userId ที่ได้รับจาก Event Object Message  =  /Reply , /Push
const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';

// LINE_MESSAGING_API_PROFILE สำหรับเรียกเพื่อแสดงข้อมูล Infomation ของ userId นั้นๆ 
//
// อ่านเพ่ิมเติมได้ที่ 
// https://medium.com/linedevth/%E0%B8%A3%E0%B8%B9%E0%B9%89%E0%B8%84%E0%B8%A3%E0%B8%9A%E0%B8%88%E0%B8%9A%E0%B9%83%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%80%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B8%A7%E0%B8%81%E0%B8%B1%E0%B8%9A%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%94%E0%B8%B6%E0%B8%87-user-profile-%E0%B8%9C%E0%B9%88%E0%B8%B2%E0%B8%99-api-%E0%B8%95%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%86%E0%B9%83%E0%B8%99-line-dafb17e5864a
const LINE_MESSAGING_API_PROFILE = 'https://api.line.me/v2/bot/profile';

const LINE_HEADER = {
        'Content-Type': 'application/json',
        'Authorization': token
};

// สร้าง Richmu โดยใช้ LINE Bot Designer : https://developers.line.biz/en/bot-designer/download/


// 1. https://api.line.me/v2/bot/richmenu => สำหรับสร้าง richmenu-{id} นำ JSON ที่ได้จาก LINE Bot Designer  มาใส่ใน Body
//
// 2. https://api-data.line.me/v2/bot/richmenu/richmenu-{id}  => สำหรับนำรูปที่เตรียมไว้มา Upload โดยขนาดต้องตรงเป๊ะๆ เงื่อนๆไข
//    2.1 ขนาดของ Richmenu = 2500 x 843 , 2500 x 1686
//    2.2 กรณ๊ไม่สามารถปรับขนาดภาพได้ สามารถใช้ LINE Manager -> เมนู Richmenu -> สร้าง Richmenu -> สร้างรูป -> นำรูปที่เตรียมไว้มาปรับขนาด ได้และ บันทึกภาพมาใช้ได้
//
// 3. https://api.line.me/v2/bot/user/all/richmenu/richmenu-{id} => ตั้งค่า default ให้กับ ผู้ใช้งานทุกคน

// LAB ChangeRichMenu_01 สร้าง RichMenu สองอัน 
const Richmenu1 = 'xxxxxxxx'; // ให้อันที่ 1 Set default

const Richmenu2 = 'yyyyyyyy'; // อันที่สอง ไม่ต้อง Set default (จบที่ Upload รูป)

exports.Chatbot = onRequest(async (req, res) => {
        let event = req.body.events[0]
        let message = event.message.text
        // https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects

        if (event.type === "message") {
                switch (event.message.type) {
                        // พิมพ์ #Richmenu1 เพื่อเปลี่ยน Richmenu 1
                        // พิมพ์ #Richmenu2 เพื่อเปลี่ยน Richmenu 2
                        case 'text':
                                if (message === '#Richmenu1') {
                                        ChangeRichMnu(req, Richmenu1);
                                } else if (message === '#Richmenu2') {
                                        ChangeRichMnu(req, Richmenu2);
                                } else {
                                        replyRaw(req);
                                }
                                break;
                        default:
                                replyRaw(req);
                                break;
                }

        } else if (event.type === "follow") {
                // {
                //         "destination": "xxxxxxxxxx",
                //         "events": [
                //           {
                //             "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
                //             "type": "follow",
                //             "mode": "active",
                //             "timestamp": 1462629479859,
                //             "source": {
                //               "type": "user",
                //               "userId": "U4af4980629..."
                //             }
                //           }
                //         ]
                //}
                profile(req);
        }

});

const profile = req => {


        return request({
                method: `GET`,
                uri: `${LINE_MESSAGING_API_PROFILE}/` + req.body.events[0].source.userId,
                headers: LINE_HEADER,
                json: true
        }).then((response) => {
                console.log('Profile : ', JSON.stringify(response))
                // {
                //         "userId": "Ua9980.......",
                //         "displayName": "󠀠thepnatee",
                //         "pictureUrl": "https://profile.line...",
                //         "statusMessage": "find passion",
                //         "language": "th"
                //}
                if (response.language === 'th') {
                        ChangeRichMnu(req, Richmenu1);
                } else {
                        ChangeRichMnu(req, Richmenu2);
                }

        }).catch((error) => {
                return Promise.reject(error);
        });
}


const ChangeRichMnu = (req, richId) => {
        console.log('ChangeRichMnu : ', JSON.stringify(req))
        return request.post({
                uri: 'https://api.line.me/v2/bot/user/' + req.body.events[0].userId + '/richmenu/richmenu-' + richId,
                headers: LINE_HEADER
        });
};



const replyRaw = req => {
        return request.post({
                uri: `${LINE_MESSAGING_API}/reply`,
                headers: LINE_HEADER,
                body: JSON.stringify({
                        replyToken: req.body.events[0].replyToken,
                        messages: [
                                {
                                        type: "text",
                                        text: JSON.stringify(req.body)
                                }
                        ]
                })
        });
};


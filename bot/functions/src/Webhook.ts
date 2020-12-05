import * as functions from 'firebase-functions'
import request = require('request-promise');
import db from './store';
import * as cors from 'cors'

const REGION: any = process.env.FUNCTION_REGION || "asia-east2"
export const onCall = functions.region(REGION).https.onCall
export const onRequest = functions.region(REGION).runWith({ timeoutSeconds: 300, memory: '1GB' }).https.onRequest

// config LINE TOKEN MESSAGING API
// 1. https://developers.line.biz/console/
// 2. LINE Messaging API -> เมนู Messaging API -> Channel Access Token Copy to Replace xxxxxxxxxx
const token = 'Bearer xxxxxxxxxx'


/////////////// Option ////////////////////

// config LINE TOKEN NOTIFY
// https://notify-bot.line.me/en/ -> my page -> Generate Token  Copy to Replace  zzzzzzzzzz
// ** npm install line-notify-nodejs
// กรณี ต้องการนำไปเป็นการแจ้งเตือนต่างๆ โดยสามารถเอา function ไปใช้ใน Ticker ต่างๆ 

const lineNotify = require('line-notify-nodejs')('zzzzzzzzzz');

// config DIALOGFLOW ID
// https://dialogflow.cloud.google.com/v1/integrations/line/webhook/{dialogflowid} Copy dialogflowid to Replace  yyyyyyyyyyyy
// สำหรับ foward Text ไปใช้ Dialogflow
const dialogflowid = 'yyyyyyyyyyyy';

///////////////////////////////////////////


const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';

const LINE_MESSAGING_API_PROFILE = 'https://api.line.me/v2/bot/profile';

const LINE_HEADER = {
        'Content-Type': 'application/json',
        'Authorization': token
};

exports.Chatbot = onRequest(async (req, res) => {
        let event = req.body.events[0]
        let message = event.message.text

        // https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects

        if (event.type === "message") {
                switch (event.message.type) {
                        // message
                        // Object containing the contents of the message. Message types include:
                        // Text
                        // Image
                        // Video
                        // Audio
                        // File
                        // Location
                        // Sticker
                        case 'text':
                                if (message === '#Demo') {
                                        // Demo Reply Message
                                        // แสกง Event ที่ส่งมาทั้งหมด
                                        replyRaw(req);
                                } else if (message === '#profile') {
                                        // Demo Getting Profile
                                        // แสดงข้อมูล Profile ตัวเองที่ได้จาก LINE
                                        profile(req);
                                } else if (message === '#flex') {
                                        // Demo replyFlex
                                        // https://developers.line.biz/flex-simulator/
                                        replyFlex(res, req);
                                } else if (message === '#push') {
                                        // Demo Test Push Message
                                        // ทดสอบการใช้ PUSH Message
                                        push(res, req);
                                } else if (message === 'สวัสดี') {
                                        // Demo Test reply Message
                                        // ทดสอบการใช้ Reply
                                        reply(req);
                                } else {
                                        // Demo Dialogflow
                                        // นอกเหนือจากข้อมูลที่ไม่เข้าเงื่อนไข ให้ใช้ Dialogflow
                                        postToDialogflow(req);
                                }
                                break;
                        case 'image':
                                replyRaw(req);
                                break;
                        case 'sticker':
                                replyRaw(req);
                                break;
                        case 'video':
                                replyRaw(req);
                                break;
                        case 'audio':
                                replyRaw(req);
                                break;
                        case 'file':
                                replyRaw(req);
                                break;
                        case 'location':
                                replyRaw(req);
                                break;
                        default:
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
                replyRaw(req);
        } else if (event.type === "unfollow") {
                // {
                //         "destination": "xxxxxxxxxx", // Bot ID
                //         "events": [
                //           {
                //             "type": "unfollow",
                //             "mode": "active",
                //             "timestamp": 1462629479859,
                //             "source": {
                //               "type": "user",
                //               "userId": "U4af4980629..."
                //             }
                //           }
                //         ]
                //}
                push(res, req);
        } else if (event.type === "unsend") {
                // {
                //         "destination": "xxxxxxxxxx",
                //         "events": [
                //           {
                //             "type": "unsend",
                //             "mode": "active",
                //             "timestamp": 1462629479859,
                //             "source": {
                //               "type": "group",
                //               "groupId": "Ca56f94637c...",
                //               "userId": "U4af4980629..."
                //             },
                //             "unsend": {
                //               "messageId": "325708"
                //             }
                //           }
                //         ]
                //       }

                // *  push to "groupId": "Ca56f94637c...", or  "userId": "U4af4980629..."

                push(res, req);
                // pushGroup(res, req);
        } else if (event.type === "join") {
                // {
                //         "destination": "xxxxxxxxxx",
                //         "events": [
                //           {
                //             "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
                //             "type": "join",
                //             "mode": "active",
                //             "timestamp": 1462629479859,
                //             "source": {
                //               "type": "group",
                //               "groupId": "C4af4980629..."
                //             }
                //           }
                //         ]
                //       }

                // *  push to "groupId": "Ca56f94637c...",

                replyGroup(res, req);
        } else if (event.type === "memberJoined") {
                // Event object for when a user joins a group or room that the LINE Official Account is in
                // {
                //         "destination": "xxxxxxxxxx",
                //         "events": [
                //           {
                //             "replyToken": "0f3779fba3b349968c5d07db31eabf65",
                //             "type": "memberJoined",
                //             "mode": "active",
                //             "timestamp": 1462629479859,
                //             "source": {
                //               "type": "group",
                //               "groupId": "C4af4980629..."
                //             },
                //             "joined": {
                //               "members": [
                //                 {
                //                   "type": "user",
                //                   "userId": "U4af4980629..."
                //                 },
                //                 {
                //                   "type": "user",
                //                   "userId": "U91eeaf62d9..."
                //                 }
                //               ]
                //             }
                //           }
                //         ]
                //       }
                // *  reply to "groupId": "Ca56f94637c...",

                replyGroup(res, req);
        } else if (event.type === "memberLeft") {
                // Event object for when a user leaves a group or room that the LINE Official Account is in
                // {
                //         "destination": "xxxxxxxxxx",
                //         "events": [
                //           {
                //             "type": "memberLeft",
                //             "mode": "active",
                //             "timestamp": 1462629479960,
                //             "source": {
                //               "type": "group",
                //               "groupId": "C4af4980629..."
                //             },
                //             "left": {
                //               "members": [
                //                 {
                //                   "type": "user",
                //                   "userId": "U4af4980629..."
                //                 },
                //                 {
                //                   "type": "user",
                //                   "userId": "U91eeaf62d9..."
                //                 }
                //               ]
                //             }
                //           }
                //         ]
                //       }

                pushGroup(res, req);
        } else if (event.type === "postback") {
                // {
                //         "destination": "xxxxxxxxxx",
                //         "events": [
                //           {
                //             "replyToken": "b60d432864f44d079f6d8efe86cf404b",
                //             "type": "postback",
                //             "mode": "active",
                //             "source": {
                //               "userId": "U91eeaf62d...",
                //               "type": "user"
                //             },
                //             "timestamp": 1513669370317,
                //             "postback": {
                //               "data": "storeId=12345",
                //               "params": {
                //                 "datetime": "2017-12-25T01:00"
                //               }
                //             }
                //           }
                //         ]
                //       }

                // ** Data value
                //             "postback": {
                //               "data": "storeId=12345", <==== data query string
                //               "params": {
                //                 "datetime": "2017-12-25T01:00" <===== params
                //               }
                //             }

                replyRaw(req);
        } else if (event.type === "videoPlayComplete") {
                // {
                //         "destination": "xxxxxxxxxx",
                //         "events": [
                //           {
                //             "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
                //             "type": "videoPlayComplete",
                //             "mode": "active",
                //             "timestamp": 1462629479859,
                //             "source": {
                //               "type": "user",
                //               "userId": "U4af4980629..."
                //             },
                //             "videoPlayComplete": {
                //               "trackingId": "track_id"
                //             }
                //           }
                //         ]
                //       }

                // videoPlayComplete.trackingId
                // ID used to identify a video. Returns the same value as the trackingId assigned to the video message.
                // trackingId มาจก Message Event Video
                replyRaw(req);
        }


        // เก็บข้อมูลเข้า Firestore
        addData(res, req);

});

//////////////// ADD DATA ////////////////

const addData = (res, req) => {
        const corsFn = cors()
        corsFn(req, res, async () => {
                try {
                        var datetime = new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok", hour12: false });
                        var datefull = datetime.split(',')
                        var day = datefull[0].split('/')
                        var dd = day[0]
                        var mm = day[1]
                        var yyyy = day[2]
                        var date = "'" + day[2] + '-' + day[1] + '-' + day[0] + "'"
                        var time = "'" + datefull[1] + "'"
                        const result = await db.collection("chatBot").add({
                                event: req.body.events[0],
                                messageType: req.body.events[0].type,
                                recordStatus: 'N',
                                createDate: date,
                                createDay: dd,
                                createMonth: mm,
                                createYear: yyyy,
                                createTime: time
                        })

                        res.set("Access-Control-Allow-Origin", "*")
                        res.status(200).send(result).end()
                } catch (err) {
                        console.log(err)
                        res.status(500).end()
                }
        })
}
//////////////// FUNCTION ////////////////

const postToDialogflow = req => {
        req.headers.host = "bots.dialogflow.com";
        return request.post({
                uri: "https://bots.dialogflow.com/line/" + dialogflowid + "/webhook",
                headers: req.headers,
                body: JSON.stringify(req.body)
        });
};

const push = (res, req) => {
        return request({
                method: `POST`,
                uri: `${LINE_MESSAGING_API}/push`,
                headers: LINE_HEADER,
                body: JSON.stringify({
                        to: req.body.events[0].source.userId,
                        messages: [
                                {
                                        type: "text",
                                        text: JSON.stringify(req.body)
                                }
                        ]
                })
        }).then(() => {
                return res.status(200).send(`Done`);
        }).catch((error) => {
                return Promise.reject(error);
        });
}
const pushGroup = (res, req) => {
        return request({
                method: `POST`,
                uri: `${LINE_MESSAGING_API}/push`,
                headers: LINE_HEADER,
                body: JSON.stringify({
                        replyToken: req.body.events[0].source.groupId,
                        messages: [
                                {
                                        type: "text",
                                        text: JSON.stringify(req.body)
                                }
                        ]
                })
        }).then(() => {
                return res.status(200).send(`Done`);
        }).catch((error) => {
                return Promise.reject(error);
        });
}
const replyGroup = (res, req) => {
        return request({
                method: `POST`,
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
        }).then(() => {
                return res.status(200).send(`Done`);
        }).catch((error) => {
                return Promise.reject(error);
        });
}
const reply = req => {
        return request.post({
                uri: `${LINE_MESSAGING_API}/reply`,
                headers: LINE_HEADER,
                body: JSON.stringify({
                        replyToken: req.body.events[0].replyToken,
                        messages: [
                                {
                                        "type": "text",
                                        "text": "Hello"
                                }
                        ]
                })
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

const replyFlex = (res, req) => {
        // https://developers.line.biz/flex-simulator/?
        var payload = [{
                "type": "flex",
                "altText": "ซองกฐิน",
                "contents":
                {
                        "type": "bubble",
                        "size": "mega",
                        "header": {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                        {
                                                "type": "box",
                                                "layout": "vertical",
                                                "contents": [
                                                        {
                                                                "type": "text",
                                                                "text": "FROM",
                                                                "color": "#ffffff66",
                                                                "size": "sm"
                                                        },
                                                        {
                                                                "type": "text",
                                                                "text": "Akihabara",
                                                                "color": "#ffffff",
                                                                "size": "xl",
                                                                "flex": 4,
                                                                "weight": "bold"
                                                        }
                                                ]
                                        },
                                        {
                                                "type": "box",
                                                "layout": "vertical",
                                                "contents": [
                                                        {
                                                                "type": "text",
                                                                "text": "TO",
                                                                "color": "#ffffff66",
                                                                "size": "sm"
                                                        },
                                                        {
                                                                "type": "text",
                                                                "text": "Shinjuku",
                                                                "color": "#ffffff",
                                                                "size": "xl",
                                                                "flex": 4,
                                                                "weight": "bold"
                                                        }
                                                ]
                                        }
                                ],
                                "paddingAll": "20px",
                                "backgroundColor": "#0367D3",
                                "spacing": "md",
                                "height": "154px",
                                "paddingTop": "22px"
                        },
                        "body": {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                        {
                                                "type": "text",
                                                "text": "Total: 1 hour",
                                                "color": "#b7b7b7",
                                                "size": "xs"
                                        },
                                        {
                                                "type": "box",
                                                "layout": "horizontal",
                                                "contents": [
                                                        {
                                                                "type": "text",
                                                                "text": "20:30",
                                                                "size": "sm",
                                                                "gravity": "center"
                                                        },
                                                        {
                                                                "type": "box",
                                                                "layout": "vertical",
                                                                "contents": [
                                                                        {
                                                                                "type": "filler"
                                                                        },
                                                                        {
                                                                                "type": "box",
                                                                                "layout": "vertical",
                                                                                "contents": [],
                                                                                "cornerRadius": "30px",
                                                                                "height": "12px",
                                                                                "width": "12px",
                                                                                "borderColor": "#EF454D",
                                                                                "borderWidth": "2px"
                                                                        },
                                                                        {
                                                                                "type": "filler"
                                                                        }
                                                                ],
                                                                "flex": 0
                                                        },
                                                        {
                                                                "type": "text",
                                                                "text": "Akihabara",
                                                                "gravity": "center",
                                                                "flex": 4,
                                                                "size": "sm"
                                                        }
                                                ],
                                                "spacing": "lg",
                                                "cornerRadius": "30px",
                                                "margin": "xl"
                                        },
                                        {
                                                "type": "box",
                                                "layout": "horizontal",
                                                "contents": [
                                                        {
                                                                "type": "box",
                                                                "layout": "baseline",
                                                                "contents": [
                                                                        {
                                                                                "type": "filler"
                                                                        }
                                                                ],
                                                                "flex": 1
                                                        },
                                                        {
                                                                "type": "box",
                                                                "layout": "vertical",
                                                                "contents": [
                                                                        {
                                                                                "type": "box",
                                                                                "layout": "horizontal",
                                                                                "contents": [
                                                                                        {
                                                                                                "type": "filler"
                                                                                        },
                                                                                        {
                                                                                                "type": "box",
                                                                                                "layout": "vertical",
                                                                                                "contents": [],
                                                                                                "width": "2px",
                                                                                                "backgroundColor": "#B7B7B7"
                                                                                        },
                                                                                        {
                                                                                                "type": "filler"
                                                                                        }
                                                                                ],
                                                                                "flex": 1
                                                                        }
                                                                ],
                                                                "width": "12px"
                                                        },
                                                        {
                                                                "type": "text",
                                                                "text": "Walk 4min",
                                                                "gravity": "center",
                                                                "flex": 4,
                                                                "size": "xs",
                                                                "color": "#8c8c8c"
                                                        }
                                                ],
                                                "spacing": "lg",
                                                "height": "64px"
                                        },
                                        {
                                                "type": "box",
                                                "layout": "horizontal",
                                                "contents": [
                                                        {
                                                                "type": "box",
                                                                "layout": "horizontal",
                                                                "contents": [
                                                                        {
                                                                                "type": "text",
                                                                                "text": "20:34",
                                                                                "gravity": "center",
                                                                                "size": "sm"
                                                                        }
                                                                ],
                                                                "flex": 1
                                                        },
                                                        {
                                                                "type": "box",
                                                                "layout": "vertical",
                                                                "contents": [
                                                                        {
                                                                                "type": "filler"
                                                                        },
                                                                        {
                                                                                "type": "box",
                                                                                "layout": "vertical",
                                                                                "contents": [],
                                                                                "cornerRadius": "30px",
                                                                                "width": "12px",
                                                                                "height": "12px",
                                                                                "borderWidth": "2px",
                                                                                "borderColor": "#6486E3"
                                                                        },
                                                                        {
                                                                                "type": "filler"
                                                                        }
                                                                ],
                                                                "flex": 0
                                                        },
                                                        {
                                                                "type": "text",
                                                                "text": "Ochanomizu",
                                                                "gravity": "center",
                                                                "flex": 4,
                                                                "size": "sm"
                                                        }
                                                ],
                                                "spacing": "lg",
                                                "cornerRadius": "30px"
                                        },
                                        {
                                                "type": "box",
                                                "layout": "horizontal",
                                                "contents": [
                                                        {
                                                                "type": "box",
                                                                "layout": "baseline",
                                                                "contents": [
                                                                        {
                                                                                "type": "filler"
                                                                        }
                                                                ],
                                                                "flex": 1
                                                        },
                                                        {
                                                                "type": "box",
                                                                "layout": "vertical",
                                                                "contents": [
                                                                        {
                                                                                "type": "box",
                                                                                "layout": "horizontal",
                                                                                "contents": [
                                                                                        {
                                                                                                "type": "filler"
                                                                                        },
                                                                                        {
                                                                                                "type": "box",
                                                                                                "layout": "vertical",
                                                                                                "contents": [],
                                                                                                "width": "2px",
                                                                                                "backgroundColor": "#6486E3"
                                                                                        },
                                                                                        {
                                                                                                "type": "filler"
                                                                                        }
                                                                                ],
                                                                                "flex": 1
                                                                        }
                                                                ],
                                                                "width": "12px"
                                                        },
                                                        {
                                                                "type": "text",
                                                                "text": "Metro 1hr",
                                                                "gravity": "center",
                                                                "flex": 4,
                                                                "size": "xs",
                                                                "color": "#8c8c8c"
                                                        }
                                                ],
                                                "spacing": "lg",
                                                "height": "64px"
                                        },
                                        {
                                                "type": "box",
                                                "layout": "horizontal",
                                                "contents": [
                                                        {
                                                                "type": "text",
                                                                "text": "20:40",
                                                                "gravity": "center",
                                                                "size": "sm"
                                                        },
                                                        {
                                                                "type": "box",
                                                                "layout": "vertical",
                                                                "contents": [
                                                                        {
                                                                                "type": "filler"
                                                                        },
                                                                        {
                                                                                "type": "box",
                                                                                "layout": "vertical",
                                                                                "contents": [],
                                                                                "cornerRadius": "30px",
                                                                                "width": "12px",
                                                                                "height": "12px",
                                                                                "borderColor": "#6486E3",
                                                                                "borderWidth": "2px"
                                                                        },
                                                                        {
                                                                                "type": "filler"
                                                                        }
                                                                ],
                                                                "flex": 0
                                                        },
                                                        {
                                                                "type": "text",
                                                                "text": "Shinjuku",
                                                                "gravity": "center",
                                                                "flex": 4,
                                                                "size": "sm"
                                                        }
                                                ],
                                                "spacing": "lg",
                                                "cornerRadius": "30px"
                                        }
                                ]
                        }
                }
        }]
        return request.post({
                uri: `${LINE_MESSAGING_API}/reply`,
                headers: LINE_HEADER,
                body: JSON.stringify({
                        replyToken: req.body.events[0].replyToken,
                        messages: payload
                })
        });
};
// const replySticker = req => {
//         // https://developers.line.biz/media/messaging-api/sticker_list.pdf
//         return request.post({
//                 uri: `${LINE_MESSAGING_API}/reply`,
//                 headers: LINE_HEADER,
//                 body: JSON.stringify({
//                         replyToken: req.body.events[0].replyToken,
//                         messages: [
//                                 {
//                                         type: "sticker",
//                                         packageId: "11537",
//                                         stickerId: "52002738",
//                                 }
//                         ]
//                 })
//         });
// };

const profile = req => {
        return request({
                method: `GET`,
                uri: `${LINE_MESSAGING_API_PROFILE}/` + req.body.events[0].source.userId,
                headers: LINE_HEADER,
                json: true
        }).then(async (response) => {
                await request.post({
                        uri: `${LINE_MESSAGING_API}/reply`,
                        headers: LINE_HEADER,
                        body: JSON.stringify({
                                replyToken: req.body.events[0].replyToken,
                                messages: [
                                        {
                                                type: `text`,
                                                text: JSON.stringify(response)
                                        }
                                ]
                        })
                });
        }).catch((error) => {
                return Promise.reject(error);
        });
}

// LINE Notify
exports.line_notify = onRequest(async (req, res) => {
        const corsFn = cors()
        corsFn(req, res, async () => {
                try {
                        const result = lineNotify.notify({
                                message: req.body['message'],
                        }).then(() => {
                                console.log('send completed!');
                        });
                        res.set("Access-Control-Allow-Origin", "*")
                        res.status(200).send(result).end()
                } catch (err) {
                        console.log('Error getting documents', err);
                        res.status(500).end()
                }
        })
})
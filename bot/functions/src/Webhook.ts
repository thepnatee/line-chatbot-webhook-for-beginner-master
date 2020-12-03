import * as functions from 'firebase-functions'
import request = require('request-promise');
import db from './store';
import * as cors from 'cors'

const REGION: any = process.env.FUNCTION_REGION || "asia-east2"
export const onCall = functions.region(REGION).https.onCall
export const onRequest = functions.region(REGION).runWith({ timeoutSeconds: 300, memory: '1GB' }).https.onRequest

// config LINE TOKEN MESSAGING API
const token = 'Bearer xxxxxxxxxx'

// config LINE TOKEN NOTIFY
const lineNotify = require('line-notify-nodejs')('zzzzzzzzzz');

// config DIALOGFLOW ID
// https://dialogflow.cloud.google.com/v1/integrations/line/webhook/2c84eaa6-e092-4e25-bbb8-3424d805a66f
const dialogflowid = 'wwwwwwwwwwww';


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
                                        reply(req.body);
                                } else if (message === '#profile') {
                                        // Demo Getting Profile
                                        profile(res, req);
                                } else if (message === '#flex') {
                                        // Demo replyFlex
                                        replyFlex(res, req);
                                } else if (message === '#push') {
                                        // Demo Test Push Message
                                        push(res, req);
                                } else {
                                        // Demo Dialogflow
                                        postToDialogflow(req);
                                }
                                break;
                        case 'image':
                                reply(req.body);
                                break;
                        case 'sticker':
                                replySticker(req);
                                break;
                        case 'video':
                                reply(req.body);
                                break;
                        case 'audio':
                                reply(req.body);
                                break;
                        case 'file':
                                reply(req.body);
                                break;
                        case 'location':
                                reply(req.body);
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
                reply(req.body);
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

                reply(req.body);
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
                reply(req.body);
        }

        addData(res, req);

});

//////////////// ADD DATA ////////////////

const addData = (res, req) => {
        const corsFn = cors()
        corsFn(req, res, async () => {
                try {
                        var datetime = new Date().toLocaleString("th-TH", {timeZone: "Asia/Bangkok", hour12: false});
                        var datefull = datetime.split(',')
                        var day = datefull[0].split('/')
                        var dd =  day[0]
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

                        await return_data(res, result)
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
                                        type: `text`,
                                        text: req.body
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
                        message: req.body
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
                        message: req.body
                })
        }).then(() => {
                return res.status(200).send(`Done`);
        }).catch((error) => {
                return Promise.reject(error);
        });
}
const reply = (bodyResponse) => {
        return request({
                method: `POST`,
                uri: `${LINE_MESSAGING_API}/reply`,
                headers: LINE_HEADER,
                body: JSON.stringify({
                  replyToken: bodyResponse.events[0].replyToken,
                  messages: [
                    {
                      type: `text`,
                      text: bodyResponse
                    }
                      ]
                })
              });
}
const replyFlex = (res, req) => {
        var payload = [{
                "type": "flex",
                "altText": "ซองกฐิน",
                "contents":
                {
                        "type": "bubble",
                        "direction": "ltr",
                        "header": {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                        {
                                                "type": "text",
                                                "text": "Header",
                                                "align": "center",
                                                "contents": []
                                        }
                                ]
                        },
                        "hero": {
                                "type": "image",
                                "url": "https://vos.line-scdn.net/bot-designer-template-images/bot-designer-icon.png",
                                "size": "full",
                                "aspectRatio": "1.51:1",
                                "aspectMode": "fit"
                        },
                        "body": {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                        {
                                                "type": "text",
                                                "text": "Body",
                                                "align": "center",
                                                "contents": []
                                        }
                                ]
                        },
                        "footer": {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                        {
                                                "type": "button",
                                                "action": {
                                                        "type": "uri",
                                                        "label": "Button",
                                                        "uri": "https://linecorp.com"
                                                }
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
const replySticker = req => {
        return request.post({
                uri: `${LINE_MESSAGING_API}/reply`,
                headers: LINE_HEADER,
                body: JSON.stringify({
                        replyToken: req.body.events[0].replyToken,
                        messages: [
                                {
                                        type: "sticker",
                                        packageId: "11537",
                                        stickerId: "52002738",
                                }
                        ]
                })
        });
};

const profile = (res, req) => {
        return request({
                method: `GET`,
                uri: `${LINE_MESSAGING_API_PROFILE}/` + req.body.events[0].source.userId,
                headers: LINE_HEADER,
                json: true
        }).then((response) => {
                request.post({
                        uri: `${LINE_MESSAGING_API}/reply`,
                        headers: LINE_HEADER,
                        body: JSON.stringify({
                                replyToken: req.body.events[0].replyToken,
                                messages: [
                                        {
                                                type: `text`,
                                                text: response
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
                        return_data(res, result)
                } catch (err) {
                        console.log('Error getting documents', err);
                        res.status(500).end()
                }
        })
})


const return_data = async (res: any, data: any) => {
        console.log(data)
        res.set("Access-Control-Allow-Origin", "*")
        res.status(200).send(data).end()
}

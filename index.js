//Developed by Sean V
const axios = require('axios');
const ws = require('ws')

class Client{
    constructor(pin){
        if(pin != undefined){
            this.pin = pin.toString()
        }
    }

    checkPin = async(pin)=>{
        pin = pin.toString();
        let status = true;
        const p = {"code": pin};
        const r = await axios.post('https://www.gimkit.com/api/matchmaker/find-info-from-code',p,{
            headers:{
                "content-type": "application/json;charset=UTF-8",
            }
        }).catch(()=>{
            status = false;
        });
        return status;
    }

    roomId = async()=>{
        const p = {"code": this.pin};
        const r = await axios.post('https://www.gimkit.com/api/matchmaker/find-info-from-code',p,{
            headers:{
                "content-type": "application/json;charset=UTF-8",
            }
        })
        .catch(e=>{
            console.log('Failed to get room ID!');
        });

        return await r.data.roomId;
    }

    join = async( name ) => {
        const p = {"roomId": await this.roomId(), "name": name};
        const r = await axios.post('https://www.gimkit.com/api/matchmaker/join',p)
        .catch(e=>{console.log('Failed To Join Room')});

        const room = await r.data;

        const matchmake = await axios.post(`${room.serverUrl}/matchmake/joinById/${room.roomId} `,{"intentId": room.intentId})
        .catch(e=>{
            console.log(e)
        })

        const player = await matchmake.data;

        const socket = new ws('wss' + room.serverUrl.substr(5) + `/${player.room.processId}/${room.roomId}?sessionId=${player.sessionId}`);

        socket.on('open', ()=>{
            console.log('joined');
        })
    }
}   
module.exports = Client
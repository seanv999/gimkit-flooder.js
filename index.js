const axios = require('axios');
const ws = require('ws')
const EventEmitter = require('events');
const apis = require('./src/apis')


class Gimkit extends EventEmitter{
    constructor(){
        super()
    };

    setPin = pin =>{
        this.pin = pin.toString();
        this.emit('pinSet');
    };

    checkPin = async pin =>{
        try{
            pin = pin.toString();
            await axios.post(apis.checkPin, {"code": pin} );
            return true;
        }catch(e){
            
            return false;
        };
    };

    getRoomId = async ()=>{
        try{
            const p = {"code": this.pin};
            const roomId = await axios.post(apis.roomId,p)
            return await roomId.data.roomId;

        }catch(e){
            
            this.emit('error','Failed Getting Room ID!');
        };

    };

    join = async name => {
        if(this.pin == undefined){
            console.clear();
            this.emit('error','Pin Not Set!');
            return;
        };

        try{
            if(this.roomId == undefined){
                this.roomId = await this.getRoomId();
            };

            const p = {"roomId": this.roomId, "name": name};
            const r = await axios.post(apis.matchMaker,p);
            const room = await r.data;

            const socketUrl = `${room.serverUrl}/matchmake/joinById/${room.roomId}`;
            const matchmake = await axios.post(socketUrl,{"intentId": room.intentId});
            const player = await matchmake.data;

            const socket = new ws('wss' + room.serverUrl.substr(5) + `/${player.room.processId}/${room.roomId}?sessionId=${player.sessionId}`);
            socket.on('open', ()=>{
                this.emit('joined', name);
            })

        }catch(e){
            this.emit('error', `${name} failed to join!`)
        };
    }; 
};

module.exports = Gimkit;
//SKID

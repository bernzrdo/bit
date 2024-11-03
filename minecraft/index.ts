import { createBot } from 'mineflayer';
import { actionbar, stop } from './commands';
import { scheduleJob } from 'node-schedule';

function wait(seconds: number){
    return new Promise(res=>setTimeout(res, seconds * 1e3));
}

let mcBot = createBot({
    host: process.env.MINECRAFT_SERVER!,
    username: process.env.MINECRAFT_USERNAME!,
    auth: 'offline',
    hideErrors: true
});

async function restartMinecraftServer(){

    for(let i = 30; i <= 0; i--){

        actionbar(mcBot, [
            { text: '⚠️ Aviso!', bold: true, color: 'gold' },
            { text: ' O servidor vai reiniciar em ', bold: false, color: 'gray' },
            { text: i.toString(), bold: true, color: 'gray' },
            { text: ' segundos...', bold: false, color: 'gray' }
        ]);

        await wait(1);

    }

    actionbar(mcBot, [
        { text: '⚠️ Aviso!', bold: true, color: 'gold' },
        { text: ' A reiniciar o servidor...', bold: false, color: 'gray' }
    ]);

    stop(mcBot);

}
mcBot.on('spawn', ()=>{
    console.log('[Minecraft] Ready!');
    setTimeout(()=>stop(mcBot), 3e3);
});

scheduleJob({
    hour: Number(process.env.MINECRAFT_RESTART_HOUR) - 1,
    minute: 59,
    second: 30
}, restartMinecraftServer);
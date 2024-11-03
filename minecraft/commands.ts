import { Bot } from 'mineflayer';
import { MinecraftMessage } from './types';

export function actionbar(bot: Bot, message: MinecraftMessage, target = '@a'){
    console.log(`[Minecraft] Sending to actionbar "${message.map(m=>m.text).join('')}"...`)
    bot.chat(`/title ${target} actionbar ${JSON.stringify(message)}`);
}

export function stop(bot: Bot){
    console.log('[Minecraft] Stopping server...');
    bot.chat('/stop');  
}

export default { actionbar, stop }
import { EmbedBuilder, GuildMember, GuildTextBasedChannel } from 'discord.js';
import { DEFAULT_COLOR } from '../constants';

export async function vcAnnounce(member: GuildMember, announcementsChannel: GuildTextBasedChannel): Promise<EmbedBuilder> {

    let voiceChannel = member.voice.channel;
    if(!voiceChannel){
        return new EmbedBuilder()
            .setColor(DEFAULT_COLOR)
            .setTitle('⚠️ Uh oh...')
            .setDescription('Parece que já não estás num canal de voz. Tenta outra vez quando estiveres num canal de voz.')
    }

    await announcementsChannel.send({ embeds: [new EmbedBuilder()
        .setColor(DEFAULT_COLOR)
        .setAuthor({
            name: member.displayName,
            iconURL: member.displayAvatarURL()
        })
        .setTitle(`Estou no ${voiceChannel}`)
        .setTimestamp()
    ] });

    return new EmbedBuilder()
        .setColor(DEFAULT_COLOR)
        .setTitle('📢 Anunciado!')
        .setDescription('O anúncio foi enviado com sucesso! Agora é só aguardar que apareça mais gente.')

}
import { ActionRowBuilder, ActivityType, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, Client, EmbedBuilder, Events, GatewayIntentBits, Guild, GuildTextBasedChannel, Presence } from 'discord.js';
import 'dotenv/config';
import { scheduleJob } from 'node-schedule';
import { classEmbed, getClassNow, getNextClass, getScheduleSpecs } from './util/schedule';
import { Time } from './schemas/time';
import { ANNOUNCEMENTS_CHANNEL_ID, DEFAULT_COLOR, GUILD_ID, WELCOME_CHANNEL_ID } from './constants';
import { Storage } from './util/storage';
import { Preferences } from './schemas/types';

const bot = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
] });

let guild: Guild;
let welcomeChannel: GuildTextBasedChannel;
let announcementsChannel: GuildTextBasedChannel;

let preferences = new Storage<Record<string, Preferences>>('preferences', {});

function getPreferences(userId: string): Preferences {
    return preferences[userId] ?? {
        silencedAnnounceSuggestions: false
    }
}

function setPreferences(userId: string, newPreferences: Partial<Preferences>){

    let update = {};
    update[userId] = {
        ...getPreferences(userId),
        ...newPreferences
    }

    preferences.data = { ...update, ...preferences.data }

}

bot.on(Events.ClientReady, async ()=>{
    console.log('Ready!');
    
    updateCurrentClass();

    guild = await bot.guilds.fetch(GUILD_ID);
    welcomeChannel = (await guild.channels.fetch(WELCOME_CHANNEL_ID))! as GuildTextBasedChannel;
    announcementsChannel = (await guild.channels.fetch(ANNOUNCEMENTS_CHANNEL_ID))! as GuildTextBasedChannel;

});

function updateCurrentClass(){

    let currentClass = getClassNow();

    bot.user?.setPresence({
        activities: currentClass ? [{
            name: `${currentClass.course} | ${currentClass.classroom}`,
            type: ActivityType.Custom
        }] : []
    });

}

for(let spec of getScheduleSpecs())
    scheduleJob(spec, updateCurrentClass);

function handleCommand(interaction: ChatInputCommandInteraction){

    if(interaction.commandName == 'aula'){

        let class_ = getClassNow();

        if(!class_){
            interaction.reply({ ephemeral: true, embeds: [new EmbedBuilder()
                .setColor(DEFAULT_COLOR)
                .setTitle('Nenhuma aula agora.')
                .setDescription('Não está a decorrer nenhuma aula neste momento.\nSabe mais sobre a próxima aula com o comando </próxima-aula:1302443440424091711>.')
            ]})
            return;
        }

        let diff = +class_.ends - +Time.fromDate(new Date());

        interaction.reply({ ephemeral: true, embeds: [classEmbed(class_)
            .addFields({
                name: 'Começou às',
                value: class_.starts.toString()
            },{
                name: 'Acaba às',
                value: class_.ends.toString()
            },{
                name: 'Falta',
                value: Time.fromMinutes(diff).toString()
            })
        ]})

    }

    if(interaction.commandName == 'próxima-aula'){

        let class_ = getNextClass();

        interaction.reply({ ephemeral: true, embeds: [classEmbed(class_)
            .addFields({
                name: 'Começa às',
                value: class_.starts.toString()
            },{
                name: 'Acaba às',
                value: class_.ends.toString()
            })
        ]})

    }

}

async function handleButton(interaction: ButtonInteraction){

    // vc

    if(interaction.customId == 'vc.announce'){

        // ignore if channel isn't cached
        if(!interaction.message.channel) return;

        let member = await guild.members.fetch(interaction.user.id);

        let voiceChannel = member.voice.channel;
        if(!voiceChannel){
            interaction.message.edit({ embeds: [new EmbedBuilder()
                .setColor(DEFAULT_COLOR)
                .setTitle('⚠️ Uh oh...')
                .setDescription('Parece que já não estás num canal de voz. Tenta outra vez quando estiveres num canal de voz.')
            ], components: [] });
            return;
        }

        announcementsChannel.send({ embeds: [new EmbedBuilder()
            .setColor(DEFAULT_COLOR)
            .setAuthor({
                name: member.displayName,
                iconURL: member.displayAvatarURL()
            })
            .setTitle(`Estou no ${voiceChannel}`)
            .setTimestamp()
        ] });

        interaction.message.edit({ embeds: [new EmbedBuilder()
            .setColor(DEFAULT_COLOR)
            .setTitle('📢 Anunciado!')
            .setDescription('O anúncio foi enviado com sucesso! Agora é só aguardar que apareça mais gente.')
        ], components: [] });

    }

    if(interaction.customId == 'vc.silence-announce-suggestions'){

        // ignore if channel isn't cached
        if(!interaction.message.channel) return;

        setPreferences(interaction.user.id, { silencedAnnounceSuggestions: true });

        interaction.message.edit({ embeds: [new EmbedBuilder()
            .setColor(DEFAULT_COLOR)
            .setTitle('Sugestões de anúncio desligadas!')
            .setDescription('Não irei perguntar mais se desejas anunciar que estás num canal de voz.')
        ], components: [] })

    }

}

bot.on(Events.InteractionCreate, async interaction=>{
    if(interaction.isChatInputCommand()) handleCommand(interaction);
    if(interaction.isButton()) handleButton(interaction);
});

bot.on(Events.GuildMemberRemove, async member=>{
    if(member.guild.id != welcomeChannel.guildId) return;
    welcomeChannel.send(`Até à próxima, **${member.displayName}**. 👋`);
});

bot.on(Events.VoiceStateUpdate, (oldState, newState)=>{

    // joined or switched
    if(newState.channelId){

        // is alone
        if(newState.channel!.members.size == 1){
            if(!newState.member) return;

            // respect user preferences
            if(getPreferences(newState.member.id).silencedAnnounceSuggestions) return;

            newState.member.send({ embeds: [new EmbedBuilder()
                .setColor(DEFAULT_COLOR)
                .setTitle('Precisas de companhia?')
                .setDescription(`Se quiseres, podes anunciar que acabaste de entrar no canal de voz ${newState.channel} para que mais gente se junte a ti! Se não, podes ignorar esta mensagem.`)
            ], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId('vc.announce')
                    .setEmoji('📢')
                    .setLabel('Anunciar')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('vc.silence-announce-suggestions')
                    .setLabel('Não perguntar novamente')
                    .setStyle(ButtonStyle.Secondary)
            )] });

        }

    }

});

bot.login(process.env.DISCORD_TOKEN!);
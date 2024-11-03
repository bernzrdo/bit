import { ActionRowBuilder, ActivityType, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, Client, Collection, EmbedBuilder, Events, GatewayIntentBits, Guild, GuildTextBasedChannel, Message, ModalSubmitInteraction, Presence } from 'discord.js';
import 'dotenv/config';
import { scheduleJob } from 'node-schedule';
import { classEmbed, getClassNow, getNextClass, getScheduleSpecs } from './util/schedule';
import { Time } from './schemas/time';
import { ANNOUNCEMENTS_CHANNEL_ID, DEFAULT_COLOR, GUILD_ID, TEST_GUILD_ID, WELCOME_CHANNEL_ID } from './constants';
import { Storage } from './util/storage';
import { Event, eventSchema, Preferences } from './schemas/types';
import { vcAnnounce } from './commands/vc-announce';
import { generateModal } from './util/modal';
import { calendar, eventEmbed } from './commands/calendar';

const bot = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
]});

let guild: Guild;
let welcomeChannel: GuildTextBasedChannel;
let announcementsChannel: GuildTextBasedChannel;

let preferences = new Storage<Record<string, Preferences>>('preferences', {});
let events = new Storage<Event[]>('events', []);
let storages = [preferences, events];

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

async function handleCommand(interaction: ChatInputCommandInteraction){

    if(interaction.commandName == 'calendário'){
        interaction.reply(await calendar(events, new Date()));
        return;
    }

    if(interaction.guildId == GUILD_ID){

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
    
        if(interaction.commandName == 'anunciar-voz'){
            let embed = await vcAnnounce(
                await guild.members.fetch(interaction.user.id),
                announcementsChannel
            );
            interaction.reply({ embeds: [embed], ephemeral: true });
        }

    }

    // dev commands
    if(interaction.guildId == TEST_GUILD_ID){
        
        if(interaction.commandName == 'refresh'){

            for(let storage of storages)
                await storage.fetch();

            interaction.reply('Atualizado!');
        }

        if(interaction.commandName == 'del'){

            let channelId = interaction.options.getString('channel-id')!;
            let channel = await bot.channels.fetch(channelId);
            if(!channel) return interaction.reply('Não consegui encontrar esse canal.');
            if(!channel.isTextBased()) return interaction.reply('Esse canal não tem mensagens.');

            let msgId = interaction.options.getString('message-id')!;
            let msg = await channel.messages.fetch(msgId);
            if(!msg) return interaction.reply('Não consegui encontrar essa mensagem.');
            if(!msg.deletable) return interaction.reply('Não consigo apagar essa mensagem.');

            await msg.delete();
            interaction.reply('Apagado!');
        }

        if(interaction.commandName == 'criar-evento'){

            interaction.showModal(generateModal({
                custom_id: 'criar-evento',
                title: 'Criar Evento',
                components: [{
                    custom_id: 'type',
                    label: 'Tipo de Evento',
                    placeholder: 'Teste, Ficha, Exame, Sessão Extra, etc.'
                },{
                    custom_id: 'course',
                    label: 'Cadeira',
                    required: false
                },{
                    custom_id: 'title',
                    label: 'Título',
                    required: false
                },{
                    custom_id: 'date',
                    label: 'Data e Hora',
                    placeholder: 'YYYY-MM-DD HH:MM'
                },{
                    custom_id: 'duration',
                    label: 'Duração',
                    required: false
                }]
            }));

        }

    }

}

async function handleButton(interaction: ButtonInteraction){

    // calendar

    if(interaction.customId.startsWith('cal.')){
        let date = new Date(interaction.customId.replace('cal.', ''));
        interaction.update(await calendar(events, date));
    }

    // vc

    if(interaction.customId == 'vc.announce'){

        // ignore if channel isn't cached
        if(!interaction.message.channel) return;

        let embed = await vcAnnounce(
            await guild.members.fetch(interaction.user.id),
            announcementsChannel
        );
        interaction.message.edit({ embeds: [embed], components: [] });

    }

    if(interaction.customId == 'vc.ignore-announce-suggestion'){

        // ignore if channel isn't cached
        if(!interaction.message.channel) return;

        interaction.message.delete();

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

async function handleModalSubmit(interaction: ModalSubmitInteraction){

    function getData<T extends string>(fields: T[]){

        let res: { [K in T]?: string } = {};

        for(let field of fields){
            let value = interaction.fields.getTextInputValue(field);
            if(value) res[field] = value;
        }

        return res;
    }

    if(interaction.customId == 'criar-evento'){

        let formData = getData(['title','course','type','date','duration']);

        if(formData.course)
            formData.course = formData.course.toUpperCase();

        let parse = eventSchema.safeParse(formData);
        if(!parse.success)
            return interaction.reply(parse.error.toString());

        events.data = [...events.data, parse.data];

        interaction.reply({ content: 'Evento criado!', embeds: [eventEmbed(parse.data)] });

    }

}

bot.on(Events.InteractionCreate, async interaction=>{
    if(interaction.isChatInputCommand()) handleCommand(interaction);
    if(interaction.isButton()) handleButton(interaction);
    if(interaction.isModalSubmit()) handleModalSubmit(interaction);
});

bot.on(Events.GuildMemberRemove, async member=>{
    if(member.guild.id != welcomeChannel.guildId) return;
    welcomeChannel.send(`Até à próxima, **${member.displayName}**. 👋`);
});

bot.on(Events.VoiceStateUpdate, async (oldState, newState)=>{

    // joined or switched
    if(newState.channelId){

        // is alone
        if(newState.channel!.members.size == 1){
            if(!newState.member) return;

            // respect user preferences
            if(getPreferences(newState.member.id).silencedAnnounceSuggestions) return;

            let message = await newState.member.send({ embeds: [new EmbedBuilder()
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
                    .setCustomId('vc.ignore-announce-suggestion')
                    .setLabel('Ignorar')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('vc.silence-announce-suggestions')
                    .setLabel('Não perguntar novamente')
                    .setStyle(ButtonStyle.Secondary)
            )] });

            // delete after 5 minutes
            setTimeout(()=>message.delete(), 5 * 60e3);

        }

    }

});

bot.login(process.env.DISCORD_TOKEN!);
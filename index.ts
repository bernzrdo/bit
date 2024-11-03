import { ActivityType, Client, EmbedBuilder, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import { scheduleJob } from 'node-schedule';
import { getClassNow, getNextClass, getScheduleSpecs } from './util/schedule';
import { Class } from './schemas/types';
import { Time } from './schemas/time';
import { COURSE_INFO, DEFAULT_COLOR } from './constants';

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

function updateCurrentClass(){

    let currentClass = getClassNow();

    bot.user?.setPresence({
        activities: currentClass ? [{
            name: `${COURSE_INFO[currentClass.course].name} | ${currentClass.classroom}`,
            type: ActivityType.Custom
        }] : []
    });

}

for(let spec of getScheduleSpecs())
    scheduleJob(spec, updateCurrentClass);

bot.on('ready', ()=>{
    console.log('[Discord] Ready!');
    updateCurrentClass();
});

bot.on('interactionCreate', async interaction=>{
    if(!interaction.isChatInputCommand()) return;

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

});

function classEmbed(class_: Class){

    let info = COURSE_INFO[class_.course];

    return new EmbedBuilder()
        .setColor(DEFAULT_COLOR)
        .setTitle(class_.course)
        .setDescription(`*${info.name}*`)
        .setURL(info.url)
        .setAuthor({
            name: info.professor.name,
            url: info.professor.url
        })
        .addFields({
            name: 'Sala',
            value: class_.classroom
        })
}

bot.login(process.env.DISCORD_TOKEN!);
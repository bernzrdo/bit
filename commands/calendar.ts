import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { Storage } from '../util/storage';
import { Event } from '../schemas/types';
import { COURSE_INFO, DEFAULT_COLOR } from '../constants';
import { Time } from '../schemas/time';

function isSameDate(a: Date, b: Date){
    return (
        a.getDate() == b.getDate() &&
        a.getMonth() == b.getMonth() &&
        a.getFullYear() == b.getFullYear()
    )
}

function eventTitle(event: Event){
    if(event.title) return event.title;

    let title = event.type;

    if(event.course)
        title += ` de ${event.course.length == 1 ? COURSE_INFO[event.course].name : event.course}`;

    return title;
}

function printDate(template: string, date: Date){
    return template
        .replaceAll('DD', date.getDate().toString())
        .replaceAll('MMMM', MONTHS[date.getMonth()])
        .replaceAll('MM', (date.getMonth() + 1).toString())
        .replaceAll('YYYY', date.getFullYear().toString());
}

const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const DOTW = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export async function calendar(events: Storage<Event[]>, date: Date): Promise<{
    content: string,
    embeds: EmbedBuilder[],
    components: [ActionRowBuilder<ButtonBuilder>]
}> {

    let start = new Date(date.getTime());

    await events.fetch();

    // go to start of week
    while(start.getDay() != 1)
        start.setDate(start.getDate() - 1);

    // get end of week
    let end = new Date(start.getTime());
    end.setDate(end.getDate() + 6);

    // generate message title
    let content = '** Semana ';

    if(start.getMonth() == end.getMonth())
        content += printDate('DD', start);
    else if(start.getFullYear() == end.getFullYear())
        content += printDate('DD de MMMM', start);
    else
        content += printDate('DD de MMMM de YYYY', start);
    
    content += ` a ${printDate('DD de MMMM de YYYY', end)}**`;

    // get events of the week

    let embeds: EmbedBuilder[] = [];

    let pointer = new Date(start.getTime());
    end.setDate(end.getDate() + 1);
    while(!isSameDate(pointer, end)){
        
        for(let event of events.data.filter(e=>isSameDate(new Date(e.date), pointer)))
            embeds.push(eventEmbed(event));

        pointer.setDate(pointer.getDate() + 1);
    }

    if(embeds.length == 0)
        content += '\n\nSem eventos nesta semana.';

    let row = new ActionRowBuilder<ButtonBuilder>();

    start.setDate(start.getDate() - 7);
    row.addComponents(

        new ButtonBuilder()
            .setLabel('←')
            .setCustomId(`cal.${printDate('YYYY-MM-DD', start)}`)
            .setStyle(ButtonStyle.Secondary),
        
        new ButtonBuilder()
            .setLabel('→')
            .setCustomId(`cal.${printDate('YYYY-MM-DD', end)}`)
            .setStyle(ButtonStyle.Secondary)
        
    );

    return { content, embeds, components: [row] }
}

export function eventEmbed(event: Event){

    let date = new Date(event.date);

    let embed = new EmbedBuilder()
        .setColor(DEFAULT_COLOR)
        .setTitle(eventTitle(event))
        .addFields({
            name: 'Data',
            value: `${DOTW[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()].substring(0, 3)} ${date.getFullYear()}`,
            inline: true
        })
    
    let time = Time.fromDate(date);
    if(time.hour != 0 || time.minute != 0){
        embed.addFields({
            name: 'Hora',
            value: time.toString(),
            inline: true
        });
    }

    if(event.duration){
        let duration = Time.fromMinutes(event.duration);
        embed.addFields({
            name: 'Duração',
            value: duration.toString(),
            inline: true
        });
    }

    return embed;
}
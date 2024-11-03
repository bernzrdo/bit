import { RecurrenceSpecObjLit } from 'node-schedule';
import { COURSE_INFO, DEFAULT_COLOR, SCHEDULE } from '../constants';
import { Class } from '../schemas/types';
import { EmbedBuilder } from 'discord.js';

function getClassAt(date: Date): Class | undefined {
    if(!date) date = new Date();
    return SCHEDULE[date.getDay()].find(c=>c.starts.compareDate('<=', date) && c.ends.compareDate('>', date));
}

export function getClassNow(){
    return getClassAt(new Date());
}

export function getNextClass(date?: Date): Class {

    let pointerDate = new Date(date ? date.getTime() : Date.now());

    let currentClass = getClassAt(date ?? new Date());
    let nextClass: Class | undefined;

    do{

        pointerDate.setMinutes(pointerDate.getMinutes() + 1);

        nextClass = getClassAt(pointerDate);

    }while(!nextClass || nextClass.course == currentClass?.course);

    return nextClass;
}

export function getScheduleSpecs(){

    let specs: RecurrenceSpecObjLit[] = [];

    // each weekday
    for(let [dayOfWeek, classes] of SCHEDULE.entries()){

        // each class
        for(let { starts, ends } of classes){

            // push class start
            if(!specs.find(t=>t.hour == starts.hour && t.minute == starts.minute && t.dayOfWeek == dayOfWeek))
                specs.push({
                    dayOfWeek,
                    hour: starts.hour,
                    minute: starts.minute
                });

            // push class end
            if(!specs.find(t=>t.hour == ends.hour && t.minute == ends.minute && t.dayOfWeek == dayOfWeek))
                specs.push({
                    dayOfWeek,
                    hour: ends.hour,
                    minute: ends.minute
                });
            
        }

    }

    return specs;
}

export function classEmbed(class_: Class){

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
import { RecurrenceSpecObjLit } from 'node-schedule';
import { SCHEDULE } from '../constants';
import { Class } from '../schemas/types';

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
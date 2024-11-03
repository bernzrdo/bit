
export class Time {

    constructor(hour: number = 0, minute: number = 0){
        this.hour = hour;
        this.minute = minute;
    }

    static fromDate(date: Date){
        return new this(date.getHours(), date.getMinutes());
    }

    static fromMinutes(minute: number){
        return new this(0, minute);
    }

    #hour: number;
    get hour(){ return this.#hour }
    set hour(hour: number){
        if(hour < 0) hour = 0;

        if(hour % 1 != 0){
            this.minute = (hour % 1) * 60;
            hour = Math.floor(hour);
        }

        this.#hour = hour;
    }

    #minute: number;
    get minute(){ return this.#minute }
    set minute(minute: number){
        if(minute < 0) minute = 0;

        minute = Math.round(minute);

        while(minute >= 60){
            minute -= 60;
            this.hour++;
        }

        this.#minute = minute;
    }

    compareDate(comparison: '<' | '<=' | '=' | '>=' | '>', date: Date){
    
        let hour = date.getHours();
        let minute = date.getMinutes();
    
        let isEqual = this.hour == hour && this.minute == minute;
        let isBefore = this.hour < hour || (this.hour == hour && this.minute < minute);
        let isAfter = this.hour > hour || (this.hour == hour && this.minute > minute);
    
        switch(comparison){
            case '<': return isBefore;
            case '<=': return isEqual || isBefore;
            case '=': return isEqual;
            case '>=': return isEqual || isAfter;
            case '>': return isAfter;
            default: throw new Error('Invalid comparison!');
        }
    
    }

    toString(){
        if(this.hour == 0) return `${this.minute}m`;
        return `${this.hour}h${this.minute.toString().padStart(2, '0')}`
    }

    valueOf(){ return this.hour * 60 + this.minute }

}
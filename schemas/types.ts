import { Time } from './time';

export type Course = 'CDI' | 'TMD' | 'LSD' | 'PG' | 'E';

export interface CourseInfo {
    name: string;
    url: string;
    professor: Professor;
}

export type Classroom = 'C.1.07' | 'F.0.46' | 'F.1.04' | 'G.0.14' | 'F.0.47';

export type Class = {
    course: Course;
    classroom: Classroom;
    starts: Time;
    ends: Time;
}

export type Gender = 'male' | 'female' | 'nonbinary'

export interface Professor {
    name: string;
    url: string;
}

export interface Preferences {
    silencedAnnounceSuggestions: boolean;
}
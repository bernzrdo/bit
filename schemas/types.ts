import { z } from 'zod';
import { Time } from './time';

export type Course = 'ALGA' | 'AED' | 'AC' | 'LIC' | 'RC';
// export type Course = 'CDI' | 'TMD' | 'LSD' | 'PG' | 'E';

export const courseSchema = z.union([
    z.literal('ALGA'),
    z.literal('AED'),
    z.literal('AC'),
    z.literal('LIC'),
    z.literal('RC')
    // z.literal('CDI'),
    // z.literal('TMD'),
    // z.literal('LSD'),
    // z.literal('PG'),
    // z.literal('E')
]);

export interface CourseInfo {
    name: string;
    url: string;
    professor: Professor;
}

export type Class = {
    course: Course;
    classroom: string;
    starts: Time;
    ends: Time;
}

export interface Professor {
    name: string;
    url: string;
}

export interface Preferences {
    silencedAnnounceSuggestions: boolean;
}

export interface Event {
    title?: string;
    course?: Course;
    type: string;
    date: Date;
    duration?: number;
}

export const eventSchema = z.object({
    title: z.string().optional(),
    course: courseSchema.optional(),
    type: z.string(),
    date: z.coerce.date(),
    duration: z.coerce.number().optional()
})
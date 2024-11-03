import { Time } from './schemas/time'
import { Class, Course, CourseInfo } from './schemas/types'

export const GUILD_ID = '1288033262404505620';
export const WELCOME_CHANNEL_ID = '1288033262404505623';
export const ANNOUNCEMENTS_CHANNEL_ID = '1302604976538914856';

export const DEFAULT_COLOR = 0x9b3324;

export const SCHEDULE: Class[][] = [
    
    // domingo
    [],
    
    // segunda-feira
    [
        { course: 'LSD', classroom: 'F.0.46', starts: new Time(8, 0), ends: new Time(11, 0) },
        { course: 'TMD', classroom: 'C.1.07', starts: new Time(11, 0), ends: new Time(12, 30) },
        { course: 'E', classroom: 'F.1.04', starts: new Time(12, 30), ends: new Time(14, 0) }
    ],
    
    // terça-feira
    [
        { course: 'TMD', classroom: 'C.1.07', starts: new Time(8, 0), ends: new Time(11, 0) },
        { course: 'CDI', classroom: 'C.1.07', starts: new Time(11, 0), ends: new Time(12, 30) },
        { course: 'LSD', classroom: 'F.1.04', starts: new Time(12, 30), ends: new Time(14, 0) }
    ],
    
    // quarta-feira
    [
        { course: 'PG', classroom: 'G.0.14', starts: new Time(8, 0), ends: new Time(11, 0) },
        { course: 'E', classroom: 'C.1.07', starts: new Time(11, 0), ends: new Time(14, 0) }
    ],
    
    // quinta-feira
    [
        { course: 'CDI', classroom: 'C.1.07', starts: new Time(8, 0), ends: new Time(11, 0) },
        { course: 'PG', classroom: 'C.1.07', starts: new Time(11, 0), ends: new Time(12, 30) }
    ],
    
    // sexta-feira
    [],
    
    // sábado
    []
    
]

export const COURSE_INFO: Record<Course, CourseInfo> = {
    CDI: {
        name: 'Cálculo Diferencial e Integral',
        url: 'https://www.isel.pt/leic/calculo-diferencial-e-integral',
        professor: {
            name: 'Jocelyn Lochon',
            url: 'https://www.isel.pt/docentes/jocelyn-lochon'
        }
    },
    TMD: {
        name: 'Tópicos de Matemática Discreta',
        url: 'https://www.isel.pt/leic/topicos-de-matematica-discreta',
        professor: {
            name: 'Laura D\'Azevedo',
            url: 'https://www.isel.pt/docentes/laura-cristina-teixeira-iglesias-charters-de-azevedo'
        }
    },
    LSD: {
        name: 'Lógica e Sistemas Digitais',
        url: 'https://www.isel.pt/leic/logica-e-sistemas-digitais',
        professor: {
            name: 'Rogério Rebelo',
            url: 'https://www.isel.pt/docente/rogerio-alexandre-botelho-campos-rebelo'
        }
    },
    PG: {
        name: 'Programação',
        url: 'https://www.isel.pt/leic/programacao',
        professor: {
            name: 'Cátia Vaz',
            url: 'https://www.isel.pt/docentes/catia-raquel-jesus-vaz'
        }
    },
    E: {
        name: 'Eletrónica',
        url: 'https://www.isel.pt/leic/eletronica',
        professor: {
            name: 'João Martins',
            url: 'https://www.isel.pt/docentes/joao-manuel-ferreira-martins'
        }
    }
}
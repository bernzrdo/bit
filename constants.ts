import { Time } from './schemas/time'
import { Class, Course, CourseInfo } from './schemas/types'

export const BOT_ID = '1296418789281235036';
export const GUILD_ID = '1288033262404505620';
export const TEST_GUILD_ID = '1147082837107933194';
export const WELCOME_CHANNEL_ID = '1288033262404505623';
export const ANNOUNCEMENTS_CHANNEL_ID = '1302604976538914856';

export const DEFAULT_COLOR = 0x9b3324;

export const SCHEDULE: Class[][] = [
    
    // domingo
    [],
    
    // segunda-feira
    [
        { course: 'AED', classroom: 'C.1.07', starts: new Time(9, 30), ends: new Time(12, 30) },
        { course: 'AC', classroom: 'E.3.15', starts: new Time(12, 30), ends: new Time(14, 0) }
    ],
    
    // terça-feira
    [
        { course: 'ALGA', classroom: 'C.1.07', starts: new Time(8, 0), ends: new Time(9, 30) },
        { course: 'RC', classroom: 'C.1.07', starts: new Time(9, 30), ends: new Time(11, 0) },
        { course: 'AC', classroom: 'E.3.15', starts: new Time(11, 0), ends: new Time(12, 30) }
    ],
    
    // quarta-feira
    [
        { course: 'ALGA', classroom: 'C.1.07', starts: new Time(8, 0), ends: new Time(11, 0) },
        { course: 'AC', classroom: 'F.0.46', starts: new Time(11, 0), ends: new Time(12, 30) }
    ],
    
    // quinta-feira
    [
        { course: 'RC', classroom: 'F.1.04', starts: new Time(8, 0), ends: new Time(11, 0) },
        { course: 'AED', classroom: 'C.1.08', starts: new Time(11, 0), ends: new Time(12, 30) }
    ],
    
    // sexta-feira
    [
        { course: 'LIC', classroom: 'F.-1.09', starts: new Time(8, 0), ends: new Time(12, 30) }
    ],
    
    // sábado
    []
    
]

export const COURSE_INFO: Record<Course, CourseInfo> = {
    ALGA: {
        name: 'Álgebra Linear e Geometria Analítica',
        url: 'https://www.isel.pt/leic/algebra-linear-e-geometria-analitica',
        professor: {
            name: 'Elisa Pereira',
            url: 'https://www.isel.pt/docentes/maria-elisa-viegas-marques-pereira'
        }
    },
    AED: {
        name: 'Algoritmos e Estruturas de Dados',
        url: 'https://www.isel.pt/leic/algoritmos-e-estruturas-de-dados',
        professor: {
            name: 'Paula Graça',
            url: 'https://isel.pt/docentes/maria-paula-de-brito-graca'
        }
    },
    AC: {
        name: 'Arquitetura de Computadores',
        url: 'https://www.isel.pt/leic/arquitetura-de-computadores',
        professor: {
            name: 'João Patriarca',
            url: 'https://www.isel.pt/docentes/joao-pedro-guerreiro-da-graca-patriarca'
        }
    },
    LIC: {
        name: 'Laboratório de Informática e Computadores',
        url: 'https://www.isel.pt/leic/laboratorio-de-informatica-e-computadores',
        professor: {
            name: 'Rogério Rebelo',
            url: 'https://www.isel.pt/docente/rogerio-alexandre-botelho-campos-rebelo'
        }
    },
    RC: {
        name: 'Redes de Computadores',
        url: 'https://www.isel.pt/leic/redes-de-computadores',
        professor: {
            name: 'Diego Passos',
            url: 'https://www.isel.pt/docente/diego-gimenez-passos'
        }
    }
    // CDI: {
    //     name: 'Cálculo Diferencial e Integral',
    //     url: 'https://www.isel.pt/leic/calculo-diferencial-e-integral',
    //     professor: {
    //         name: 'Jocelyn Lochon',
    //         url: 'https://www.isel.pt/docentes/jocelyn-lochon'
    //     }
    // },
    // TMD: {
    //     name: 'Tópicos de Matemática Discreta',
    //     url: 'https://www.isel.pt/leic/topicos-de-matematica-discreta',
    //     professor: {
    //         name: 'Laura D\'Azevedo',
    //         url: 'https://www.isel.pt/docentes/laura-cristina-teixeira-iglesias-charters-de-azevedo'
    //     }
    // },
    // LSD: {
    //     name: 'Lógica e Sistemas Digitais',
    //     url: 'https://www.isel.pt/leic/logica-e-sistemas-digitais',
    //     professor: {
    //         name: 'Rogério Rebelo',
    //         url: 'https://www.isel.pt/docente/rogerio-alexandre-botelho-campos-rebelo'
    //     }
    // },
    // PG: {
    //     name: 'Programação',
    //     url: 'https://www.isel.pt/leic/programacao',
    //     professor: {
    //         name: 'Cátia Vaz',
    //         url: 'https://www.isel.pt/docentes/catia-raquel-jesus-vaz'
    //     }
    // },
    // E: {
    //     name: 'Eletrónica',
    //     url: 'https://www.isel.pt/leic/eletronica',
    //     professor: {
    //         name: 'João Martins',
    //         url: 'https://www.isel.pt/docentes/joao-manuel-ferreira-martins'
    //     }
    // }
}

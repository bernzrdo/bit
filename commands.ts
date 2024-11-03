import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import 'dotenv/config';

const body = [

    // new SlashCommandBuilder()
    //     .setName('calendário')
    //     .setDescription('Vê os eventos do calendário'),
    
    // new SlashCommandBuilder()
    //     .setName('atualizar')
    //     .setDescription('Atualizar informações'),
    
    new SlashCommandBuilder()
        .setName('aula')
        .setDescription('Sabe mais sobre a aula que está a decorrer'),

    new SlashCommandBuilder()
        .setName('próxima-aula')
        .setDescription('Sabe mais sobre a próxima aula')

]

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

const data = (await rest.put(
    Routes.applicationGuildCommands(
        process.env.DISCORD_BOT_ID!,
        process.env.DISCORD_GUILD_ID!
    ),
    { body }
)) as any[];

console.log(`${data.length} comandos atualizados.`);
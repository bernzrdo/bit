import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import 'dotenv/config';
import { BOT_ID, GUILD_ID, TEST_GUILD_ID } from './constants';

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

await rest.put(Routes.applicationGuildCommands(BOT_ID, GUILD_ID), { body: [
    
    new SlashCommandBuilder()
        .setName('aula')
        .setDescription('Sabe mais sobre a aula que está a decorrer.'),

    new SlashCommandBuilder()
        .setName('próxima-aula')
        .setDescription('Sabe mais sobre a próxima aula.'),

    new SlashCommandBuilder()
        .setName('anunciar-voz')
        .setDescription('Anuncia que estás num canal de voz.'),

    new SlashCommandBuilder()
        .setName('calendário')
        .setDescription('Vê os eventos do calendário'),

]});

await rest.put(Routes.applicationGuildCommands(BOT_ID, TEST_GUILD_ID), { body: [

    new SlashCommandBuilder()
        .setName('refresh')
        .setDescription('Atualizar Storages.'),

    new SlashCommandBuilder()
        .setName('del')
        .setDescription('Apagar mensagem específica.')
        .addStringOption(o=>o
            .setName('channel-id')
            .setDescription('ID do canal')
            .setRequired(true)
        )
        .addStringOption(o=>o
            .setName('message-id')
            .setDescription('ID da mensagem')
            .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('criar-evento')
        .setDescription('Criar novo evento'),

    new SlashCommandBuilder()
        .setName('calendário')
        .setDescription('Vê os eventos do calendário'),

]});

console.log('Comandos atualizados!');
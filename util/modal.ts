import { APIModalActionRowComponent, APIModalInteractionResponseCallbackData, ComponentType, TextInputStyle } from 'discord.js';

interface Modal {
    custom_id: string;
    title: string;
    components: Array1To5Items<ModalComponent>;
}

type Array1Item<T> = [T];
type Array2Items<T> = [T, T];
type Array3Items<T> = [T, T, T];
type Array4Items<T> = [T, T, T, T];
type Array5Items<T> = [T, T, T, T, T];
type Array1To5Items<T> = Array1Item<T> | Array2Items<T> | Array3Items<T> | Array4Items<T> | Array5Items<T>;

type ModalComponent = Omit<APIModalActionRowComponent, 'type' | 'style'> & {
    style?: TextInputStyle;
}

export function generateModal(modal: Modal): APIModalInteractionResponseCallbackData {
    return {
        custom_id: modal.custom_id,
        title: modal.title,
        components: modal.components.map(c=>({
            type: ComponentType.ActionRow,
            components: [{
                type: ComponentType.TextInput,
                style: c.style ?? TextInputStyle.Short,
                ...c
            }]
        }))
    }
}
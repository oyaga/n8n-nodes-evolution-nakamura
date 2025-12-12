import {
    IExecuteFunctions,
    IRequestOptions,
    IHttpRequestMethods,
    NodeOperationError,
} from 'n8n-workflow';
import { evolutionRequest } from '../evolutionRequest';

export async function sendCarousel(ef: IExecuteFunctions) {
    try {
        // Parâmetros obrigatórios
        const instanceName = ef.getNodeParameter('instanceName', 0) as string;
        const remoteJid = ef.getNodeParameter('remoteJid', 0) as string;
        const cards = ef.getNodeParameter('cards.cardValues', 0, []) as Array<{
            header?: string;
            title: string;
            description?: string;
            footer?: string;
            thumbnailUrl?: string;
            buttons?: Array<{
                type: 'reply' | 'copy' | 'url' | 'call';
                displayText: string;
                id?: string;
                copyCode?: string;
                url?: string;
                phoneNumber?: string;
            }>;
        }>;

        // Validação dos cards
        if (!Array.isArray(cards) || cards.length === 0 || cards.length > 10) {
            const errorData = {
                success: false,
                error: {
                    message: 'Lista de cards inválida',
                    details: 'É necessário fornecer entre 1 e 10 cards',
                    code: 'INVALID_CARDS',
                    timestamp: new Date().toISOString(),
                },
            };
            return {
                json: errorData,
                error: errorData,
            };
        }

        // Opções adicionais
        const options = ef.getNodeParameter('options_message', 0, {}) as {
            delay?: number;
            quoted?: {
                messageQuoted: {
                    messageId: string;
                };
            };
            mentions?: {
                mentionsSettings: {
                    mentionsEveryOne: boolean;
                    mentioned: string;
                };
            };
        };

        const body: any = {
            number: remoteJid,
            cards: cards.map(card => ({
                header: card.header,
                title: card.title,
                description: card.description,
                footer: card.footer,
                thumbnailUrl: card.thumbnailUrl,
                buttons: card.buttons?.map(button => {
                    const baseButton = {
                        type: button.type,
                        displayText: button.displayText,
                    };

                    switch (button.type) {
                        case 'reply':
                            return { ...baseButton, id: button.id };
                        case 'copy':
                            return { ...baseButton, copyCode: button.copyCode };
                        case 'url':
                            return { ...baseButton, url: button.url };
                        case 'call':
                            return { ...baseButton, phoneNumber: button.phoneNumber };
                        default:
                            return baseButton;
                    }
                }),
            })),
        };

        if (options.delay) body.delay = options.delay;

        if (options.quoted?.messageQuoted?.messageId) {
            body.quoted = {
                key: {
                    id: options.quoted.messageQuoted.messageId,
                },
            };
        }

        if (options.mentions?.mentionsSettings) {
            const { mentionsEveryOne, mentioned } = options.mentions.mentionsSettings;

            if (mentionsEveryOne) {
                body.mentionsEveryOne = true;
            } else if (mentioned) {
                const mentionedNumbers = mentioned
                    .split(',')
                    .map(num => num.trim())
                    .map(num => (num.includes('@s.whatsapp.net') ? num : `${num}@s.whatsapp.net`));

                body.mentioned = mentionedNumbers;
            }
        }

        const requestOptions: IRequestOptions = {
            method: 'POST' as IHttpRequestMethods,
            headers: {
                'Content-Type': 'application/json',
            },
            uri: `/message/sendCarousel/${instanceName}`,
            body,
            json: true,
        };

        const response = await evolutionRequest(ef, requestOptions);
        return {
            json: {
                success: true,
                data: response,
            },
        };
    } catch (error) {
        const errorData = {
            success: false,
            error: {
                message: error.message.includes('Could not get parameter')
                    ? 'Parâmetros inválidos ou ausentes'
                    : 'Erro ao enviar carousel',
                details: error.message.includes('Could not get parameter')
                    ? 'Verifique se todos os campos obrigatórios foram preenchidos corretamente'
                    : error.message,
                code: error.code || 'UNKNOWN_ERROR',
                timestamp: new Date().toISOString(),
            },
        };

        if (!ef.continueOnFail()) {
            throw new NodeOperationError(ef.getNode(), error.message, {
                message: errorData.error.message,
                description: errorData.error.details,
            });
        }

        return {
            json: errorData,
            error: errorData,
        };
    }
}

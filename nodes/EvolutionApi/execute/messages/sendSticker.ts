import {
    IExecuteFunctions,
    IRequestOptions,
    IHttpRequestMethods,
    NodeOperationError,
} from 'n8n-workflow';
import { evolutionRequest } from '../evolutionRequest';

export async function sendSticker(ef: IExecuteFunctions) {
    try {
        // Parâmetros obrigatórios
        const instanceName = ef.getNodeParameter('instanceName', 0) as string;
        const remoteJid = ef.getNodeParameter('remoteJid', 0) as string;
        const sticker = ef.getNodeParameter('stickerUrl', 0) as string;

        // Validação do sticker
        if (!sticker) {
            const errorData = {
                success: false,
                error: {
                    message: 'URL do sticker é obrigatória',
                    details: 'Forneça uma URL válida ou base64 do sticker',
                    code: 'MISSING_STICKER',
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
        };

        const body: any = {
            number: remoteJid,
            sticker,
        };

        if (options.delay) body.delay = options.delay;

        if (options.quoted?.messageQuoted?.messageId) {
            body.quoted = {
                key: {
                    id: options.quoted.messageQuoted.messageId,
                },
            };
        }

        const requestOptions: IRequestOptions = {
            method: 'POST' as IHttpRequestMethods,
            headers: {
                'Content-Type': 'application/json',
            },
            uri: `/message/sendSticker/${instanceName}`,
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
                    : 'Erro ao enviar sticker',
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

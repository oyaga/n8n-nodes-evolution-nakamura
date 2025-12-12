import {
    IExecuteFunctions,
    IRequestOptions,
    IHttpRequestMethods,
    NodeOperationError,
} from 'n8n-workflow';
import { evolutionRequest } from '../evolutionRequest';

export async function sendLocation(ef: IExecuteFunctions) {
    try {
        // Parâmetros obrigatórios
        const instanceName = ef.getNodeParameter('instanceName', 0) as string;
        const remoteJid = ef.getNodeParameter('remoteJid', 0) as string;
        const name = ef.getNodeParameter('locationName', 0) as string;
        const address = ef.getNodeParameter('locationAddress', 0) as string;
        const latitude = ef.getNodeParameter('latitude', 0) as number;
        const longitude = ef.getNodeParameter('longitude', 0) as number;

        // Validação de coordenadas
        if (latitude < -90 || latitude > 90) {
            const errorData = {
                success: false,
                error: {
                    message: 'Latitude inválida',
                    details: 'A latitude deve estar entre -90 e 90',
                    code: 'INVALID_LATITUDE',
                    timestamp: new Date().toISOString(),
                },
            };
            return {
                json: errorData,
                error: errorData,
            };
        }

        if (longitude < -180 || longitude > 180) {
            const errorData = {
                success: false,
                error: {
                    message: 'Longitude inválida',
                    details: 'A longitude deve estar entre -180 e 180',
                    code: 'INVALID_LONGITUDE',
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
            name,
            address,
            latitude,
            longitude,
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
            uri: `/message/sendLocation/${instanceName}`,
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
                    : 'Erro ao enviar localização',
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

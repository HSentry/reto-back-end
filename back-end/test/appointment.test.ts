import { execute } from 'lambda-local';
import { expect, describe, test } from '@jest/globals'; 

// Constants
const LAMBDA_PATH = 'src/functions/appointment.ts';
const ENV_FILE = 'test/local-test.env';
const TIMEOUT_MS = 30000;

describe('Integration Tests for appointment Lambda Function', () => {
  const lambdaOptions = {
    lambdaPath: LAMBDA_PATH,
    envfile: ENV_FILE,
    timeoutMs: TIMEOUT_MS,
  };


  test('should update appointment status to completed for SQS event', async () => {
    const event = {
        Records: [
            {
                body: JSON.stringify({ apptId: '12345' })
            }
        ]
    };

    const response = await execute({ event, ...lambdaOptions });
    expect(response).toEqual({
        statusCode: 200,
        body: JSON.stringify({ message: 'SQS messages processed successfully' })
    });
    });

  test('should retrieve list of appointment for GET /appt/id', async () => {

    const event = {
        httpMethod: 'GET',
        path: '/appt/',
        pathParameters: {
            id: 'insure123'
        }
    };
    const mockAppointments = [
        { apptId: 'appt1', insureId: 'insure123' },
        { apptId: 'appt2', insureId: 'insure123' }
    ];

    const response = await execute({ event, ...lambdaOptions });
    expect(response).toEqual({
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ listOfAppointments: mockAppointments })
    });
    });

  test('should create a new appointment for POST /appt', async () => {
    const event = {
        httpMethod: 'POST',
        path: '/appt',
        body: JSON.stringify({
            insureId: 'insure123',
            scheduleId: 1,
            countryISO: 'PE'
        })
    };

    const response = await execute({ event, ...lambdaOptions });
    expect(response).toEqual({
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: 'Appt created' })
    });
    });

    test('should return 400 for invalid requests', async () => {
        const event = {
            httpMethod: 'PUT',
            path: '/invalid-path'
        };

        const response = await execute({ event, ...lambdaOptions });
        expect(response).toEqual({
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid request' })
        });
    });

});

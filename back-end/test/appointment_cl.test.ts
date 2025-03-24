import { execute } from 'lambda-local';
import { expect, describe, test } from '@jest/globals'; 

// Constants
const LAMBDA_PATH = 'src/functions/appointment_cl.ts';
const ENV_FILE = 'test/local-test.env';
const TIMEOUT_MS = 30000;

describe('Integration Tests for appointment_cl Lambda Function', () => {
  const lambdaOptions = {
    lambdaPath: LAMBDA_PATH,
    envfile: ENV_FILE,
    timeoutMs: TIMEOUT_MS,
  };

  test('should process SQS events and insert appointments', async () => {
    const event = {
        Records: [
            {
                body: JSON.stringify({
                    Message: JSON.stringify({
                        insuredId: '123',
                        scheduleId: 456,
                        countryISO: 'CL',
                        apptId: 'uuid-1234'
                    })
                })
            }
        ]
    };

    const response = await execute({ event, ...lambdaOptions });

    expect(response).toEqual({
        statusCode: 200,
        body: JSON.stringify({ message: 'CL messages processed successfully' })
    });
});

});

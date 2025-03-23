import { SQSEvent, Context } from 'aws-lambda';
import { publishToEventBridge } from '@src/functions/helpers/eventBridgeHelper'

export const handler = async (event: SQSEvent, context: Context) => {
  try {
    for (const record of event.Records) {
      const snsMessage = JSON.parse(record.body);
      const payload = JSON.parse(snsMessage.Message);
      
      await publishToEventBridge(
        'appointment.events',
        'AppointmentProcessed',
        {
          type: 'PE',
          data: payload,
          timestamp: new Date().toISOString()
        }
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'PE messages processed successfully' })
    };
  } catch (error) {
    console.error('Error in PE handler:', error);
    throw error;
  }
};

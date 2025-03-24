import { SQSEvent, Context } from 'aws-lambda';
import { publishToEventBridge } from '@src/functions/helpers/eventBridgeHelper'
import { DatabaseService, Appointment } from 'src/functions/helpers/rdsHelper';

export const handler = async (event: SQSEvent, context: Context) => {
    try {
        for (const record of event.Records) {
            const snsMessage = JSON.parse(record.body);
            const payload = JSON.parse(snsMessage.Message);

            const dbService = new DatabaseService();

            const newAppointment: Appointment = {
                insuredId: payload.insuredId,
                scheduleId: payload.scheduleId,
                countryISO: payload.countryISO
            };

            await dbService.insertAppointmentPE(newAppointment);

            const eventBridgePayload = {
                apptId : payload.apptId
            }

            await publishToEventBridge(
                'appointment.events',
                'AppointmentProcessed',
                {
                    type: 'PE',
                    data: eventBridgePayload,
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
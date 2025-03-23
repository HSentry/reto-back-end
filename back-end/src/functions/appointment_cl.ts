

export const handler = async (event: any): Promise<any> => {
    for (const record of event.Records) {
        try {
            // The SNS message is wrapped in the SQS message body
            const snsMessage = JSON.parse(record.body);
            const payload = JSON.parse(snsMessage.Message);

            console.log('Processing CL appointment:', payload);
            // Your CL appointment processing logic here

        } catch (error) {
            console.error('Error processing CL message:', error);
            throw error;
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'CL messages processed successfully' })
    };
};

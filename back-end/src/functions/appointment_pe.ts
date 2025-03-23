

export const handler = async (event: any): Promise<any> => {
    for (const record of event.Records) {
        try {
            // The SNS message is wrapped in the SQS message body
            const snsMessage = JSON.parse(record.body);
            const payload = JSON.parse(snsMessage.Message);

            console.log('Processing PE appointment:', payload);
            // Your PE appointment processing logic here

        } catch (error) {
            console.error('Error processing PE message:', error);
            throw error;
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'PE messages processed successfully' })
    };
};
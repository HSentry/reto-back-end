// const AWS = require('aws-sdk');
// const sns = new AWS.SNS();

// const publishToPE = async (message) => {
//   const params = {
//     Message: JSON.stringify(message),
//     TopicArn: 'PE_TOPIC_ARN'  // Replace with actual PE topic ARN
//   };

//   try {
//     await sns.publish(params).promise();
//     console.log('Message published to PE topic');
//   } catch (error) {
//     console.error('Error publishing to PE topic:', error);
//     throw error;
//   }
// };

// const publishToCL = async (message) => {
//   const params = {
//     Message: JSON.stringify(message),
//     TopicArn: 'CL_TOPIC_ARN'  // Replace with actual CL topic ARN
//   };

//   try {
//     await sns.publish(params).promise();
//     console.log('Message published to CL topic');
//   } catch (error) {
//     console.error('Error publishing to CL topic:', error);
//     throw error;
//   }
// };

import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({});

const publishToPE = async (message: any): Promise<void> => {
  const params = {
    Message: JSON.stringify(message),
    TopicArn: 'PE_TOPIC_ARN'  // Reemplazar con el ARN real del tópico PE
  };

  try {
    const command = new PublishCommand(params);
    await snsClient.send(command);
    console.log('Mensaje publicado al tópico PE');
  } catch (error) {
    console.error('Error al publicar en el tópico PE:', error);
    throw error;
  }
};

const publishToCL = async (message: any): Promise<void> => {
  const params = {
    Message: JSON.stringify(message),
    TopicArn: 'CL_TOPIC_ARN'  // Reemplazar con el ARN real del tópico CL
  };

  try {
    const command = new PublishCommand(params);
    await snsClient.send(command);
    console.log('Mensaje publicado al tópico CL');
  } catch (error) {
    console.error('Error al publicar en el tópico CL:', error);
    throw error;
  }
};


export const handler = async (event: any): Promise<any> => {
  // Check if the event is from SQS
  if (event.Records) {
      // Process SQS messages
      for (const record of event.Records) {
          try {
              const body = JSON.parse(record.body);
              console.log('Processing SQS message:', body);

              // Your SQS message processing logic here
              await processMessage(body);

          } catch (error) {
              console.error('Error processing message:', error);
              throw error; // This will return the message to the queue
          }
      }

      return {
          statusCode: 200,
          body: JSON.stringify({ message: 'SQS messages processed successfully' })
      };
  }

  // Handle HTTP events
  if (event.httpMethod) {
      if (event.httpMethod === 'POST' && event.path === '/users') {
          // Handle POST /users
          const body = JSON.parse(event.body);
          // Your POST logic here

          return {
              statusCode: 200,
              headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': true,
              },
              body: JSON.stringify({ message: 'User created' })
          };
      }

      if (event.httpMethod === 'GET' && event.path.startsWith('/users/')) {
          // Handle GET /users/{id}
          const userId = event.pathParameters.id;
          // Your GET logic here

          return {
              statusCode: 200,
              headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': true,
              },
              body: JSON.stringify({ userId })
          };
      }
  }

  return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid request' })
  };
};

async function processMessage(messageBody: any): Promise<void> {
  // Implement your message processing logic
  // This function will be called for each SQS message
}

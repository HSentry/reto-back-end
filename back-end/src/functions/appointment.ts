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

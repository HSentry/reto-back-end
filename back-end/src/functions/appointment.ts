const AWS = require('aws-sdk');
const sns = new AWS.SNS();

const publishToPE = async (message) => {
  const params = {
    Message: JSON.stringify(message),
    TopicArn: 'PE_TOPIC_ARN'  // Replace with actual PE topic ARN
  };

  try {
    await sns.publish(params).promise();
    console.log('Message published to PE topic');
  } catch (error) {
    console.error('Error publishing to PE topic:', error);
    throw error;
  }
};

const publishToCL = async (message) => {
  const params = {
    Message: JSON.stringify(message),
    TopicArn: 'CL_TOPIC_ARN'  // Replace with actual CL topic ARN
  };

  try {
    await sns.publish(params).promise();
    console.log('Message published to CL topic');
  } catch (error) {
    console.error('Error publishing to CL topic:', error);
    throw error;
  }
};
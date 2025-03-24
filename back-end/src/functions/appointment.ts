import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { v4 as uuidv4 } from 'uuid';
import { getAppointmentsByInsureId, ddbPut, ddbUpdate } from "@src/functions/helpers/dynamoDbHelper"

const snsClient = new SNSClient({});
const { CL_TOPIC_ARN, PE_TOPIC_ARN, APPT_TABLE } = process.env;

const publishToPE = async (message: any): Promise<void> => {
  const params = {
    Message: JSON.stringify(message),
    TopicArn: PE_TOPIC_ARN 
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
    TopicArn: CL_TOPIC_ARN
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

  if (event.Records) {
      for (const record of event.Records) {
          try {
              const body = JSON.parse(record.body);
              console.log('Processing SQS update:', body);

              const appIdFromSQS = body.apptId
              const updateBody = {
                apptId: appIdFromSQS,
                status: 'completed'
              }
              const updateResponse = ddbUpdate(APPT_TABLE, updateBody);
              console.log('Db response update:' , updateResponse);

          } catch (error) {
              console.error('Error processing message:', error);
              throw error; 
          }
      }

      return {
          statusCode: 200,
          body: JSON.stringify({ message: 'SQS messages processed successfully' })
      };
  }


  if (event.httpMethod) {
      if (event.httpMethod === 'POST' && event.path === '/appt') {

          let messageToPublish : any
          const body = JSON.parse(event.body);
          const apptIdUUID = uuidv4();

          const apptTableRecord = {
            apptId : apptIdUUID,
            insureId : body.insureId,
            scheduleId: body.scheduleId,
            countryISO: body.countryISO,
            status : 'pending'
          };

          const response = await ddbPut(APPT_TABLE, apptTableRecord);
          console.log('Db response insert:' , response);

          if (body.countryISO = 'PE'){
            messageToPublish = {
              apptId : apptIdUUID,
              insureId : body.insureId,
              scheduleId: body.scheduleId,
              countryISO: body.countryISO,
            }
            await publishToPE(messageToPublish)
          }

          if (body.countryISO = 'CL'){
            messageToPublish = {
              apptId : apptIdUUID,
              insureId : body.insureId,
              scheduleId: body.scheduleId,
              countryISO: body.countryISO,
            }
            await publishToCL(messageToPublish)
          }

          return {
              statusCode: 200,
              headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': true,
              },
              body: JSON.stringify({ message: 'Appt created' })
          };
      }

      if (event.httpMethod === 'GET' && event.path.startsWith('/appt/')) {

          const insureId = event.pathParameters.id;

          const listOfAppointments = await getAppointmentsByInsureId(insureId);
          console.log("List of appt retrieved by Insure Id")

          return {
              statusCode: 200,
              headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': true,
              },
              body: JSON.stringify({ listOfAppointments })
          };
      }
  }

  return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid request' })
  };
};

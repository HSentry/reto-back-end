import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, UpdateCommand, QueryCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const { REGION, APPT_TABLE } = process.env;

const keyMapping: { [key: string]: string } = {
    [APPT_TABLE!]: 'apptId'
};

//Funcion para insertar datos en tabla DynamoDB
const ddbPut = async (table_name: any , item: Record<string, any>): Promise<void> => {
    const ddbClient = new DynamoDBClient({ region: REGION });
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

    try {
        const params = {
            TableName: table_name,
            Item: item,
        };

        const data = await ddbDocClient.send(new PutCommand(params));
        console.log("Success - ddbPut: ", data);
    } catch (err) {
        throw new Error('Error in ddbPut(): ' + err);
    } finally {
        ddbClient.destroy();
        ddbDocClient.destroy();
    }
};

//Funcion para actualizar datos en tabla DynamoDB
const ddbUpdate = async (table_name: any, item: Record<string, any>): Promise<any> => {
    const ddbClient = new DynamoDBClient({ region: REGION });
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

    try {
        const clonedItem = { ...item };

        const params: any = {
            TableName: table_name,
            Key: {
                [keyMapping[table_name]]: clonedItem[keyMapping[table_name]]
            },
            UpdateExpression: "SET ",
            ExpressionAttributeValues: {},
            ExpressionAttributeNames: {},
        };

        delete clonedItem[keyMapping[table_name]];

        const updateExpressionArray: string[] = [];

        for (let key in clonedItem) {
            const k = `${key}`;
            updateExpressionArray.push(`#${k} = :${k}`);
        }

        params.UpdateExpression += updateExpressionArray.join(', ');

        for (let key in clonedItem) {
            const k = `${key}`;
            params.ExpressionAttributeNames[`#${k}`] = k;
            params.ExpressionAttributeValues[`:${k}`] = clonedItem[key];
        }

        const data = await ddbDocClient.send(new UpdateCommand(params));
        return data;
    } catch (err) {
        throw new Error('Error in ddbUpdate(): ' + err);
    } finally {
        ddbClient.destroy();
        ddbDocClient.destroy();
    }
};

//Funcion para recuperar datos con respecto a la variable insureId. Se usa la GSI InsureIndex
const getAppointmentsByInsureId = async (insureId: string): Promise<Record<string, any>[]> => {
    const ddbClient = new DynamoDBClient({ region: REGION });

    try {
        const statement = {
            TableName: APPT_TABLE!,
            KeyConditionExpression: 'insureId = :hkey',
            ExpressionAttributeValues: {
                ':hkey': insureId
            },
            IndexName: 'InsureIndex'
        };

        const getCommand = new QueryCommand(statement);
        const ddbRes = await ddbClient.send(getCommand);

        return ddbRes.Items ? ddbRes.Items : [];
    } catch (error) {
        console.error(`Error while getting appointments by Insure Id: `, error);
        throw error;
    } finally {
        ddbClient.destroy();
    }
};

export {
    getAppointmentsByInsureId,
    ddbPut,
    ddbUpdate
};

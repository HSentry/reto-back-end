import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

const eventBridge = new EventBridgeClient();

export async function publishToEventBridge(
  source: string,
  detailType: string,
  detail: any
): Promise<void> {
  const params = {
    Entries: [
      {
        Source: source,
        DetailType: detailType,
        Detail: JSON.stringify(detail),
        EventBusName: process.env.EVENT_BUS_NAME,
        Time: new Date()
      }
    ]
  };

  try {
    const command = new PutEventsCommand(params);
    const result = await eventBridge.send(command);
    
    if (result.FailedEntryCount && result.FailedEntryCount > 0) {
      throw new Error(`Failed to publish events: ${JSON.stringify(result.Entries)}`);
    }
    
    console.log('Event published successfully:', result);
  } catch (error) {
    console.error('Error publishing event:', error);
    throw error;
  }
}
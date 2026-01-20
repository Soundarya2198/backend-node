import { PutCommand } from "@aws-sdk/lib-dynamodb";
import response from "../../utils/response.js";
import ddb from "../../services/dynamo.js";
import { v4 as uuidv4 } from "uuid";

export const createItem = async (event) => {
  try {
    const { name, description } = JSON.parse(event.body);

    if (!name || !description) {
      return response(400, { message: "Name and description are required." });
    }

    const userId = event.requestContext.authorizer.principalId;

    const item = {
      itemId: uuidv4(),
      userId,
      name,
      description,
      createdAt: new Date().toISOString(),
    };

    await ddb.send(
      new PutCommand({
        TableName: process.env.ITEMS_TABLE,
        Item: item,
      })
    );

    return response(201, { message: "Item created successfully.", item });
  } catch (e) {
    console.error("Error creating item: ", e);
    return response(500, {
      message: "Internal server error",
      msg: e.message,
    });
  }
};

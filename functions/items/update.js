

import ddb from "../../services/dynamo.js";
import response from "../../utils/response.js";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export const updateItem = async (event) => {
  try {
    const itemId = event.pathParameters.itemId;
    const body = JSON.parse(event.body);
    if (!itemId) {
      return response(404, "Item id is required");
    }
    if (body.name == "" || body.description == "") {
      return response(404, "name and description fields mandatory");
    }
    const result = await ddb.send(
      new GetCommand({
        TableName: process.env.ITEMS_TABLE,
        Key: {
          itemId: itemId,
        },
      })
    );

    if (!result.Item) {
      return response(400, "Given Id not found");
    } else {
      const update = await ddb.send(
        new UpdateCommand({
          TableName: process.env.ITEMS_TABLE,
          Key: {
            itemId: itemId,
          },
          UpdateExpression: "set #name=:n, description=:d",
          ExpressionAttributeNames: {
            "#name": "name",
          },
          ExpressionAttributeValues: {
            ":n": body.name,
            ":d": body.description,
          },
          ReturnValues: "ALL_NEW",
        })
      );
      if (update) {
        return response(200, "Updated Sucessfully");
      }
    }
  } catch (e) {
    return response(500, e.message);
  }
};

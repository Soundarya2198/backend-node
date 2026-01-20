import ddb from "../../services/dynamo.js";
import response from "../../utils/response.js";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export const getItem = async (event) => {
  try {
    const itemId = event.pathParameters.itemId;
    const userId = event.requestContext.authorizer.principalId;     
    const result = await ddb.send(
      new GetCommand({
        TableName: process.env.ITEMS_TABLE, 
        Key: { itemId: itemId},
      })
    );  
    if (!result.Item) {
      return response(404, { message: "Item not found." });
    }
    return response(200, { item: result.Item });
    } catch (e) {
    console.error("Error fetching item: ", e);
    return response(500, {
      message: "Internal server error",
      msg: e.message,
    });
  } 
};
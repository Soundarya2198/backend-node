import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import ddb from "../../services/dynamo.js";
import response from "../../utils/response.js";


export const listItems = async (event) => {
  try {
    const result = await ddb.send(  new ScanCommand({
      TableName: process.env.ITEMS_TABLE,
    })  );  

    return response(200, { items: result.Items });
    } catch (e) {
    console.error("Error fetching items: ", e);
    return response(500, {
      message: "Internal server error",
      msg: e.message,
    });
  }
};          
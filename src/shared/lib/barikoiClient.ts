import { createBarikoiClient } from "barikoiapis";

const barikoiClient = createBarikoiClient({
  apiKey: process.env.BARIKOI_API_KEY as string
});

export default barikoiClient;
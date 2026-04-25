import { createBarikoiClient } from "barikoiapis";
import { appConfig } from "../configs/app.config";

const barikoiClient = createBarikoiClient({
  apiKey: appConfig.BARIKOI_API_KEY
});

export default barikoiClient;
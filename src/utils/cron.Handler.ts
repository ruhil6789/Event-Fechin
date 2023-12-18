import * as cron from "node-cron"
import stakeEvents from "../components/web3Service/contractEvent";

// StageSet 
class CronHandler {
    public cronScheduler() {
        cron.schedule("*/10 * * * * *", async () => {
            console.log(" fetching the events");
            // stakeEvents.getStakeEvents("SlqqBought",
            //     "0x0E43dEfd5D3AAa49B6C595CA76dA97F6e45cdBfd",
            //     "Polygon"
            // )

            stakeEvents.getEvents("SlqqBought",
                "0x0E43dEfd5D3AAa49B6C595CA76dA97F6e45cdBfd",
                "Polygon"
            )
        })

    }
}

export default new CronHandler();

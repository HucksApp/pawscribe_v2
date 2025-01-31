import { createSocketApp } from "./V2/app.js";
import Config from "./V2/App/config/config.js";
import { printRoutes } from "./V2/App/debug/debug.js";


const { app, server } = createSocketApp()

const PORT = Config.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Pawscribe v2 is running on port ${PORT}`);
    printRoutes(app)
})



const path = require('path');
const port = process.env.port || process.env.PORT || 7000;
const dotenv = require('dotenv');
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });
const express = require("express")
const Ticket = require("./router/ticketroute")
const Auth = require("./router/Auth")
const {RootDialog}= require('./Dialog/rootdialog')
require("./dbs/dbs")
const { BotFrameworkAdapter, ConversationState, MemoryStorage } = require('botbuilder');
const { Handler } = require('./handler');
const server = express()
server.listen(port, () => {
    console.log(`\nbot is running at ${port}`);
});

//bot adapter
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

adapter.onTurnError = async (context, error) => {
    if (error) {
        console.log(`Error Occured : ${error}`);
    }

    await context.sendActivity("An Error has occured in the Bot Framework");
    await context.sendActivity("PLease Fix the source code to continue");
};

const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const rootDialog = new RootDialog(conversationState)
const handler = new Handler(conversationState , rootDialog);
server.post('/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await handler.run(context);
    });
});
server.use(express.json())
server.use("/ticket", Ticket)
server.use("/auth", Auth)

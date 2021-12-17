
const { ActivityHandler, CardFactory, MessageFactory } = require('botbuilder');
const welcomecard = require('./Resources/adaptivcard/welcomecard.json')
const CARDS = [
    welcomecard
];


class Handler extends ActivityHandler {
    constructor(conversationState, rootDialog) {
        super();

        if (!conversationState) throw new Error('conversationState is not defined.');
        this.conversationState = conversationState;
        this.rootDialog = rootDialog;
        this.accessor = this.conversationState.createProperty('DialogAccessor');
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            let welcomeText;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    if (membersAdded[cnt].id !== context.activity.recipient.id) {
                        await context.sendActivity({
                            attachments: [CardFactory.adaptiveCard(CARDS[0])],
                        });

                        await this.sendSuggestionAction(context)
                    }
                }
            }
            await next()

        })

        this.onMessage(async (context, next) => {
            await this.rootDialog.run(context, this.accessor);
            await next();
        })
    }

     async sendSuggestionAction(context) {
        await context.sendActivity("what would you like to do")
        const reply = MessageFactory.suggestedActions(["signup", "signin"]);
        await context.sendActivity(reply);
    }

    async run(context) {
        await super.run(context);
        await this.conversationState.saveChanges(context, false);
    }
}

module.exports.Handler = Handler;
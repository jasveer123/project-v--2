const { ComponentDialog, WaterfallDialog, DialogSet, DialogTurnStatus } = require("botbuilder-dialogs");
const { signup } = require("../Dialog/signup")
const {signin}= require("../Dialog/signin")
const { signUp, rootDialog , signIn} = require('../constant/dialogconstant')
const root = 'root';
class RootDialog extends ComponentDialog {
    constructor(conversationState) {
        super(rootDialog);

        if (!conversationState) throw new Error("Conversation State is not found");
        this.conversationState = conversationState;
        this.addDialog(new WaterfallDialog(root, [
            this.flow1.bind(this),
            //   this.flow2.bind(this)
        ]))

        this.addDialog(new signup(conversationState));
        this.addDialog(new signin(conversationState));
        this.initialDialogId = root
    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);
        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async flow1(step) {
        let userReply = step.context.activity.text;
        switch (userReply) {
            case 'signup':
                return await step.beginDialog(signUp);
                break;
            case 'signin':
                return await step.beginDialog(signIn);
                break;
            default:
                await step.context.sendActivity("error")
                break;
        }
        return await step.endDialog()


    }
}



module.exports.RootDialog = RootDialog
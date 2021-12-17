const { WaterfallDialog, ComponentDialog, Dialog } = require("botbuilder-dialogs")
const { CardFactory } = require('botbuilder');
const { getauth } = require("../api/authaxios")
const { signin } = require('./signin')
const { signUp, signIn } = require('../constant/dialogconstant')
const WATERFALL_DIALOG = 'WATERFALL_DIALOG'
const { cardToDisplay } = require("../Resources/adaptivcard/signup")
const {thx}=require("../Resources/adaptivcard/thx.json")

const CARD=[
    thx
]

class signup extends ComponentDialog {
    constructor(conversationState) {
        super(signUp);

        this.addDialog(new signin(conversationState));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.signUpWaterfallStep1.bind(this),
            this.signUpWaterfallStep2.bind(this)
        ]));
        this.initialDialogId = WATERFALL_DIALOG;


    }
    async signUpWaterfallStep1(step) {

        await step.context.sendActivity({ attachments: [CardFactory.adaptiveCard(cardToDisplay())] })
        return Dialog.EndOfTurn
    }
    async signUpWaterfallStep2(step) {
        let text = step.context.activity.value || step.context.activity.value.action || step.context.activity.text;

        console.log(text)


        let person = {
            "email": `${text.Email}`,
            "passward": `${text.passward}`,
            "Name": `${text.Name}`,
            "dob": `${text.DOB}`,
        }

        console.log(person)
        //await step.context.sendActivity({ type: ActionTypes.Typing });

        try {
            if (text.action == 'signup') {
                console.log("1")
                const verify = await getauth(person);
                console.log("2")
                console.log(verify)
                //step.options.verify = verify;

                if (verify.message === 'user created') {

                    await step.context.sendActivity("signUp Successful , Signin to go furthur");
                    return await step.beginDialog(signIn)

                }
                if (verify.errors.length > 1) {
                    await step.context.sendActivity("Please Provide the valid email ID");
                    await step.context.sendActivity("Passward you provide is not a secure passward try again ...")
                    return await step.replaceDialog(signUp);
                }
                if (verify.errors.length == 1) {
                    if (verify.errors[0].msg == 'invalid passward') {
                        await step.context.sendActivity("Passward you provide is not a secure passward try again ...")
                        return await step.replaceDialog(signUp);
                    }
                    else if (verify.errors[0].msg == 'invalid email') {
                        await step.context.sendActivity("please provide a valid email")
                        return await step.replaceDialog(signUp);
                    }

                }
            }
        } catch (error) {
            console.error(error);
        }
        



        return await step.endDialog();

    }
}

module.exports.signup = signup;
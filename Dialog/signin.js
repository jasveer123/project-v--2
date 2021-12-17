const { WaterfallDialog, ComponentDialog, ChoicePrompt, Dialog, ChoiceFactory  , ListStyle} = require("botbuilder-dialogs")
const {reservationDialog} = require('./reservationDialog')
const { CardFactory, MessageFactory } = require('botbuilder');
const {cancelTicket} = require("./cancelTicket")
const { login } = require("../api/authaxios")
const WATERFALL_DIALOG = 'WATERFALL_DIALOG'
const CHOICE_PROMPT = 'CHOICE_PROMPT'
const { logincard } = require("../Resources/adaptivcard/login");
const { signIn , reservationdialog , cancelticket} = require("../constant/dialogconstant");
const {warning} = require('../Resources/adaptivcard/warning.json')


const CARD = [
    warning
]
class signin extends ComponentDialog {
    constructor(conservsationState) {
        super(signIn);
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new reservationDialog(conservsationState))
        this.addDialog(new cancelTicket(conservsationState))
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.signinWaterfallStep1.bind(this),
            this.signinWaterfallStep2.bind(this),
            this.signinWaterfallStep3.bind(this)
        ]));
        this.initialDialogId = WATERFALL_DIALOG;
    }

    async signinWaterfallStep1(step) {

        await step.context.sendActivity({ attachments: [CardFactory.adaptiveCard(logincard())] })
        return Dialog.EndOfTurn

    }
    async signinWaterfallStep2(step) {

        let text = step.context.activity.value || step.context.activity.value.action || step.context.activity.text;

        console.log(text)
        let person = {
            "email": `${text.email}`,
            "passward": `${text.passward}`
        }
        console.log(person)
        try {
            if (text.action == 'Login') {
                const verify = await login(person);

                console.log(verify)
               // step.options.verify = verify;

               if (verify.errors){
                   await step.context.sendActivity("Invalid credentials")
                  return  await step.replaceDialog(signIn)
                 
               }

               if(verify.message = 'Auth successful')

                return await step.prompt(CHOICE_PROMPT, {
                    prompt: `Thanks For connecting with us. What do you want to do`,
                    choices: ChoiceFactory.toChoices(['Book Ticket', 'Cancel Ticket']),
                })
            }
        } catch (error) {
            console.error(error);

        }

    }
    async signinWaterfallStep3(step){

        step.values.choice = step.result
        console.log(step)
        if(step.result.value=='Book Ticket'){
            return await step.beginDialog(reservationdialog)
        }
        else if(step.result.value == 'Cancel Ticket'){
            return await step.beginDialog(cancelticket)
        }

        return await step.endDialog(); 

    }


}

module.exports.signin = signin
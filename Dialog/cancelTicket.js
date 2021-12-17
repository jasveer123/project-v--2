const { WaterfallDialog, ComponentDialog } = require("botbuilder-dialogs")
const { ConfirmPrompt, ChoicePrompt, ChoiceFactory , TextPrompt } = require('botbuilder-dialogs')
const { getid, deleteid } = require('../api/axios')
const { getreservationcard } = require('../Resources/adaptivcard/reservationcard')
const { CardFactory } = require('botbuilder');
const { cancelticket} = require('../constant/dialogconstant')
const warning=require("../Resources/adaptivcard/warning.json");
const thx = require('../Resources/adaptivcard/thx.json')

const CARDS =[
    warning,
    thx
]
const CONFIRM_PROMPT = 'CONFIRM_PROMPT'
const CHOICE_PROMPT = 'CHOICE_PROMPT'
const TEXT_PROMPT = 'TEXT_PROMPT'
const WATERFALL_DIALOG = 'WATERFALL_DIALOG'

class cancelTicket extends ComponentDialog {
    constructor(conversationState) {
        super(cancelticket);
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new TextPrompt(TEXT_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [

            this.enterId.bind(this),
            this.sure.bind(this),
            this.summary.bind(this),
          


        ]));

        this.initialDialogId = WATERFALL_DIALOG;


    }

    async enterId(step) {
        return await step.prompt(TEXT_PROMPT, 'enter the ticket id which you want to cancel')
    }

    async sure(step) {
        step.values.id = step.result;
        const data = await getid(step)
        console.log(data)
        if(data==null){
            await step.context.sendActivity({
                attachments: [CardFactory.adaptiveCard(CARDS[0])],
            });

            return await step.replaceDialog(cancelticket)
        }

        if (data.errors) {
            await step.context.sendActivity({
                attachments: [CardFactory.adaptiveCard(CARDS[0])],
            });

            return await step.replaceDialog(cancelticket)
        }
        else {

            console.log("id is valid")
        }
        await step.context.sendActivity({
            text: 'Here is following details associated with this id',
            attachments: [CardFactory.adaptiveCard(getreservationcard(data.name, data.date, data.time, data.location, data.destination, data.noOfParticipants, data._id))]
        });

        return await step.prompt(CONFIRM_PROMPT, 'Are you sure ?', ['yes', 'no'])
    }
    async summary(step) {

        if (step.result === true) {
            const Del = await deleteid(step)
            await step.context.sendActivity(" Ticket  successfully cancel. Your reservation cancel ")
            return step.context.sendActivity({
                attachments:[CardFactory.adaptiveCard(CARDS[1])]
            })
        }
        return step.endDialog()

    }

}

module.exports.cancelTicket = cancelTicket;
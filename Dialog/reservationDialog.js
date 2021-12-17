const { WaterfallDialog, ComponentDialog } = require("botbuilder-dialogs")
const { ConfirmPrompt, ChoicePrompt, DateTimePrompt, NumberPrompt, TextPrompt, Dialog , ChoiceFactory} = require('botbuilder-dialogs')
const { postid } = require('../api/axios')
const { getdetails } = require('../api/axios')
const { getreservationcard } = require('../Resources/adaptivcard/reservationcard')
const { summarycard } = require('../Resources/adaptivcard/summarycard')
const { CardFactory } = require('botbuilder');
const time = require("../Resources/adaptivcard/time.json")
const { mailto } = require('../email/nodemailer');
const { reservationdialog , cancelticket, signIn, signUp } = require('../constant/dialogconstant')
const {cancelTicket}=require('../Dialog/cancelTicket')
const date = require('../Resources/adaptivcard/date.json')
const CONFIRM_PROMPT = 'CONFIRM_PROMPT'
const CHOICE_PROMPT = 'CHOICE_PROMPT'
const DATETIME_PROMPT = 'DATETIME_PROMPT'
const NUMBER_PROMPT = 'NUMBER_PROMPT'
const TEXT_PROMPT = 'TEXT_PROMPT'
const WATERFALL_DIALOG = 'WATERFALL_DIALOG'

const CARDS = [
    date,
    time
]


class reservationDialog extends ComponentDialog {
    constructor(conservsationState) {
        super(reservationdialog);

        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new DateTimePrompt(DATETIME_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT));
        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new cancelTicket(conservsationState));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.firstStep.bind(this),
            this.getName.bind(this),
            this.getNumberOfParticipants.bind(this),
            this.GetLocation.bind(this),
            this.GetDestination.bind(this),
            this.getDate.bind(this),
            this.getTime.bind(this),
            this.getmail.bind(this),
            this.confirmStep.bind(this),
            this.summaryStep.bind(this),
            this.sendaction.bind(this)

        ]));

        this.initialDialogId = WATERFALL_DIALOG;


    }

    async firstStep(step) {
        return await step.prompt(CONFIRM_PROMPT, 'Would you like to book ticket?', ['yes', 'no']);

    }

    async getName(step) {
        if (step.result === true) {
            return await step.prompt(TEXT_PROMPT, 'on what name Ticket should be made?');
        }

    }

    async getNumberOfParticipants(step) {

        step.values.name = step.result
       // return await step.prompt(NUMBER_PROMPT, 'How many Passangers are there');
        return await step.prompt(CHOICE_PROMPT, {
            prompt: `How many Passangers are there`,
            choices: ChoiceFactory.toChoices(['1', '2' , '3' ,'4']),
        })
    }

    async GetLocation(step) {

        step.values.noOfParticipants = step.result.value
       // return await step.prompt(TEXT_PROMPT, 'Enter your near prtc bus stand');
        return await step.prompt(CHOICE_PROMPT, {
            prompt: `Enter your nearest punjab roadways bus station`,
            choices: ChoiceFactory.toChoices(["Amritsar",
                "Gurdaspur",
                "Pathankot",
                "Tarn Taran",
                "Jalandhar",
                "Kapurthala",
                "Hoshiarpur",
                "Nawan Shehar",
                "Ludhiana",
                "Roop Nagar",
                "Fatehgarh Sahib",
                "Patiala",
                "Sangrur",
                "Barnala",
                "SAS Nagar(Mohali)",
                "Bathinda",
                "Mansa",
                "Muktsar",
                "Ferozepur",
                "Fazilka",
                "Faridkot",
                "Moga",
                "Malerkotla"
        
            ])})


    }

    async GetDestination(step) {
        step.values.location = step.result.value;
        //return await step.prompt(TEXT_PROMPT, 'Enter Destination prtc bus stand');
        return await step.prompt(CHOICE_PROMPT, {
            prompt: `Enter your nearest punjab roadways bus station`,
            choices: ChoiceFactory.toChoices(["Amritsar",
                "Gurdaspur",
                "Pathankot",
                "Tarn Taran",
                "Jalandhar",
                "Kapurthala",
                "Hoshiarpur",
                "Nawan Shehar",
                "Ludhiana",
                "Roop Nagar",
                "Fatehgarh Sahib",
                "Patiala",
                "Sangrur",
                "Barnala",
                "SAS Nagar(Mohali)",
                "Bathinda",
                "Mansa",
                "Muktsar",
                "Ferozepur",
                "Fazilka",
                "Faridkot",
                "Moga",
                "Malerkotla"
        
            ])})
    }

    async getDate(step) {

        step.values.destination = step.result.value;
        await step.context.sendActivity({
            text: 'On which date you want to make reservation?',
            attachments: [CardFactory.adaptiveCard(CARDS[0])]
        });
        return Dialog.EndOfTurn
       // return await step.prompt(DATETIME_PROMPT, 'On which date you want to make the reservation?')
    }

    async getTime(step) {
        let text = step.context.activity.value || step.context.activity.value.action || step.context.activity.text;
        console.log(text)
       const val = Object.values(text)
       console.log(val)
        step.values.date = val[2];
       // return await step.prompt(DATETIME_PROMPT, 'At what time?')
        await step.context.sendActivity({
            text: 'On what time?',
            attachments: [CardFactory.adaptiveCard(CARDS[1])]
        });
        return Dialog.EndOfTurn
    }

    async getmail(step) {
        let text1 = step.context.activity.value || step.context.activity.value.action || step.context.activity.text;
        console.log(text1)
        const val1 = Object.values(text1)
        console.log(val1)
        step.values.time = val1[2];
        return await step.prompt(TEXT_PROMPT, 'Enter Your mail address')
    }

    async confirmStep(step) {

        step.values.mail = step.result

        console.log(step.values)

        await step.context.sendActivity({
            text: 'You entered following information',
            attachments: [CardFactory.adaptiveCard(summarycard(step.values.name.toUpperCase(), step.values.date, step.values.time, step.values.location.toUpperCase(), step.values.destination.toUpperCase(), step.values.noOfParticipants))]
        });
        return await step.prompt(CONFIRM_PROMPT, 'Are you sure that all values are correct and you want to make the reservation?', ['yes', 'no']);


    }

    async summaryStep(step) {

        console.log(step.values)

        const ticket_details = await postid(step)

        const detials = await getdetails(step)

        if (step.result === true) {
            await step.context.sendActivity({
                text: 'reservation done here is ticket',
                attachments: [CardFactory.adaptiveCard(getreservationcard(step.values.name.toUpperCase(), step.values.date, step.values.time, step.values.location.toUpperCase(), step.values.destination.toUpperCase(), step.values.noOfParticipants, detials[0]._id.toUpperCase()))]
            });

            const sendmail = mailto(step.values.name.toUpperCase(), step.values.date, step.values.time, step.values.location.toUpperCase(), step.values.destination.toUpperCase(), step.values.noOfParticipants, detials[0]._id.toUpperCase(), step.values.mail)

            await step.context.sendActivity(`Reservation successfully made. Your ticketid  is : ${detials[0]._id.toUpperCase()}`)
            
            return await step.prompt(CHOICE_PROMPT, {
                prompt: `Thanks For connecting with us. What do you want to do`,
                choices: ChoiceFactory.toChoices(['Book Ticket', 'Cancel Ticket'])
            })

        }

    }
    async sendaction(step){

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

module.exports.reservationDialog = reservationDialog

const express = require('express');
const ticket_schema = require("../models/ticket")

const router = express.Router()

router.get('/:id', async (req, res) => {

    console.log("hihihi")
    try {
        if (req.params.id) {
            const ticket = await ticket_schema.findById(req.params.id)
            return res.json(ticket)
        }
    }
    catch (err) {
        console.log(err)
        if (err) {
            return res.json({
                errors: [
                    {
                        msg: "Id is invalid please fill correct ticket Id",
                    }
                ]
            })
        }
    }


})


router.post("/", async (req, res) => {

    const ticket = new ticket_schema({

        name: req.body.name,
        noOfParticipants: req.body.noOfParticipants,
        location: req.body.location,
        destination: req.body.destination,
        date: req.body.date,
        time: req.body.time

    })

    try {

        const ticket1 = await ticket.save()
        res.json(ticket1)
    }
    catch (err) {
        console.log("Error" + err)
    }
})

router.get("/", async (req, res) => {

    try {
        console.log(req.query)
        const ticket = await ticket_schema.find(req.query)
        const data = res.json(ticket)
    }
    catch (err) {
        console.log(err)
    }

})


router.delete("/:id", async (req, res) => {


    //console.log(req)

        const deleteTicket = await ticket_schema.findByIdAndDelete(req.params.id);

        console.log(req.params.id)

        if (!req.params.id) {

            return res.json({
                errors: [{
                    msg: "invalid delete params"
                }]
            })
        }

        return res.json(deleteTicket)

})




module.exports = router
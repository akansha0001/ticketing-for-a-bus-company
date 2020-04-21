const express = require('express')
const Ticket = require('../models/Ticket')
const User = require('../models/User')
const validation = require('../middleware/validation/validation')
const bcrypt = require('bcrypt')
const userValidation = validation.userValidation
const openTicket = validation.openTicketa

const router = express()
//create a ticket
router.use(express.urlencoded({ extended: false }));
router.use(express.json());


const port = process.env.PORT || 3003
    router.listen(port, () => {
        console.log('Server is up on port ' + port)
    })

console.log('fghh')

router.put('/testing', function (req, res) {
    res.send(req.body)
    console.log(req.body)
  })


router.post('/ticket',(req, res)=>{

     let [result, data] = userValidation(req.body.passenger)
    if (!result) return res.status(404).json({ message: data })
   
    

     const ticket = new Ticket({ seat_number: req.body.seat_number })
     const user = new User(req.body.passenger)
     console.log(user)
     console.log(ticket)
    user.save()
        .then(data => {
            if (data) {
                ticket.passenger = user._id
                ticket.save()
                    .then(data => res.status(200).json(data))
                    .catch(err => {
                        User.findOneAndDelete({ _id: user._id })
                            .then((data) => res.status(400))
                            .catch(err => res.status(400).json({ message: err }))
                    })
                
            }
        })
        .catch(err => res.status(404).json({ message: err }))



    // console.log(req.body)
    // console.log(req.body.passenger)
    // console.log(userValidation(req.body.passenger))
   // res.send(req.body)
         

})



// router.put('/ticket/:ticket_id', (req, res) => {
//     console.log(req.params)
//     res.send('first put')
// })













//update a ticket, update open/closed and user_details
router.put('/ticket/:ticket_id', (req, res) => {
    //check indempotency for ticket booking status
    const { ticket_id } = req.params
   // console.log(req.params)
  //  res.send('hello')
     const payload = req.body

     let passenger = null
    //  console.log(payload)
      
    if ('passenger' in payload) {
        //console.log('hi')
        passenger = req.body.passenger
    }
    //res.send('hello')
    if (payload.is_booked == true) {
        console.log('ho')
        Ticket.findById(ticket_id, function (err, ticket) {
           
            if (err) res.status(404).json({ message: err })
            if (ticket) {
                
                const user_id = ticket.passenger
                console.log(user_id)
                User.remove({ _id: user_id }, function (err) {
                    if (err) {
                        res.status(404).json({ message: err })
                    }
                    else {
                        ticket.is_booked = payload.is_booked
                        const user = new User(req.body.passenger)
                        user.save()
                        .then(data => {
                            if (data) {
                                ticket.passenger = user._id
                                ticket.save()
                                    .then(data => res.status(200).json(data))
                                    .catch(err => {
                                        User.findOneAndDelete({ _id: user._id })
                                            .then((data) => res.status(400))
                                            .catch(err => res.status(400).json({ message: err }))
                                    })
                                
                            }
                        })
                        .catch(err => res.status(404).json({ message: err }))



                        // ticket.save()
                        //     .then(data => res.status(200).json(data))
                        //     .catch(err => res.status(404).json(err))
                    }
                })
            }
        })
    }
//res.send('hello')
    if (payload.is_booked == false && passenger != null) {
        Ticket.findById(ticket_id, function (err, ticket) {
            if (err) res.status(404).json({ message: err })
            if (ticket) {
                const user = new User(passenger)
                user.save()
                    .then(data => {
                        ticket.passenger = data._id
                        ticket.is_booked = payload.is_booked
                        ticket.save()
                            .then(data => res.status(200).json(data))
                            .catch(err => res.status(404).json(err))
                    })
                    .catch(err => res.status(404).json({ message: err }))
            }
        })
    }
 })

// // edit details of a user 
router.put('/user/:ticket_id', (req, res) => {
    const { ticket_id } = req.params
    const payload = req.body

    Ticket.findById(ticket_id, function (err, ticket) {
        if (err) res.status(404).json({ message: err })
        if (ticket) {
            const user_id = ticket.passenger
            User.findById(user_id)
                .then(user => {
                    if ('name' in payload) user.name = payload.name
                    if ('sex' in payload) user.sex = payload.sex
                    if ('email' in payload) user.email = payload.email
                    if ('phone' in payload) user.phone = payload.phone
                    if ('age' in payload) user.age = payload.age
                    user.save()
                        .then(data => res.status(202).json(data))
                        .catch(err => res.status(404).json({ message: err }))
                })
                .catch(err => res.status(404).json({ message: err }))
        }
    })
})

// get the status of a ticket based on ticket_id
router.get('/ticket/:ticket_id', (req, res) => {
    const { ticket_id } = req.params
    console.log(req.params)
    Ticket.findById(ticket_id, function (err, ticket) {
        if (err) res.status(404).json({ message: err })
        if (ticket) res.status(200).json({status: ticket.is_booked})
    })
    // const _id = req.params
    // console.log(_id)
    // Ticket.findById(_id).then((user) => {
    //     if (!user) {
    //         return res.status(404).send()
    //     }

    //     res.send(user)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

// get list of all open tickets
router.get('/tickets/open', (req, res) => {
    Ticket.find({ is_booked: false }, (err, data) => {
        if (err) res.status(404).json({ message: err })
        if (data) res.status(200).json(data)
    })
})

// get list of all closed tickets
router.get('/tickets/closed', (req, res) => {
    Ticket.find({ is_booked: true }, (err, data) => {
        if (err) res.status(404).json({ message: err })
        if (data) res.status(200).json(data)
    })
})

// View person details of a ticket
router.get('/ticket/details/:ticket_id', (req, res) => {
    const { ticket_id } = req.params
    Ticket.findById(ticket_id, function (err, ticket) {
        if (err) res.status(404).json({ message: err })
        if (ticket) {
            User.findById(ticket.passenger, function (err, user) {
                if (err) res.status(404).json({ message: err })
                if (user) res.status(200).json(user)
            })
        }
    })
})

router.post('/tickets/reset', (req, res) => {

    if (!("username" in req.body) && !("password" in req.body)) {
        res.status(400).json({ message: "username and password is needed in request body" })
    }

    const { username, password } = req.body

    if (!(bcrypt.compareSync(password, process.env.PASSWORD_HASH))) {

    }
    if (!(username === process.env.USER)) {
        res.status(400).json({ message: "username is incorrect" })
    }

    Ticket.find({}, (err, data) => {
        if (err) res.status(404).json({ message: err })
        if (data) {
            data.forEach(openTicket)
            res.status(200).json({ message: "success" })
        }
    })

})


module.exports = router


# bus-ticket-booking
A bus ticket booking api server build on express.js with MongoDB as the backend. 

Hosted on ec2: 
IPv4 Public IP :13.234.225.80

Run app.js to start

Can test using postman
Example API:
13.234.225.80:3003/tickets/allticket




**API docs:**

http method:POST
api:13.234.225.80:3003/ticket/
Create a ticket in tickets collection and corresponding user in user collection with seat_number
 *All of the attributes are required*

 {
    "seat_number": 1, -> possible values 1 to 40
    "passenger": { -> passenger details
        "name": "Akansha Gupta",
        "sex": "F",
        "age": 18,
        "phone": "9123083689",
        "email": "akansha@gmail.com"
    }
}
returns:
200: if success, returns object that was saved
404: if fails returns error in this format {message:"error in string"}
400: Bad request if trying to book a ticket that is not open

http method:PUT 
api :/ticket/:ticket_id'**
update ticket and passenger detail

 {
    "is_booked": true, -> can be true or false
    "passenger": {
        "name": "sagar gupta",
        "sex": "M",
        "age": 15,
        "phone": "123563123",
        "email": "sagar@gmail.com"
    }
}
* returns:
200: if success, returns object that was saved
404: if fails returns error in this format {message:"error in string"}

GET 
api:/ticket/:ticket_id
 *Get the status of the ticket based on the ticket_id passed in URL*
* returns:
200: if success, returns object that was saved
404: if fails returns error in this format {message:"error in string"}

GET 
api:tickets/open**
Get a list of tickets which have is_booked: false, that is, are open
* returns:
200: if success, returns object that was saved
404: if fails returns error in this format {message:"error in string"}

GET 
api:tickets/closed
* *Get a list of tickets which have is_booked: true, that is, are closed*
* returns:
200: if success, returns object that was saved
404: if fails returns error in this format {message:"error in string"}

GET 
api:ticket/details/:ticket_id**
* *Get the user details of the ticket based on the ticket_id passed*
* returns:
200: if success, returns object that was saved
404: if fails returns error in this format {message:"error in string"}


GET
API:tickets/allticket
Get the details of the all ticket
 returns:
200: if success, returns object that was saved
404: if fails returns error in this format {message:"error in string"}


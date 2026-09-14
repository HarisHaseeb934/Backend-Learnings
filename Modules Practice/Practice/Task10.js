const EventEmitter = require("events");

class TicketSystem extends EventEmitter{
    avaliableTickets = 3;
    constructor(){
        super()
    }

    buyTicket(customerName){
        if(this.avaliableTickets > 0){
            this.avaliableTickets--;
            this.emit("ticketPurchased", {customerName, avaliableTickets: this.avaliableTickets});
            return;
        }
        if(this.avaliableTickets === 0){
            this.emit("error", new Error("Sold out! "))
        }
    }
}

const ts = new TicketSystem();
ts.on("ticketPurchased", (customer) => {
    console.log(`${customer.customerName}, Avaliable Tickets: ${customer.avaliableTickets}`)
})

ts.on("error", (error) => console.log(error.message));

ts.buyTicket("Haris")
ts.buyTicket("Soban")
ts.buyTicket("Mute")
ts.buyTicket("Wasay")
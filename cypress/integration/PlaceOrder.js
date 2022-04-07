/// <reference types="Cypress"/>

const { expect } = require("chai");


describe('API Assignment Suit LalaMove',()=>{

it('Place Order',()=>{
   // Post Request to place the order
  cy.request({
    method:'POST',
    url:'http://localhost:51544/v1/orders',
    // JASON Payload
    body:{
        "stops": 
          [   
            {
                "lat": 22.344674, "lng": 114.124651
            },
            {
                "lat": 22.375384, "lng": 114.182446
            },
            {
                "lat": 22.385669, "lng": 114.186962
            },  
          ]
        }

  }).then((Response)=>{
        cy.log(JSON.stringify(Response.body))       // Complete log of request
        expect(Response.status).to.eq(201);        // Status Assertion
        expect(Response.body).has.property('id')   // Assert id must be present
        assert.isNumber(Response.body.id)          // Assert Id must be number
  }).then((resp)=>{
      const orderId = resp.body.id;              // Storing Id of post request 
      // Get Request to fetech the detail of order
      cy.request({
        method:'GET',
        url:'http://localhost:51544//v1/orders/'+orderId

      }).then((resp)=>{
      expect(resp.status).to.be.eq(200);          // Assert the Status
      //expect(resp.body).has.property('status');
      cy.log(JSON.stringify(resp.body))           // Complete log of GET Request     
  })

 })

})







})
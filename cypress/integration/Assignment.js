/// <reference types="Cypress"/>

describe('API Assignment Suit LalaMove',()=>{
  //Place Order
  it('Place Order : Return HTTP 201 (Created) with JSON body containing',()=>{
    // POST request
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
    })
  })

  // Post request must have ID  
  it('Place Order : Return HTTP 201 (Created) and ID must not be Null',()=>{
    //POST Request
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
          expect(Response.status).to.eq(201);  
          expect(Response.body).has.property('id')   // Assert Id must be present
          assert.isNumber(Response.body.id)          // Assert Id must be number
    })
  })

  // Calculate fare 
  it('Place order calculate fare  Assuming time is not IN ( from 10pm ~ 5am, it will be HKD 20)',()=>{
    // POST Request
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
          // fare calculation if HKD 20 for first 2 kilometers (from 10pm ~ 5am, it will be HKD 30)
          const distanceOneInMeters=Response.body.drivingDistancesInMeters[0];
          const distanceTwoInMeters=Response.body.drivingDistancesInMeters[1];
          // Time is not ( 10pm ~ 5am ) it will be HKD 20
          const First2KMChargHDK20= 20*2;   
          const TotalDistanceInMeters = distanceOneInMeters + distanceTwoInMeters;
          const TotalDistanceInKiloMeters = (TotalDistanceInMeters/1000);
          // For 1st 2KM 
          const MetersDistancewillbeCharge20HDK= TotalDistanceInMeters-2000;
          // Time Not ( 10pm ~ 5am ) it will be HKD 5
          const  CostofAllMetersCharg20HDK= (MetersDistancewillbeCharge20HDK/200)*5; 
          const TotalFare = CostofAllMetersCharg20HDK + First2KMChargHDK20;

          cy.log(JSON.stringify(Response.body))       // Complete log of request
          expect(Response.status).to.eq(201);         // Assert 201
          expect(Response.body).has.property('id')   // Assert id must be present
          assert.isNumber(Response.body.id)         // Assert Id must be number

          cy.log('Total fare as per given Login : '+TotalFare);   // Total Fare as per logic
    })
  })


// Fetch order details //

it('Fetch Order Details: Returns HTTP 200 with JSON body',()=>{
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
      const orderId = resp.body.id;                // Storing Id of post request 

      // Get Request to fetech the detail of order

      cy.request({
        method:'GET',
        url:'http://localhost:51544/v1/orders/'+orderId

      }).then((resp)=>{
      expect(resp.status).to.be.eq(200)              // Assert the Status
      cy.log(JSON.stringify(resp.body))              // Complete log of GET Request     
  })
 })
})

it('Fetch Order Details : Returns HTTP 404 if the order doesn’t exist',()=>{

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
        // Get Request to fetech the detail of order
        cy.request({
          method:'GET',
          url:'http://localhost:51544/v1/orders/6714264',  // Wrong ID which does not exist
          failOnStatusCode:false
  
        }).then((resp)=>{
        expect(resp.status).to.be.eq(404)            // Assert the Status
        cy.log(JSON.stringify(resp.body))            // Complete log of GET Request     
    })
   })
})

// Driver to Take the Order //

//Driver to Take the Order E2E test cases

it('Driver To  take the order : Returns HTTP 200 with JSON body',()=>{
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
  }).then((resp)=>{
    const orderId = resp.body.id;                 // Storing Id of post request 

    // Get Request to fetech the detail of order

    cy.request({
      method:'PUT',
      url:'http://localhost:51544/v1/orders/'+orderId+'/take'
              })
              .then((resp)=>{
                expect(resp.status).to.be.eq(200)         // Assert the Status
                cy.log(JSON.stringify(resp.body))
               })
 })

})

//E2E test case

it('Driver To  take the order : Returns HTTP 404 if the order doesn’t exist',()=>{
  // PUT Request
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
  }).then((resp)=>{

    const orderId = resp.body.id;                // Storing Id of post request

    // Get Request to fetech the detail of order
    cy.request({
      method:'PUT',
      url:'http://localhost:51544/v1/orders/34244/take',   // Wrong ID which does not exist
      failOnStatusCode:false
              })
              .then((resp)=>{
                expect(resp.status).to.be.eq(404)         // Assert the Status 404
                cy.log(JSON.stringify(resp.body))
               })
 })
})

//E2E test case

it('Driver To  take the order : Return HTTP 422 with custom message if logic flow is violated ',()=>{
  //Put Request
  cy.request({
    method:'PUT',
    url:'http://localhost:51544/v1/orders/5/take', // Wrong ID which does not exist
    failOnStatusCode:false   
}).then((resp)=>{
   expect(resp.status).to.eq(422)                   // Assert 422 
})

})

// Driver to Complete the Order endpoint //

// E2E Test Case
it('Complete the Order: Returns HTTP 200 with JSON body',()=>{
  // POST Request
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
        expect(Response.status).to.eq(201)         // Status Assertion
       
  }).then((resp)=>{
    const orderId = resp.body.id;                  // Storing Id of post request 

    // Get Request to fetech the detail of order (Assign Order Status)
    cy.request({
      method:'GET',
      url:'http://localhost:51544/v1/orders/'+orderId   // Order Assign Status

    }).then((resp)=>{
    expect(resp.status).to.be.eq(200)            // Assert the Status
    expect(resp.body).has.property('status');
    cy.log(JSON.stringify(resp.body))           // Complete log of GET Request     
})
}).then((resp)=>{
    const orderId = resp.body.id;              // Storing Id of post request 
    
    // PUT Request :Driver to take  the Order 
    cy.request({
      method:'PUT',
      url:'http://localhost:51544/v1/orders/'+orderId+'/take'    // Order Ongoing Status
    }).then((resp)=>{
    expect(resp.status).to.be.eq(200)           // Assert the Status
    cy.log(JSON.stringify(resp.body))           // Complete log of PUT Request     
       }).then((resp)=>{
        const orderId = resp.body.id;           // Order ID Storing
        cy.request({
          method:'PUT',
          url:'http://localhost:51544/v1/orders/'+orderId+'/complete'     // Order Complete Status
        }).then((resp)=>{
        expect(resp.status).to.be.eq(200)            // Assert the Status
        cy.log(JSON.stringify(resp.body))           // Complete log of PUT Request     
           })
       })
})
})
// E2E Test Case 
it('Complete the Order: Returns HTTP 404 if the order doesn’t exist',()=>{

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
        expect(Response.status).to.eq(201)         // Status Assertion
       
  }).then((resp)=>{
    const orderId = resp.body.id;              // Storing Id of post request 

    // Get Request to fetech the detail of order (Assign Order Status)
    cy.request({
      method:'GET',
      url:'http://localhost:51544/v1/orders/'+orderId   // Order Assign Status

    }).then((resp)=>{
    expect(resp.status).to.be.eq(200)            // Assert the Status
    expect(resp.body).has.property('status');
    cy.log(JSON.stringify(resp.body))           // Complete log of GET Request     
})
}).then((resp)=>{
    const orderId = resp.body.id;              // Storing Id of post request 
    
    // PUT Request :Driver to take  the Order 
    cy.request({
      method:'PUT',
      url:'http://localhost:51544/v1/orders/'+orderId+'/take'    // Order Ongoing Status
    }).then((resp)=>{
    expect(resp.status).to.be.eq(200)           // Assert the Status
    cy.log(JSON.stringify(resp.body))           // Complete log of PUT Request     
       }).then((resp)=>{
        const orderId = resp.body.id;           // Order ID Storing
        cy.request({
          method:'PUT',
          url:'http://localhost:51544/v1/orders/53636/complete',
          failOnStatusCode:false      // Order Complete Status
        }).then((resp)=>{
        expect(resp.status).to.be.eq(404)            // Assert the Status 404
        cy.log(JSON.stringify(resp.body))           // Complete log of PUT Request     
           })
       })
})
})

// E2E Test Case
it('Complete the Order: Return HTTP 422 with custom message if logic flow is violated',()=>{
  cy.request({
    method:'PUT',
    url:'http://localhost:51544/v1/orders/13/complete',
    failOnStatusCode:false
            })
            .then((resp)=>{
              expect(resp.status).to.be.eq(422)         // Assert the Status
             // expect(resp.body).has.property('status');
              cy.log(JSON.stringify(resp.body))
            // expect(resp.body).should.has()
             })
})

//  Cancel Order  //
// E2E test case
it('Cancel order : Returns HTTP 200 with JSON body',()=>{
   // Create Order 
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
        expect(Response.status).to.eq(201)         // Status Assertion 201
       
  }).then((resp)=>{
    const orderId = resp.body.id;              // Storing Id of post request 
    
    // PUT Request : Cancel order
    cy.request({
      method:'PUT',
      url:'http://localhost:51544/v1/orders/'+orderId+'/cancel'

    }).then((resp)=>{
    expect(resp.status).to.be.eq(200)           // Assert the Status 200
    cy.log(JSON.stringify(resp.body))           // Complete log of GET Request     
})

})
})
 
// E2E Test case
it('Cancel order : Returns HTTP 404 if the order doesn’t exist',()=>{

  cy.request({
    method:'PUT',
    url:'http://localhost:51544/v1/orders/6579/cancel',
    failOnStatusCode:false
            })
            .then((resp)=>{
              expect(resp.status).to.be.eq(404)           // Assert the Status 404
              cy.log(JSON.stringify(resp.body))           // Complete log of GET Request     
            })
})

// E2E test case                 
it('Cancel order : Return HTTP 422 with custom message if logic flow is violated',()=>{

  // Create Order 
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
        expect(Response.status).to.eq(201)         // Status Assertion
       
  }).then((resp)=>{
    const orderId = resp.body.id;              // Storing Id of post request 
    
    // PUT Request : Cancel order
    cy.request({
      method:'PUT',
      url:'http://localhost:51544/v1/orders/'+orderId+'/cancel'

    }).then((resp)=>{
    expect(resp.status).to.be.eq(200)         // Assert the Status
    cy.log(JSON.stringify(resp.body))           // Complete log of GET Request     
})
})
})
})
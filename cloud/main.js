
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

//add Stripe customer card.
Parse.Cloud.define("saveStripeCardId", function (request, response) {
 Parse.Cloud.httpRequest({
    method: 'POST',
    url: 'https://' + 'sk_test_PvLy60iEFmCJrYqroqfRB1jm' + ':@' + 'api.stripe.com/v1/' + "customers/" + request.params.customerId + "/cards",

    body: "card="+request.params.cardToken, 
    success: function(card) {
        Parse.Cloud.useMasterKey();
        var CardObject = Parse.Object.extend("Cards");
        var addCard = new CardObject();
        addCard.save({cardId:card.data.id, last4:request.params.last4, cardBrand:request.params.cardBrand, userId:request.params.userId, customerId:request.params.customerId},
            {
                success: function(httpResponse) {

                response.success("good");
                },
                error: function(httpResponse, error) {
                response.error(response.message);
                }
            });
    },
    error: function(card, error) {
        response.error(response.message);
    }
    });
});

Parse.Cloud.define("saveStripeCustomerId", function (request, response) {
 Parse.Cloud.httpRequest({
    method: 'POST',
    url: 'https://' + 'sk_test_PvLy60iEFmCJrYqroqfRB1jm' + ':@' + 'api.stripe.com/v1/' + "customers",
    headers: {
        'Authorization': 'Basic c2tfdGVzdF9Qdkx5NjBpRUZtQ0pyWXFyb3FmUkIxam0'
      },
      body: {
        "email":request.params.email, 
    },
    success: function(customer) {
        Parse.Cloud.useMasterKey();
        var Usr = request.user;
            Usr.set("StripeCustomerId", customer.data.id);
            Usr.save(null, {
                success: function(httpResponse) {

                response.success("good");
                },
                error: function(httpResponse, error) {
                response.error("error");
                }
            });
    },
    error: function(customer, error) {
        response.error("error");
    }
    });
});

Parse.Cloud.define("updateCustomerCard", function (request, response) {
 Parse.Cloud.httpRequest({
    method: 'POST',
    url: 'https://' + 'sk_test_PvLy60iEFmCJrYqroqfRB1jm' + ':@' + 'api.stripe.com/v1/' + "customers/" + request.params.customerId,
    headers: {
        'Authorization': 'Basic c2tfdGVzdF9Qdkx5NjBpRUZtQ0pyWXFyb3FmUkIxam0'
      },
      body: {
        "default_source":request.params.cardId, 
    },
        success: function(customer) {
            response.success("good");
        },
        error: function(customer) {
            response.error("error");
        }
    });
});

//delete Stripe customer card.
Parse.Cloud.define("deleteStripeCustomerCard", function (request, response) {
         Parse.Cloud.httpRequest({
                method:"DELETE",
                 url: "https://" + "sk_test_PvLy60iEFmCJrYqroqfRB1jm" + ':@' + "api.stripe.com/v1" + "/customers/" + request.params.customerId + "/cards/" + request.params.cardId,
              
                success: function(httpResponse) {
                response.success("good");
                },
                error: function(httpResponse) {
                response.error('Request failed with response code ' + httpResponse.status);
                }
        });                
 });

//Create Stripe accounts.
Parse.Cloud.define("updateStripeBankAcccount", function (request, response) 
{  
    Parse.Cloud.httpRequest({
      method: 'POST',
      url: 'https://' + 'sk_test_PvLy60iEFmCJrYqroqfRB1jm' + ':@' + 'api.stripe.com/v1/' + "accounts/" + request.params.accountId, 
      headers: {
        'Authorization': 'Basic c2tfdGVzdF9Qdkx5NjBpRUZtQ0pyWXFyb3FmUkIxam0'
      },
      body: {
        'external_account': request.params.bankToken,
      },
        success: function(httpResponse) {
        response.success("good");
        },
        error: function(httpResponse) {
        response.error('Request failed with response code ' + httpResponse.status);
        }
    })
});

Parse.Cloud.define("updateUSAcccount", function (request, response) 
{  
    Parse.Cloud.httpRequest({
      method: 'POST',
      url: 'https://' + 'sk_test_PvLy60iEFmCJrYqroqfRB1jm' + ':@' + 'api.stripe.com/v1/' + "accounts/" + request.params.accountId, 
      headers: {
        'Authorization': 'Basic c2tfdGVzdF9Qdkx5NjBpRUZtQ0pyWXFyb3FmUkIxam0'
      },
      body: {
        'legal_entity[first_name]':request.params.first_name,
        'legal_entity[last_name]':request.params.last_name,
        'legal_entity[dob][month]':request.params.dobMonth,
        'legal_entity[dob][day]':request.params.dobDay,
        'legal_entity[dob][year]':request.params.dobYear,
        'legal_entity[address][line1]':request.params.line1,
        'legal_entity[address][line2]':request.params.addLine2,
        'legal_entity[address][city]':request.params.city,
        'legal_entity[address][state]':request.params.state,
        'legal_entity[address][postal_code]':request.params.postal_code,
        'legal_entity[ssn_last_4]':request.params.ssnLast4,
      },
      success: function(httpResponse) {
        Parse.Cloud.useMasterKey();
            var Usr = request.user;
                Usr.set("firstName",request.params.first_name);
                Usr.set("lastName",request.params.last_name);
                Usr.set("phoneNumber",request.params.phoneNumber);
                Usr.set("line1",request.params.line1);
                Usr.set("line2",request.params.line2);
                Usr.set("city",request.params.city);
                Usr.set("state",request.params.state);
                Usr.set("postalCode",request.params.postal_code);
                Usr.set("dobMonth",request.params.dobMonth);
                Usr.set("dobDay",request.params.dobDay);
                Usr.set("dobYear",request.params.dobYear);
                Usr.save(null, {
                success: function(httpResponse) {
                response.success("account saved to parse = " + Usr.get("username"));
                    },
                error: function(httpResponse, error) {
                response.error("oh uh non oooo failed to saved account id to parse");
                }
            })
            
            },
            error: function(httpResponse) {
            response.error('Request failed with response code' + httpResponse.status);
            }
    })
});

Parse.Cloud.define("updateCAAcccount", function (request, response) 
{  
    Parse.Cloud.httpRequest({
      method: 'POST',
      url: 'https://' + 'sk_test_PvLy60iEFmCJrYqroqfRB1jm' + ':@' + 'api.stripe.com/v1/' + "accounts/" + request.params.accountId, 
      headers: {
        'Authorization': 'Basic c2tfdGVzdF9Qdkx5NjBpRUZtQ0pyWXFyb3FmUkIxam0'
      },
      body: {
        'legal_entity[first_name]':request.params.first_name,
        'legal_entity[last_name]':request.params.last_name,
        'legal_entity[dob][month]':request.params.dobMonth,
        'legal_entity[dob][day]':request.params.dobDay,
        'legal_entity[dob][year]':request.params.dobYear,
        'legal_entity[address][line1]':request.params.line1,
        'legal_entity[address][line2]':request.params.addLine2,
        'legal_entity[address][city]':request.params.city,
        'legal_entity[address][state]':request.params.state,
        'legal_entity[address][postal_code]':request.params.postal_code,
        'legal_entity[personal_id_number]':request.params.ssnLast4,
      },
      success: function(httpResponse) {
        Parse.Cloud.useMasterKey();
            var Usr = request.user;
                Usr.set("firstName",request.params.first_name);
                Usr.set("lastName",request.params.last_name);
                Usr.set("phoneNumber",request.params.phoneNumber);
                Usr.set("line1",request.params.line1);
                Usr.set("line2",request.params.line2);
                Usr.set("city",request.params.city);
                Usr.set("state",request.params.state);
                Usr.set("postalCode",request.params.postal_code);
                Usr.set("dobMonth",request.params.dobMonth);
                Usr.set("dobDay",request.params.dobDay);
                Usr.set("dobYear",request.params.dobYear);
                Usr.save(null, {
                success: function(httpResponse) {
                response.success("account saved to parse = " + Usr.get("username"));
                },
                error: function(httpResponse, error) {
                response.error("oh uh non oooo failed to saved account id to parse");
                }
            })
            
            },
            error: function(httpResponse) {
            response.error('Request failed with response code' + httpResponse.status);
            }
    })
});

Parse.Cloud.define("updateAcccount", function (request, response) 
{  
    Parse.Cloud.httpRequest({
      method: 'POST',
      url: 'https://' + 'sk_test_PvLy60iEFmCJrYqroqfRB1jm' + ':@' + 'api.stripe.com/v1/' + "accounts/" + request.params.accountId, 
      headers: {
        'Authorization': 'Basic c2tfdGVzdF9Qdkx5NjBpRUZtQ0pyWXFyb3FmUkIxam0'
      },
      body: {
        'legal_entity[first_name]':request.params.first_name,
        'legal_entity[last_name]':request.params.last_name,
        'legal_entity[dob][month]':request.params.dobMonth,
        'legal_entity[dob][day]':request.params.dobDay,
        'legal_entity[dob][year]':request.params.dobYear,
        'legal_entity[address][line1]':request.params.line1,
        'legal_entity[address][line2]':request.params.addLine2,
        'legal_entity[address][city]':request.params.city,
        'legal_entity[address][state]':request.params.state,
        'legal_entity[address][postal_code]':request.params.postal_code,
      },
      success: function(httpResponse) {
        Parse.Cloud.useMasterKey();
            var Usr = request.user;
                Usr.set("firstName",request.params.first_name);
                Usr.set("lastName",request.params.last_name);
                Usr.set("phoneNumber",request.params.phoneNumber);
                Usr.set("line1",request.params.line1);
                Usr.set("line2",request.params.line2);
                Usr.set("city",request.params.city);
                Usr.set("state",request.params.state);
                Usr.set("postalCode",request.params.postal_code);
                Usr.set("dobMonth",request.params.dobMonth);
                Usr.set("dobDay",request.params.dobDay);
                Usr.set("dobYear",request.params.dobYear);
                Usr.save(null, {
                success: function(httpResponse) {
                response.success("account saved to parse = " + Usr.get("username"));
                    },
                error: function(httpResponse, error) {
                response.error("oh uh non oooo failed to saved account id to parse");
                }
            })
            
            },
            error: function(httpResponse) {
            response.error('Request failed with response code' + httpResponse.status);
            }
    })
});


Parse.Cloud.define("saveStripeAcccount", function (request, response) 
{  
    Parse.Cloud.httpRequest({
      method: 'POST',
      url: 'https://' + 'sk_test_PvLy60iEFmCJrYqroqfRB1jm' + ':@' + 'api.stripe.com/v1/' + "accounts", 
      headers: {
        'Authorization': 'Basic c2tfdGVzdF9Qdkx5NjBpRUZtQ0pyWXFyb3FmUkIxam0'
      },
      body: {
        'managed': true,
        'country': request.params.country,
        'email': request.params.email,
        'external_account': request.params.bankToken,
        'legal_entity[first_name]':request.params.first_name,
        'legal_entity[last_name]':request.params.last_name,
        'legal_entity[type]':request.params.businessType,
        'legal_entity[dob][month]':request.params.dobMonth,
        'legal_entity[dob][day]':request.params.dobDay,
        'legal_entity[dob][year]':request.params.dobYear,
        'legal_entity[address][line1]':request.params.line1,
        'legal_entity[address][line2]':request.params.addLine2,
        'legal_entity[address][city]':request.params.city,
        'legal_entity[address][state]':request.params.state,
        'legal_entity[address][postal_code]':request.params.postal_code,
        'legal_entity[ssn_last_4]':request.params.ssnLast4,
        'tos_acceptance[date]':request.params.date,
        'tos_acceptance[ip]':request.params.ip,
      },
      success: function(httpResponse) {
        Parse.Cloud.useMasterKey();
            var Usr = request.user;
                            Usr.set("StripeAccountId",httpResponse.data.id );
                            Usr.set("firstName",request.params.first_name);
                            Usr.set("lastName",request.params.last_name);
                            Usr.set("phoneNumber",request.params.phoneNumber);
                            Usr.set("line1",request.params.line1);
                            Usr.set("line2",request.params.line2);
                            Usr.set("city",request.params.city);
                            Usr.set("state",request.params.state);
                            Usr.set("postalCode",request.params.postal_code);
                            Usr.set("dobMonth",request.params.dobMonth);
                            Usr.set("dobDay",request.params.dobDay);
                            Usr.set("dobYear",request.params.dobYear);
                            Usr.set("accountLast4",request.params.last4);
                            Usr.set("country",request.params.country);
                            Usr.save(null, {
                success: function(httpResponse) {
                response.success("account saved to parse = " + Usr.get("username"));
                    },
                error: function(httpResponse, error) {
                response.error("oh uh non oooo failed to saved account id to parse");
                }
            })
            
            },
            error: function(httpResponse) {
            response.error('Request failed with response code' + httpResponse.status);
            }
    })
   
});

Parse.Cloud.define("saveCAStripeAcccount", function(request, response) 
{  
    Parse.Cloud.httpRequest({
      method: 'POST',
      url: 'https://' + 'sk_test_PvLy60iEFmCJrYqroqfRB1jm' + ':@' + 'api.stripe.com/v1/' + "accounts", 
      headers: {
        'Authorization': 'Basic c2tfdGVzdF9Qdkx5NjBpRUZtQ0pyWXFyb3FmUkIxam0'
      },
      body: {
        'managed': true,
        'country': request.params.country,
        'email': request.params.email,
        'external_account': request.params.bankToken,
        'legal_entity[first_name]':request.params.first_name,
        'legal_entity[last_name]':request.params.last_name,
        'legal_entity[type]':request.params.businessType,
        'legal_entity[dob][month]':request.params.dobMonth,
        'legal_entity[dob][day]':request.params.dobDay,
        'legal_entity[dob][year]':request.params.dobYear,
        'legal_entity[address][line1]':request.params.line1,
        'legal_entity[address][line2]':request.params.addLine2,
        'legal_entity[address][city]':request.params.city,
        'legal_entity[address][state]':request.params.state,
        'legal_entity[address][postal_code]':request.params.postal_code,
        'legal_entity[personal_id_number]':request.params.ssnLast4,
        'tos_acceptance[date]':request.params.date,
        'tos_acceptance[ip]':request.params.ip,
      },
      success: function(httpResponse) {
        Parse.Cloud.useMasterKey();
            var Usr = request.user;
                            Usr.set("StripeAccountId",httpResponse.data.id );
                            Usr.set("firstName",request.params.first_name);
                            Usr.set("lastName",request.params.last_name);
                            Usr.set("phoneNumber",request.params.phoneNumber);
                            Usr.set("line1",request.params.line1);
                            Usr.set("line2",request.params.line2);
                            Usr.set("city",request.params.city);
                            Usr.set("state",request.params.state);
                            Usr.set("postalCode",request.params.postal_code);
                            Usr.set("dobMonth",request.params.dobMonth);
                            Usr.set("dobDay",request.params.dobDay);
                            Usr.set("dobYear",request.params.dobYear);
                            // Usr.set("accountLast4",request.params.last4);
                            Usr.set("country",request.params.country);
                            Usr.save(null, {
                success: function(httpResponse) {
                response.success("account saved to parse = " + Usr.get("username"));
                    },
                error: function(httpResponse, error) {
                response.error("oh uh non oooo failed to saved account id to parse");
                }
            })
            
            },
            error: function(httpResponse) {
            response.error('Request failed with response code' + httpResponse.status);
            }
    })
   
});

Parse.Cloud.define("saveAUStripeAcccount", function(request, response) 
{  
    Parse.Cloud.httpRequest({
      method: 'POST',
      url: 'https://' + 'sk_test_PvLy60iEFmCJrYqroqfRB1jm' + ':@' + 'api.stripe.com/v1/' + "accounts", 
      headers: {
        'Authorization': 'Basic c2tfdGVzdF9Qdkx5NjBpRUZtQ0pyWXFyb3FmUkIxam0'
      },
      body: {
        'managed': true,
        'country': request.params.country,
        'email': request.params.email,
        'external_account': request.params.bankToken,
        'legal_entity[first_name]':request.params.first_name,
        'legal_entity[last_name]':request.params.last_name,
        'legal_entity[type]':request.params.businessType,
        'legal_entity[dob][month]':request.params.dobMonth,
        'legal_entity[dob][day]':request.params.dobDay,
        'legal_entity[dob][year]':request.params.dobYear,
        'legal_entity[address][line1]':request.params.line1,
        'legal_entity[address][line2]':request.params.addLine2,
        'legal_entity[address][city]':request.params.city,
        'legal_entity[address][state]':request.params.state,
        'legal_entity[address][postal_code]':request.params.postal_code,
        'tos_acceptance[date]':request.params.date,
        'tos_acceptance[ip]':request.params.ip,
      },
      success: function(httpResponse) {
        Parse.Cloud.useMasterKey();
            var Usr = request.user;
                            Usr.set("StripeAccountId",httpResponse.data.id );
                            Usr.set("firstName",request.params.first_name);
                            Usr.set("lastName",request.params.last_name);
                            Usr.set("phoneNumber",request.params.phoneNumber);
                            Usr.set("line1",request.params.line1);
                            Usr.set("line2",request.params.line2);
                            Usr.set("city",request.params.city);
                            Usr.set("state",request.params.state);
                            Usr.set("postalCode",request.params.postal_code);
                            Usr.set("dobMonth",request.params.dobMonth);
                            Usr.set("dobDay",request.params.dobDay);
                            Usr.set("dobYear",request.params.dobYear);
                            // Usr.set("accountLast4",request.params.last4);
                            Usr.set("country",request.params.country);
                            Usr.save(null, {
                success: function(httpResponse) {
                response.success("account saved to parse = " + Usr.get("username"));
                    },
                error: function(httpResponse, error) {
                response.error("oh uh non oooo failed to saved account id to parse");
                }
            })
            
            },
            error: function(httpResponse) {
            response.error('Request failed with response code' + httpResponse.status);
            }
    })
   
});

Parse.Cloud.define("saveEUStripeAcccount", function(request, response) 
{  
    Parse.Cloud.httpRequest({
      method: 'POST',
      url: 'https://' + 'sk_test_PvLy60iEFmCJrYqroqfRB1jm' + ':@' + 'api.stripe.com/v1/' + "accounts", 
      headers: {
        'Authorization': 'Basic c2tfdGVzdF9Qdkx5NjBpRUZtQ0pyWXFyb3FmUkIxam0'
      },
      body: {
        'managed': true,
        'country': request.params.country,
        'email': request.params.email,
        'external_account': request.params.bankToken,
        'legal_entity[first_name]':request.params.first_name,
        'legal_entity[last_name]':request.params.last_name,
        'legal_entity[type]':request.params.businessType,
        'legal_entity[dob][month]':request.params.dobMonth,
        'legal_entity[dob][day]':request.params.dobDay,
        'legal_entity[dob][year]':request.params.dobYear,
        'legal_entity[address][line1]':request.params.line1,
        'legal_entity[address][line2]':request.params.addLine2,
        'legal_entity[address][city]':request.params.city,
        'legal_entity[address][state]':request.params.state,
        'legal_entity[address][postal_code]':request.params.postal_code,
        'tos_acceptance[date]':request.params.date,
        'tos_acceptance[ip]':request.params.ip,
      },
      success: function(httpResponse) {
        Parse.Cloud.useMasterKey();
            var Usr = request.user;
                            Usr.set("StripeAccountId",httpResponse.data.id );
                            Usr.set("firstName",request.params.first_name);
                            Usr.set("lastName",request.params.last_name);
                            Usr.set("phoneNumber",request.params.phoneNumber);
                            Usr.set("line1",request.params.line1);
                            Usr.set("line2",request.params.line2);
                            Usr.set("city",request.params.city);
                            Usr.set("state",request.params.state);
                            Usr.set("postalCode",request.params.postal_code);
                            Usr.set("dobMonth",request.params.dobMonth);
                            Usr.set("dobDay",request.params.dobDay);
                            Usr.set("dobYear",request.params.dobYear);
                            Usr.set("accountLast4",request.params.last4);
                            Usr.set("country",request.params.country);
                            Usr.save(null, {
                success: function(httpResponse) {
                response.success("account saved to parse = " + Usr.get("username"));
                    },
                error: function(httpResponse, error) {
                response.error("oh uh non oooo failed to saved account id to parse");
                }
            })
            
            },
            error: function(httpResponse) {
            response.error('Request failed with response code' + httpResponse.status);
            }
    })
   
});

//Create Customer subscription.
Parse.Cloud.define("createAccountPlan", function (request, response) {
     Parse.Cloud.httpRequest({
        method:"POST",
        url: "https://" + "sk_test_PvLy60iEFmCJrYqroqfRB1jm" + ':@' + "api.stripe.com/v1/plans",  
        headers: {
        'Stripe-Account': request.params.accountId
        },
        body: {
            'amount': request.params.amount,
            'interval': 'day',
            'interval_count':request.params.intervalCount,
            'name': request.params.planName,
            'currency': 'usd',
            'id':request.params.planId,
        },
        success: function(httpResponse) {
        response.success(httpResponse.text);
        },
        error: function(httpResponse) {
        response.error('Request failed with response code' + httpResponse.status);
        }
    });                 
 });

Parse.Cloud.define("createAccountCustomerToken", function (request, response) {
     Parse.Cloud.httpRequest({
        method:"POST",
        url: "https://" + "sk_test_PvLy60iEFmCJrYqroqfRB1jm" + ':@' + "api.stripe.com/v1/tokens",  
        headers: {
        'Stripe-Account': request.params.accountId
        },
        body: {
            'customer':request.params.customerId,
            'card':request.params.cardId,
        },
        success: function(httpResponse) {
        Parse.Cloud.useMasterKey();
        var Activity = Parse.Object.extend("Activity");
         
        var GalleryObject = new Parse.Object("Gallery");
         GalleryObject.id = request.params.galleryId;
         
        var subscribe = new Activity();
         subscribe.save({customerToken:httpResponse.data.id, type:'follow', toGallery:GalleryObject, fromUser:request.user},
                {
                    success: function(httpResponse) {
                    response.success("good");
                    },
                    error: function(httpResponse, error) {
                    response.error(response.status);
                    }
                });
            response.success(httpResponse.text);
        },
        error: function(httpResponse) {
        response.error('Request failed with response code' + httpResponse.status);
        }
    });                 
 });

Parse.Cloud.define("createAccountCustomerSubscription", function (request, response) {
     Parse.Cloud.httpRequest({
        method:"POST",
        url: "https://" + "sk_test_PvLy60iEFmCJrYqroqfRB1jm" + ':@' + "api.stripe.com/v1/customers",  
        headers: {
        'Stripe-Account': request.params.accountId
        },
        body: {
            'source':request.params.customerToken,
            'plan':request.params.galleryId,
            'application_fee_percent':30,
            'email':request.params.userEmail,
            'description':request.params.userName,
        },
        success: function(httpResponse) {
            Parse.Cloud.useMasterKey();
            var Usr = request.user;
                Usr.set(request.params.galleryId,httpResponse.data.id);
                Usr.save(null, {
                success: function(httpResponse) {
                response.success("good");
                },
                error: function(httpResponse, error) {
                response.error(response.status);
                }
            })
        response.success(httpResponse.text);
        },
        error: function(httpResponse) {
        response.error('Request failed with response code' + httpResponse.status);
        }
    });                 
 });

Parse.Cloud.define("cancelAccountCustomerSubscription", function (request, response) {
     Parse.Cloud.httpRequest({
        method:"DELETE",
        url: "https://" + "sk_test_PvLy60iEFmCJrYqroqfRB1jm" + ':@' + "api.stripe.com/v1/customers/" + request.params.customerId,  
        headers: {
        'Stripe-Account': request.params.accountId
        },
        success: function(httpResponse) {
        response.success(httpResponse.text);
        },
        error: function(httpResponse) {
        response.error('Request failed with response code' + httpResponse.status);
        }
    });                 
 });

//Delete Stripe account
Parse.Cloud.define("deleteStripeAccount", function (request, response) {
         Parse.Cloud.httpRequest({
                method:"DELETE",
                 url: "https://" + "sk_test_PvLy60iEFmCJrYqroqfRB1jm" + ':@' + "api.stripe.com/v1" + "/accounts/" + request.params.accountId,
              
            success: function(httpResponse) {
                Parse.Cloud.useMasterKey();
                var Usr = request.user;
                    Usr.unset("firstName");
                    Usr.unset("lastName");
                    Usr.unset("phoneNumber");
                    Usr.unset("line1");
                    Usr.unset("line2");
                    Usr.unset("city");
                    Usr.unset("state");
                    Usr.unset("postalCode");
                    Usr.unset("dobMonth");
                    Usr.unset("dobDay");
                    Usr.unset("dobYear");
                    Usr.unset("accountLast4");
                    Usr.unset("country");
                    Usr.save(null, {
                        success: function(userResponse) {
                        response.success(userResponse.text);
                        },
                        error: function(userResponse) {
                        response.error(userResponse.status);
                        }
                    })
            response.success(httpResponse.text);
            },
            error: function(httpResponse) {
            response.error('Request failed with response code' + httpResponse.status);
            }
        });
                    
 });


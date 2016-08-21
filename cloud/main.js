console.log('hello from cloud code');
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
        var Usr = user.getSessionToken();
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

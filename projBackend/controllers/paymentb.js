var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "hjmc8vsbdyk2wdbr",
  publicKey: "qn9rrwzsz35zb7bp",
  privateKey: "64a75874344fb2ae611cea477805c1ea",
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  var nonceFromTheClient = req.body.payment_method_nonce;

  var amountFromTheClient = req.body.amount;

  console.log("NONCE:", nonceFromTheClient);

  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    function (err, result) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(result);
      }
    }
  );
};

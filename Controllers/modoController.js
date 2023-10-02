const { createPaymentIntention } = require("../Services/modoServices");

exports.createPaymentInt = async (req, res) => {
    try {
        const result = await createPaymentIntention(req);
        const { status, data } = result;
        res.status(status).json(data);

    } catch (error) {
        res.status(500).send('Internal error server');
    }
};
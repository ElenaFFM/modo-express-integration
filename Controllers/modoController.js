const { createPaymentIntention } = require("../services/modoServices");

exports.createPaymentInt = async (req, res) => {
    try {
        const result = await createPaymentIntention(req);

        // Supongamos que result tiene una propiedad "status" y una propiedad "data"
        const { status, data } = result;
        res.status(status).json(data);

    } catch (error) {
        res.status(500).send('Internal error server');
    }
};
const express = require("express");
const { port } = require("./config");
const morgan = require('morgan');
const modoRouter = require('./Routes/modoRoutes');



const fs = require("fs");
const { default: axios } = require("axios");

const app = express();

app.use(express.json());




app.listen(port, () => {
    console.info("Server listening on PORT: ", port);
})


app.get("/status", (_, res) => {
    const status = {
        "Status": "Running"
    };

    res.send(status)
});



const BASE_URL_MODO = 'https://merchants.preprod.playdigital.com.ar';
const STORE_ID = '59540937-2423-4eec-a0c4-b4bf73216abd';
const CLIENT_ID = 'calmpreprod';
const CLIENT_SECRET = 'calmpreprod';


// Create Access Token
const generateAccessToken = async () => {
    const response = await axios.post(`${BASE_URL_MODO}/merchants/middleman/token`,
        {
            username: CLIENT_ID,
            password: CLIENT_SECRET,
        },
        { headers: { 'Content-Type': 'application/json' } });
    return response.data.accessToken;
};

// Create Payment Intention
const createPaymentIntention = async (req) => {

    // Crear orden de compra en la base de datos de la tienda. Esto viene desde el front.
    const mockOrder = {
        id: 123,
    };

    try {

        const accessToken = await generateAccessToken();
        console.info("token: ", accessToken);

        const response = await axios.post(`${BASE_URL_MODO}/merchants/ecommerce/payment-intention`,
            {
                productName: 'Producto botón de pago',
                price: req.body.price,
                quantity: 1,
                storeId: STORE_ID,
                currency: 'ARS',
                externalIntentionId: mockOrder.id,
                // expirationDate: "2023-12-27 18:50",
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

        return response.data;

    } catch (error) {

        fs.writeFile('./error.txt', error.message, (err) => {
            if (err) {
                console.error('Error al escribir en el archivo:', err);
            } else {
                console.error('Error guardado en error.txt');
            }
        });

        return error;
    }
};



app.post('/api/modo-checkout', async (req, res) => {
    res.json(await createPaymentIntention(req));
});

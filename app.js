const express = require("express");
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config({ path: './config.env' });

const { default: axios } = require("axios");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.info("Server listening on PORT: ", port);
})

app.get("/status", (_, res) => {
    const status = {
        "Status": "Running"
    };

    res.send(status)
});


app.post('/api/modo-checkout', async (req, res) => {
    // console.info(req)
    // console.info(req.body)
    // const resp = {
    //     body: req.body,
    //     example: "example hahaha"
    // }
    // res.send(resp);

    const result = await createPaymentIntention(req);
    const { status, data } = result; // Supongamos que result tiene una propiedad "status" y una propiedad "data"
    res.status(status).json(data);
});

// const BASE_URL_MODO = 'https://merchants.playdigital.com.ar';
// const STORE_ID = '{STORE_ID}';
// const CLIENT_ID = '{CLIENT_ID}';
// const CLIENT_SECRET = '{CLIENT_SECRET}';


// Create Payment Intention
const createPaymentIntention = async (req) => {
    // Crear orden de compra en la base de datos de la tienda. Esto viene desde el front (?.
    const mockOrder = {
        id: 123,
    };

    try {

        const accessToken = await generateAccessToken();

        const response = await axios.post(`${process.env.BASE_URL_MODO}/merchants/ecommerce/payment-intention`,
            {
                productName: 'Producto botón de pago',
                price: req.body.price,
                quantity: 1,
                storeId: process.env.STORE_ID,
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

        return {
            status: 201,
            data: response.data
        }


    } catch (error) {

        fs.writeFile('./error.txt', error.message, (err) => {
            if (err) {
                console.error('Error al escribir en el archivo:', err);
            } else {
                console.error('Error guardado en error.txt');
            }
        });

        return {
            status: 500,
            data: error
        }
    }
};


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
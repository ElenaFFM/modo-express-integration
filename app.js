const express = require("express");
require('dotenv').config();

const fs = require('fs');

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

// const BASE_URL_MODO = 'https://merchants.preprod.playdigital.com.ar'
// const STORE_ID = '59540937-2423-4eec-a0c4-b4bf73216abd'
// const CLIENT_ID = 'calmpreprod'
// const CLIENT_SECRET = 'calmpreprod'


// Create Payment Intention
const createPaymentIntention = async (req) => {
    // Crear orden de compra en la base de datos de la tienda. Esto viene desde el front (?.
    const mockOrder = {
        id: 123,
    };

    console.log(process.env.BASE_URL_MODO);
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
    console.log(process.env.BASE_URL_MODO);
    const response = await axios.post(`${process.env.BASE_URL_MODO}/merchants/middleman/token`,
        {
            username: process.env.CLIENT_ID,
            password: process.env.CLIENT_SECRET,
        },
        { headers: { 'Content-Type': 'application/json' } });
    return response.data.accessToken;
};
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(`${__dirname}/public/dist`));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/dist/index.htnl`);
});

app.listen(port, function() {
    console.log(`Listening on port:${port}`);
});
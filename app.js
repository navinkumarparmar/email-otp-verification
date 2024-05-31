const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path')
const routes = require('./routes/index')
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use('/api',routes)


app.listen(9898,()=>{
    console.log('your server is running on port 9898')
})
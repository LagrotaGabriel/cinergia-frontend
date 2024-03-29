const express = require('express')
const path = require('path')
const app = express();

const appName = 'frontend'

app.use(express.static(path.join(__dirname, 'dist',appName)));

app.get('/*', function(req, res){
    res.sendFile(path.join(__dirname,'dist',appName,'index.html'));
})

app.listen(process.env.PORT || 8080)
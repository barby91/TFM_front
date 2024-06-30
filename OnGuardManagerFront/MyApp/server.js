const express = require('express');
var path = require('path');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, 'dist/on-guard-manager-front')));

app.get('*', function(req, res){
	res.sendFile(path.join(__dirname, 'dist/on-guard-manager-front/browser/index.html'));
});

app.listen(port, () =>{
	console.log('Server started!');
	console.log(port);
});
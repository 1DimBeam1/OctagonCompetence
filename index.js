const express = require("express");
const app = express();

app.get('/', function(request, response){
    response.send('<h1>Привет Октагон!</h1>')
});

app.get('/static', function(request,response){
    response.json({
        header:"Hello",
        body: "Octagon NodeJS Test"      
    });
});

app.get('/dynamic', function(request,response){
    const {a,b,c} = request.query;
    const values = [a,b,c];

    let res = 1;
    for(const i of values ){
        if (isNaN(i)){
            return response.json({
                header:"Erorr"
            });
        }
        res *= Number(i); 
    }
    res /=3;

    response.json({
        header:"Calculated",
        body: res
    });
});

app.listen(3000);
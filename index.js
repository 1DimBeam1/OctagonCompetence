const express = require("express");
const app = express();
const mysql = require("mysql2");

const connection = mysql.createConnection(
{
    host: "localhost",
    user: "root",
    database: "chatbottests",
    password: ""
});

connection.connect(function(err)
{
    if (err)
    {
        return console.error("Ошибка: " + err.message)
    }
    else
    {
        console.log("Подключение к серверу MySQL успешно выполнено")
    }
});

app.get('/getAllItems', (request, response) =>
{
	connection.query('SELECT * FROM items', function(err, results, fields) 
    {
		if (err) 
        {
			response.json(err);
		}
		else if (results.length === 0) 
        {
			response.send([{}]);
		}
		else 
        {
			response.send(results);
		}
	});
});

app.use('/addItem', (request, response) => 
{
	const { name, descr } = request.query;

	if (!name || !descr) 
    {
		response.status(500).send(null);
		return;
	}
	
	const query = 'INSERT INTO items (name, descr) VALUES (?, ?)';
	connection.query(query, [name, descr], (error, results, fields) => 
    {
	    if (error) 
        {
            response.status(500).send(error);
            return;
        }
        response.send("Item " + name + " add in table")
    });
});

app.use('/deleteItem', (request, response) => 
{
    const num = request.query.id;
    const id = Number(num);

    if (isNaN(id)) {
        response.status(400).send(null);
        return;
    }

    const deleteQuery = 'DELETE FROM items WHERE id = ?';
    connection.query(deleteQuery, [id], (error, results, fields) => 
    {
        if (error) 
        {
        response.status(500).send(error);
            return;
        } 
        else 
        {
            response.status(200).send([{}]);
            return;
        }
    });

});

app.use('/deleteItem', (request, response) => 
{
    const num = request.query.id;
    if (!num) {
        response.status(400).send(null);
        return;
    }

    const id = Number(num);
    if (isNaN(id)) {
        response.status(400).send(null);
        return;
    }

    const deleteQuery = 'DELETE FROM items WHERE id = ?';
    connection.query(deleteQuery, [id], (error, results, fields) => 
    {
        if (error) 
        {
            response.status(500).send(error);
            return;
        } 
        else 
        {
            response.status(200).send([{}]);
            return;
        }
    });

});

app.use('/updateItem', (request, response) => 
{
    const { id, name, descr } = request.query;

    if (!id || !name || !descr) 
    {
        response.status(400).send(null);
        return;
    }

    const numId = Number(id);

    if (isNaN(id)) {
        response.status(400).send(null);
        return;
    }

    const updateQuery = 'UPDATE items SET name = ?, descr = ? WHERE id = ?';
    connection.query(updateQuery, [name, descr, numId], (error, results, fields) => 
    {
        if (error) 
        {
            response.status(500).send(error);
            return;
        }
        if (results.affectedRows === 0) 
        {
            response.send([{}]);
        } 
        else
        {
            response.send("update")
        }

  });
    
});


app.listen(3000);
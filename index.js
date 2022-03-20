const express = require('express');
const app = express();
const config = require('./config');
const Student = require('./Models/Student');


//establishes connetion to the database
config.authenticate().then(function(){
    console.log('Database is connected');
}).catch(function(err){
    console.log(err);
});
 

app.use(express.urlencoded({extended: false}));


//List all students
app.get('/', function(req, res){
    let data = {
        where: {}
    }

    //id filter
    if(req.query.id !== undefined){
        data.where.id = req.query.id;
    }

    //section filter
    if(req.query.section !== undefined){
        data.where.section = req.query.section;
    }

    Student.findAll(data).then(function(result){
        res.status(200).send(result);
    }).catch(function(err){
        res.status(500).send(err);
    });
});

//Create a new student
app.post('/', function(req, res){
    Student.create(req.body).then(function(result){
        res.redirect('/'); //Redirect to the get route to display all students
    }).catch(function(err){
        res.status(500).send(err);
    });
});

//Update first name of a student
app.patch('/:student_id', function(req, res){
    let studentId = req.params.student_id;

    //Find the student 
    Student.findByPk(studentId).then(function(result){
        //Check if student was found
        if(result){
            //Update student record
            result.name = req.body.name;

            //Save changes to DB
            result.save().then(function(){
                res.redirect('/');
            }).catch(function(err){
                res.status(500).send(err);
            });
        }
        else {
            res.status(404).send('Student record not found');
        }

    }).catch(function(err){
        res.status(500).send(err);
    });
});

//Delete a student record
app.delete('/:student_id', function(req, res){
    let studentId = req.params.student_id;

    //Find the student
    Student.findByPk(studentId).then(function(result){

        if(result){
            //Delete student from database
            result.destroy().then(function(){
                res.redirect('/');
            }).catch(function(err){
                res.status(500).send(err);
            });
        }
        else {
            res.status(404).send('Student record not found');
        }

    }).catch(function(err){
        res.status(500).send(err);
    });
});


app.listen(3000, function(){
    console.log('Server running on port 3000...');
});
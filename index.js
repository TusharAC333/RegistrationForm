const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@tusharcluster.zipmliw.mongodb.net/registrationFormDB`, {
});

const registrationSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

const Registration=mongoose.model("Registration",registrationSchema)

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/pages/index.html')

})

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser=await Registration.findOne({email:email});
        if(!existingUser){
            const registrationData = new Registration({
                name,
                email,
                password,
            });
            await registrationData.save();
            res.redirect("/success");
        }
        else{
            console.log("User Already exists");
            res.redirect("/error");
        }
        
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});


app.get('/success',(req,res)=>{
    res.sendFile(__dirname+"/pages/success.html")
})
app.get('/error',(req,res)=>{
    res.sendFile(__dirname+"/pages/error.html")
})

app.listen(port,()=>{
    console.log(`Server is running ${port}`);
})
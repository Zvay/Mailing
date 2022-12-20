
const envm = require('dotenv').config()
const express = require("express")
const mailchimp = require("@mailchimp/mailchimp_marketing")
const app = express()
const https = require("https")


app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({ extended: true }))

//Setting up MailChimp

mailchimp.setConfig({
    //API KEY
    apiKey: process.env.MAILCHIMP_API,
    //API KEY PREFIX (THE SERVER)
    server: process.env.SERVER
})

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")
});


app.post("/", function (req, res) {
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email

    //console.log(firstName, lastName, email);

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }

    const jsonData = JSON.stringify(data)

    const url = process.env.MAILCHIMP_URL

    console.log(process.env.MAILCHIMP_API)
    const options = {
        method: "POST",
        auth: `${process.env.MAILCHIMP_AUTH}:${process.env.MAILCHIMP_API}`
        //Enter the API key
    }

    const request = https.request(url, options, function (response) {



        console.log(response.statusCode);
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data))
        })
    })

    // comment the request to test the de failure page
    request.write(jsonData)
    request.end()

})

app.post("/failure", function (req, res) {
    res.redirect("/")
})

app.listen(process.env.POST || 3000, function () {

    console.log("Server is running on port 3000")
})


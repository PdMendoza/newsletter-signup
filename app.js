const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const port = 4040;
const app = express();

mailchimp.setConfig({
  apiKey: "bd45645e9fe5ff5e8a91b4e9fc162860-us21",
  server: "us21",
});

// for the server to be able to use static files such as css and images, a folder where they are must be specified
// solution was found in lection 223 comments
// app.use(express.static("public")); Angela solution didn't work
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.sendFile(__dirname + "/signup.html"));
app.get("/success", (req, res) => res.sendFile(__dirname + "/success.html"));
app.get("/failure", (req, res) => res.sendFile(__dirname + "/failure.html"));

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const members = [
    {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    },
  ];

  //   const jsonData = JSON.stringify(members);

  //   const url = "https://us21.api.mailchimp.com/3.0/list/12cb840f5c";

  //   const options = {
  //     method: "POST",
  //     auth: "pedro1:bd45645e9fe5ff5e8a91b4e9fc162860-us21",
  //   };

  //   const request = https.request(url, options, (response) => {
  //     response.on("data", (dt) => {
  //       console.log(JSON.parse(dt));
  //     });
  //   });

  // send request data to the mailchimp server
  //   request.write(jsonData);
  async function run() {
    try {
      const response = await mailchimp.lists.batchListMembers("12cb840f5c", {
        members,
      });
      //   const response = await mailchimp.lists.getList("12cb840f5c");
      if (response) {
        res.redirect("/success");
        // res.sendFile(__dirname + "/success.html");
      }
    } catch (error) {
      const errData = JSON.stringify(error.response);
      console.log(errData);
      res.redirect("/failure");
      //   res.sendFile(__dirname + "/failure.html");
    }
  }

  run();
  //   request.end();
});

app.post("/failure", (req, res) => res.redirect("/"));

app.listen(port, () =>
  console.log(
    `...........................................................App listening on port ${port}!`
  )
);

// Import dependencies
const express = require("express");
const https = require("https");
const moment = require("moment");

// Assign dependencies
const app = express();
app.set("view engine", "ejs");
app.use(express.static(`public`));

// Base URL and function
const mainURL = "https://disease.sh/v3/covid-19/countries";
const renderHTML = function (url, res, htmlPage) {
	https.get(url, function (response) {
		let body = "";

		response.on("data", function (data) {
			body += data;
		});

		response.on("end", function () {
			const info = htmlPage === "index" ? JSON.parse(body) : [JSON.parse(body)];
			const updatedTime = moment(info[0].updated).fromNow();

			res.render(htmlPage, {
				listCountry: info,
				timeUpdate: updatedTime,
			});
		});
	});
};

// Render main page
app.get("/", function (req, res) {
	const url = `${mainURL}?yesterday=true&sort=cases&allowNull=true`;
	renderHTML(url, res, "index");
});

// Render country page
app.get("/country/:countryName", function (req, res) {
	const url = `${mainURL}/${req.params.countryName}`;
	renderHTML(url, res, "country");
});

// Localhost or Heroku
app.listen(process.env.PORT || 3000, function () {
	console.log("Server is running on port 3000...");
});

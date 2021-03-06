// Declare API from 'https://disease.sh/' (JSON data is public, therefore no API key is needed)
let api_url = `https://disease.sh/v3/covid-19/historical/`;

//Selecting pre-loader
const loader = document.querySelector(".loader");

// Capture the Country's name on the header
const countryName = document
	.querySelectorAll(".dashboard")[0]
	.innerText.slice(12);

// Declare empty arrays
const timelineArr = [];
const confirmedArr = [];
const deathArr = [];
const recoveredArr = [];

// Pushing historical data
const pushData = function (data, array) {
	data.forEach(function (newData) {
		array.push(newData[1]);
	});
};

// Pushing historical timeline
// Have to separate because it would keep looping
const pushTime = function (data, array) {
	data.forEach(function (newData) {
		array.push(newData[0]);
	});
};

// Render graph data
const getData = async function () {
	// Fetching data from historical url
	await fetch(api_url)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			for (let i = 0; i < data.length; i++) {
				if (
					data[i].province ===
					countryName
						.toLowerCase()
						.normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "") // This is to replace accented characters
				) {
					const province = data[i].province.replace(/\s/g, "%20");
					api_url += `${data[i].country}/${province}?lastdays=all`;
				} else if (
					data[i].country === countryName &&
					data[i].province === null
				) {
					api_url += `${data[i].country}?lastdays=all`;
				} else if (
					countryName === "China" ||
					countryName === "Canada" ||
					countryName === "Australia" ||
					countryName === "Diamond Princess"
				) {
					api_url += `${countryName}?lastdays=all`;
					break;
				}
			}
		});

	// Fetching data formatted url above
	await fetch(api_url)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			const cases = Object.entries(data.timeline.cases);
			const deaths = Object.entries(data.timeline.deaths);
			const recovered = Object.entries(data.timeline.recovered);
			pushTime(cases, timelineArr);
			pushData(cases, confirmedArr);
			pushData(deaths, deathArr);
			pushData(recovered, recoveredArr);
		});
};

// -----------------------------------------------------------------------------
// Render graph plotting
async function plotData() {
	try {
		await getData();

		var ctx = document.getElementById("myChart1").getContext("2d");
		var myChart = new Chart(ctx, {
			type: "line",
			data: {
				labels: timelineArr,
				datasets: [
					{
						label: `Cases`,
						data: confirmedArr,
						backgroundColor: "rgba(255, 255, 255,0.2)",
						borderColor: "#17a2b8",
						borderWidth: 2,
					},
					{
						label: `Deaths`,
						data: deathArr,
						backgroundColor: "rgba(255, 255, 255,0.2)",
						borderColor: "#dc3545",
						borderWidth: 2,
					},
					{
						label: `Recovered`,
						data: recoveredArr,
						backgroundColor: "rgba(255, 255, 255,0.2)",
						borderColor: "#28a745",
						borderWidth: 2,
					},
				],
			},
			options: {
				scales: {
					xAxes: [
						{
							// type: "time",
							// distribution: "linear",
							ticks: {
								display: true,
								autoSkip: true,
								maxTicksLimit: 10,
							},
						},
					],
				},
				elements: {
					point: {
						radius: 0,
					},
				},
			},
		});
	} catch (err) {
		// Message for users once data could not be matched or no hisotrical data
		document
			.querySelector(".graph-country")
			.insertAdjacentHTML(
				"afterend",
				'<h2 class="graph-error">Cannot get historical data</h2>'
			);
	}

	// Removing loader once the data is fecth
	loader.style.display = "none";
}

// Running function and plot data
// Graph data will load once the 'getData()' function has successfully fetch data
plotData();

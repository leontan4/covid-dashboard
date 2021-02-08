const countryName = document
	.querySelectorAll(".dashboard")[0]
	.innerText.slice(12);

let api_url = `https://disease.sh/v3/covid-19/historical/`;
let hopkins_url = `https://disease.sh/v3/covid-19/jhucsse/`;

const timelineArr = [];
const confirmedArr = [];
const deathArr = [];
const recoveredArr = [];

// Adding commas to large numbers
numCommas = function (num) {
	if (num === null) {
		return 0;
	} else {
		num = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parseInt(num);
	}
};

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

function handleErrors(response) {
	if (!response.ok) {
		throw Error(response.statusText);
	}
	return response;
}

const getData = async function () {
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
						.replace(/[\u0300-\u036f]/g, "")
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
						borderWidth: 1,
						fill: false,
					},
					{
						label: `Deaths`,
						data: deathArr,
						backgroundColor: "#dc3545",
						borderWidth: 1,
						fill: false,
					},
					{
						label: `Recovered`,
						data: recoveredArr,
						backgroundColor: "#28a745",
						borderWidth: 1,
						fill: false,
					},
				],
			},
		});
	} catch (err) {
		document
			.querySelector(".graph-country")
			.insertAdjacentHTML(
				"afterend",
				'<h2 class="graph-error">Cannot get historical data</h2>'
			);
	}
}

plotData();

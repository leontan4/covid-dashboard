const countryName = document
	.querySelectorAll(".dashboard")[0]
	.innerText.slice(12);

let api_url = `https://disease.sh/v3/covid-19/historical/`;

const timelineArr = [];
const confirmedArr = [];
const deathArr = [];
const recoveredArr = [];

const pushData = function (data, array) {
	data.forEach(function (newData) {
		array.push(newData[1]);
	});
};

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
			data.forEach(function (country) {
				if (
					country.province != null &&
					country.province === countryName.toLowerCase()
				) {
					const province = country.province.replace(/\s/g, "%20");
					api_url += `${country.country}/${province}?lastdays=all`;
				} else if (country.country === countryName) {
					api_url += `${country.country}?lastdays=all`;
				}
			});
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
				'<h2 class="graph-error">Country not found or do not have any historical data</h2>'
			);
	}
}

plotData();

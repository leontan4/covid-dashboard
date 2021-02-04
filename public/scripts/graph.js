const countryName = document
	.querySelectorAll(".dashboard")[0]
	.innerText.slice(12);

const api_url = `https://disease.sh/v3/covid-19/historical/${countryName}?lastdays=all`;

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

const getData = async function () {
	await fetch(api_url)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			const cases = Object.entries(data.timeline.cases);
			const deaths = Object.entries(data.timeline.deaths);
			const recovered = Object.entries(data.timeline.recovered);
			pushData(cases, timelineArr);
			pushData(cases, confirmedArr);
			pushData(deaths, deathArr);
			pushData(recovered, recoveredArr);
		});
};

async function plotData() {
	await getData();
	var ctx = document.getElementById("myChart").getContext("2d");
	var myChart = new Chart(ctx, {
		type: "line",
		data: {
			labels: timelineArr,
			datasets: [
				{
					label: `# of confirmed`,
					data: confirmedArr,
					borderWidth: 1,
				},

				{
					label: `# of death`,
					data: deathArr,
					borderWidth: 1,
				},

				{
					label: `# of recovered`,
					data: recoveredArr,
					borderWidth: 1,
				},
			],
		},
	});
}

plotData();

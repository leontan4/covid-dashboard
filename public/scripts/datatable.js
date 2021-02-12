$(document).ready(function () {
	$(".dataTable").DataTable({
		pageLength: 25,
		lengthMenu: [10, 25, 50, 75, 100],
		order: [[1, "desc"]],
		responsive: true,
	});
});

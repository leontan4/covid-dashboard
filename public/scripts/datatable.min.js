$(document).ready(function () {
	$("#dataTable").DataTable({
		pageLength: 25,
		lengthMenu: [10, 25, 50, 75, 100],
		order: [[1, "desc"]],
		sScrollX: "100%",
		scrollCollapse: true,
		responsive: true,
		fixedColumns: {
			leftColumns: 1,
			heightMatch: "semiauto",
		},
	});
});

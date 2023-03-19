
const city = document.getElementById("city");
const search = document.getElementById("input");


document.getElementById("set").addEventListener("submit", () => {
	chrome.runtime.sendMessage({ data: search.value });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(request.data);
	city.textContent = request.data;
});

document.addEventListener("DOMContentLoaded", function(event) {
	chrome.storage.local.get(["currentCity"], function(result) {
		console.log(result.currentCity);
		if (typeof result.currentCity === 'string') city.textContent = 'Your city: ' + result.currentCity;
	});
});
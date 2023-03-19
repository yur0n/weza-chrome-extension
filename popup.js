
const city = document.getElementById("city");
const search = document.getElementById("input");

document.getElementById("set").addEventListener("submit", () => {
	console.log('event')
	chrome.runtime.sendMessage({ data: search.value });
	console.log(chrome.runtime.lastError)
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(request.data);
	if (request.data.error) return city.textContent = request.data.error;
	city.textContent = 'Your city: ' + request.data.city;
});

document.addEventListener("DOMContentLoaded", function(event) {
	chrome.storage.local.get(["currentCity"], function(result) {
		console.log(result.currentCity);
		if (typeof result.currentCity === 'string') city.textContent = 'Your city: ' + result.currentCity;
	});
});

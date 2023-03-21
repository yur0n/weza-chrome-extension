
const city = document.getElementById("city");
const search = document.getElementById("input");

document.getElementById("set").addEventListener("submit", () => {
	if (search.value.length < 1) return;
	chrome.runtime.sendMessage({ data: search.value });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.data.error) return city.textContent = request.data.error;
	city.textContent = 'Your city: ' + request.data.city;
});

document.addEventListener("DOMContentLoaded", () => {
	chrome.storage.local.get(["currentCity"], (result) => {
		if (typeof result.currentCity === 'string') city.textContent = 'Your city: ' + result.currentCity;
	});
});

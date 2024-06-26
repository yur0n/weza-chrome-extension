
const setCity = document.getElementById('city');
const search = document.getElementById('input');
const setForm = document.getElementById('set')
const bodyBackground = document.body

setForm.addEventListener('submit', async () => {
	if (search.value.length < 1) return;
	await chrome.storage.local.set({ currentCity: search.value });
	chrome.runtime.sendMessage({ data: search.value });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.data.error) return setCity.textContent = request.data.error;
	checkState()
});

document.addEventListener('DOMContentLoaded', checkState);

async function checkState() {
	console.log('checkdom')
	let result = await chrome.storage.local.get(['currentCity']);
	setCity.textContent = 'Your city: ' + result.currentCity;
	checkMain()
}

function checkMain() {
	chrome.storage.local.get(['main'], (result) => {
		switch (result.main) {
			case 'Clear':
				bodyBackground.style.backgroundImage = 'url(images/sunny.png)';
				break;
			case 'Clouds':
				bodyBackground.style.backgroundImage = 'url(images/cloudy.png)';
				break;
			case 'Rain':
				bodyBackground.style.backgroundImage = 'url(images/rainy.png)';
				break;
			case 'Snow':
				bodyBackground.style.backgroundImage = 'url(images/snowy.png)';
				break;
			case 'Thunderstorm':
				bodyBackground.style.backgroundImage = 'url(images/stormy.png)';
				break;	
			case 'Drizzle':
				bodyBackground.style.backgroundImage = 'url(images/windy.png)';	
				break;
			default:
				bodyBackground.style.backgroundImage = 'url(images/sunny.png)';
		}
	});
}

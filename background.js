
chrome.runtime.onStartup.addListener(() => {
	const cityCheck = chrome.storage.local.get(['currentCity']);
	if (cityCheck) {
		setWeather(cityCheck.currentCity);
		createAlarm();
	}
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
	let result = await setWeather(request.data);
	chrome.runtime.sendMessage({ data: result });
	createAlarm();
});

function createAlarm() {
	chrome.alarms.create(
		'weatherUpdate',
		{periodInMinutes: 60}
	);
}

chrome.alarms.onAlarm.addListener(() => {
	const cityCheck = chrome.storage.local.get(['currentCity']);
	setWeather(cityCheck.currentCity);
})


async function setWeather(address) {
	const data = await getWeather(address);
	if (data.error) {
		chrome.action.setBadgeText({ text: 'X' });
	} else {
		chrome.action.setBadgeText({ text: Math.round(data.temp) + '°C' });
		chrome.storage.local.set({ currentCity: data.city });
	}
	return data;
}

function getWeather(address) {
	return fetch(`http://34.238.67.183/weather?address=${address}`)
	.then(res => res.json())
	.then(res => {
    	if (res.error) return { error: res.error };
		return { 
			temp: res.temp,
			city: res.location
		 };
    })
	.catch((e) => {
		console.log(e)
		return { error: 'Unable to connect to server' };
	});
}



// Older version without my server api

// chrome.runtime.onStartup.addListener(async () => {
// 	const cityCheck = await chrome.storage.local.get(['currentCity'])
// 	if (cityCheck) setWeather(cityCheck.currentCity)
// });

// chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
// 	let result = await setWeather(request.data)
// 	chrome.runtime.sendMessage({ data: result })
// });

// function createAlarm() {
// 	chrome.alarms.create(
// 		'weatherUpdate',
// 		{periodInMinutes: 60}
// 	);
// }

// chrome.alarms.onAlarm.addListener(() => {
// 	weatherUpdate(coords);
// })

// async function setWeather(city) {
// 	coords = await getCoords(city);
// 	if (coords.error) return coords.error;
// 	chrome.storage.local.set({ currentCity: coords.name, lat: coords.lat, lon: coords.lon });

// 	weatherUpdate(coords);
// 	createAlarm();

// 	return `Your city: ${coords.name}`;
// }

// async function weatherUpdate(coords) {
// 	console.log('called')
// 	const temp = await getWeather(coords.lat, coords.lon);
// 	if (temp.error) return chrome.action.setBadgeText({ text: 'X' });
// 	chrome.action.setBadgeText({ text: Math.round(temp.temp) + '°C' });
// }


// async function setWeather(city) {
// 	coords = await getCoords(city);
// 	if (coords.error) return coords.error;
// 	chrome.storage.local.set({ currentCity: coords.name, lat: coords.lat, lon: coords.lon });

// 	weatherUpdate(coords);
// 	createAlarm();

// 	return `Your city: ${coords.name}`;
// }

// function getCoords(address) {
// 	return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${address}&limit=1&appid=${API_KEY}`) //provide api key
// 	.then(res => res.json())
// 	.then(res => { 
//     	if (!res.length) return { error: 'Unable to find location' };
// 		return {
// 			lat: res[0].lat,
// 			lon: res[0].lon,
// 			name: res[0].name,
// 		}
//     })
// 	.catch((e) => {
// 		console.log(e)
// 		return { error: 'Unable to connect to location services' };
// 	});
// }

// function getWeather(lat, lon) {
// 	return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`) //provide api key
// 	.then(res => res.json())
// 	.then(res => {
// 		if (res.cod) {
// 			console.log(res.cod);
// 			return { error: 'Unable to find location' }
// 		}
// 		return { temp: res.current.temp };
// 	})
// 	.catch((e) => {
// 		console.log(e);
// 		return { error: 'Unable to connect to weather services' }
// 	});
// }





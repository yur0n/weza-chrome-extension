chrome.runtime.onInstalled.addListener(async ({ reason }) => {
	if (reason !== 'install') {
	  return;
	}

	await chrome.alarms.create('alarm', {
	  periodInMinutes: 0.2
	});
});

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
	const cityCheck = chrome.storage.local.get(['currentCity']);
	let result = setWeather(cityCheck.currentCity || 'New York');
	chrome.runtime.sendMessage({ data: result })
	await chrome.alarms.create('alarm', {
	  periodInMinutes: 0.2
	});
})

chrome.alarms.onAlarm.addListener(() => {
	console.log('check weatehr')
	const cityCheck = chrome.storage.local.get(['currentCity']);
	setWeather(cityCheck.currentCity || 'New York');
})


async function setWeather(address) {
	const data = await getWeather(address);
	if (data.error) {
		chrome.action.setBadgeText({ text: 'X' });
		chrome.storage.local.set({ currentCity: data.error });
	} else {
		const iconLink = `https://openweathermap.org/img/wn/${data.icon}.png`;
		chrome.storage.local.set({ currentCity: data.city });
		chrome.storage.local.set({ main: data.main });
		chrome.action.setBadgeText({ text: Math.round(data.temp) + '°C' });
		chrome.action.setIcon({ path: iconLink });
	}
	return data;
}

function getWeather(address) {
	return fetch(`https://yuron.xyz/api/weather?address=${address}`)
	.then(res => res.json())
	.then(res => {
		if (res.error) return { error: res.error };
		return { 
			temp: res.temp,
			city: res.location,
			icon: res.icon,
			main: res.main
		};
	})
	.catch((e) => {
		console.log(e)
		return { error: 'Unable to connect to server' };
	});
}




fetch(chrome.runtime.getURL('config.json'))
    .then(response => response.json())
    .then(config => {
	if (config.MOODLE_SESSION) {
		chrome.storage.local.set({ moodleSession: config.MOODLE_SESSION });
	}
});

function setMoodleSessionCookie(cookieValue) {
    chrome.cookies.set({
        url: "https://klms.kaist.ac.kr",
        name: "MoodleSession",
        value: cookieValue,
        path: "/",
        httpOnly: true,
        secure: true
    }, (cookie) => {
        if (chrome.runtime.lastError) {
            console.error("Error setting cookie:", chrome.runtime.lastError.message);
        } else {
            console.log("MoodleSession cookie set successfully:", cookie);
        }
    });
}

chrome.webNavigation.onCompleted.addListener((details) => {
	chrome.storage.local.get(['moodleSession'], (data) => {
		if (data.moodleSession) {
			setMoodleSessionCookie(data.moodleSession);
		}
	});
}, { url: [{ hostEquals: 'klms.kaist.ac.kr' }] });

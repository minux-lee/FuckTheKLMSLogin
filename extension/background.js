/* ❶ 설정값 로드 */
async function loadSessionValue() {
  try {
    const res = await fetch(chrome.runtime.getURL("config.json"));
    const cfg  = await res.json();
    if (cfg.MOODLE_SESSION) {
      await chrome.storage.local.set({ moodleSession: cfg.MOODLE_SESSION });
      return cfg.MOODLE_SESSION;
    }
  } catch (e) {
    console.error("config.json load error:", e);
  }
  return null;
}

function setMoodleSessionCookie(value) {
  chrome.cookies.set(
    {
      url:    "https://klms.kaist.ac.kr/",
      name:   "MoodleSession",
      value,                              // ← 실제 세션
      domain: "klms.kaist.ac.kr",
      path:   "/",
      secure: true,
      sameSite: "no_restriction"
    },
    c => {
      if (chrome.runtime.lastError) {
        console.error("Cookie-set error:", chrome.runtime.lastError.message);
      } else {
        console.log("Cookie written:", c);
      }
    }
  );
}

/* ❷ 설치 직후 + Safari 재시동 직후 */
async function init() {
  const { moodleSession } = await chrome.storage.local.get("moodleSession");
  if (moodleSession) setMoodleSessionCookie(moodleSession);
  else {
    const v = await loadSessionValue();
    if (v) setMoodleSessionCookie(v);
  }
}
chrome.runtime.onInstalled.addListener(init);
chrome.runtime.onStartup.addListener(init);   // ← Safari 재실행 대비

/* ❸ 탭 갱신 시마다 */
chrome.tabs.onUpdated.addListener((id, info, tab) => {
  if (!tab.url?.startsWith("https://klms.kaist.ac.kr")) return;
  if (info.status !== "loading" && info.status !== "complete") return;

  chrome.storage.local.get("moodleSession", ({ moodleSession }) => {
    if (moodleSession) setMoodleSessionCookie(moodleSession);
  });
});

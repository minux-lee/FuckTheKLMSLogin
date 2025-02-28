import { CookieJar, Cookie } from 'tough-cookie';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const MOODLE_SESSION = process.env.MOODLE_SESSION;
const BASE_URL = "https://klms.kaist.ac.kr";

const cookieJar = new CookieJar();
cookieJar.setCookieSync(Cookie.parse(`MoodleSession=${MOODLE_SESSION}`)!, BASE_URL);

import { wrapper } from 'axios-cookiejar-support';

const axiosInstance = wrapper(axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    jar: cookieJar,
}));

const sendRequest = async () => {
	console.log(`[${new Date().toISOString()}] Sending Request`);
	try {
		const response = await axiosInstance.get('/');
		if (response.status === 200) {
			console.log(`[${new Date().toISOString()}] Request Success`);
		} else {
			console.log(`[${new Date().toISOString()}] Request Failed`);
		}
	} catch (error) {
		console.log(`[${new Date().toISOString()}] Request Failed`);
	}
}

import { scheduleJob } from 'node-schedule';

sendRequest();

scheduleJob('0 * * * *', sendRequest);


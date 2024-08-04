import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "$env/static/private";
import {
	getGithubUserDetails,
	getGithubUserRepos,
	getGithubUserReadme,
} from "$lib";

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const username = formData.get("username") as string;
		const lang = formData.get("lang") as string;

		if (!username || !lang) {
			return {
				success: false,
				error: "Please provide a username and language.",
				text: null,
			};
		}

		try {
			const googleGenerativeAI = new GoogleGenerativeAI(GEMINI_API_KEY);
			const model = googleGenerativeAI.getGenerativeModel({
				model: "gemini-1.5-flash",
				systemInstruction:
					"Give a casual compliment for the following github account and not using any harsh word and keep it short.",
			});

			let prompt = `Praise ${username} for their github account. You can mention their name, bio, followers, following, repos, and readme. Keep it short.`;

			switch (lang) {
				case "en":
					prompt += " You can write in English.";
					break;
				case "id":
					prompt += " You can write in Indonesian.";
					break;
			}

			const userDetails = await getGithubUserDetails(username);
			const userRepos = await getGithubUserRepos(username);
			const userReadme = await getGithubUserReadme(username);

			const data = {
				...userDetails,
				repos: userRepos,
				readme: userReadme,
			};

			prompt += JSON.stringify(data);

			const result = await model.generateContent(prompt);
			const response = result.response;
			const text = response.text();

			return {
				success: true,
				text,
			};
		} catch (error) {
			return {
				success: false,
				error:
					"An error occurred while generating the content. Please try again later.",
				text: null,
			};
		}
	},
};

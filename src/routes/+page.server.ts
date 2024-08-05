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
					"You assess a GitHub account based on their bio, name, followers, following, README, and repositories in a casual manner, avoiding harsh language, and keeping it concise.",
			});

			let prompt = `${username} has a great Github profile! Praise their github profile and mention their name, bio, followers, following, repos, and readme.`;

			switch (lang) {
				case "en":
					prompt += " You can write in English.";
					break;
				case "id":
					prompt += " You can write in Indonesian.";
					break;
			}

			// const userDetails = await getGithubUserDetails(username);
			// const userRepos = await getGithubUserRepos(username);
			// const userReadme = await getGithubUserReadme(username);

			const [userDetails, userRepos, userReadme] = await Promise.all([
				getGithubUserDetails(username),
				getGithubUserRepos(username),
				getGithubUserReadme(username),
			]);

			const data = {
				...userDetails,
				repos: userRepos,
				readme: userReadme,
			};

			prompt += `Here the their github profile
			Name: ${data.name}
			Bio: ${data.bio}
			Followers: ${data.followers}
			Following: ${data.following}
			Repositories:
			${data.repos}
			Readme:
			${data.readme}`;

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

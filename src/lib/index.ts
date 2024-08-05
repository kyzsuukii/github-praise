import axios, { type AxiosResponse } from "axios";

interface GithubUserDetailsProps {
	name: string;
	bio: string;
	followers: number;
	following: number;
}

interface GithubUserReposProps {
	name: string;
	description: string;
}

async function getGithubUserDetails(username: string): Promise<GithubUserDetailsProps | null> {
	const { data, status } = (await axios.get(
		`https://api.github.com/users/${username}`,
	)) as AxiosResponse<GithubUserDetailsProps>;

	if (status === 200) {
		const { name, bio, followers, following } = data;
		return { name, bio, followers, following };
	}

	return null;
}

async function getGithubUserRepos(username: string): Promise<GithubUserReposProps[] | null> {
	const { data, status } = (await axios.get(
		`https://api.github.com/users/${username}/repos`,
	)) as AxiosResponse<GithubUserReposProps[]>;

	if (status === 200) {
		data.map(({ name, description }) => {
			return { name, description };
		});

		return data;
	}
	return null;
}

async function getGithubUserReadme(username: string): Promise<string | null> {
	const readmes = await Promise.allSettled([
		axios.get(`https://raw.githubusercontent.com/${username}/${username}/main/README.md`),
		axios.get(`https://raw.githubusercontent.com/${username}/${username}/master/README.md`),
	])

	for (const readme of readmes) {
		if (readme.status === "fulfilled" && readme.value.status === 200) {
			return readme.value.data;
		}
	}



	return null;
}

export { getGithubUserDetails, getGithubUserRepos, getGithubUserReadme };

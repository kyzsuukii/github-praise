import axios from "axios";

interface getGithubUserDetailsProps {
	name: string;
	bio: string;
	followers: number;
	following: number;
}

interface getGithubUserReposProps {
	name: string;
	description: string;
}

async function getGithubUserDetails(username: string): Promise<getGithubUserDetailsProps> {
	const { data } = (await axios.get(
		`https://api.github.com/users/${username}`,
	)) as { data: getGithubUserDetailsProps };

	const { name, bio, followers, following } = data;

	return {
		name,
		bio,
		followers,
		following,
	};
}

async function getGithubUserRepos(username: string): Promise<getGithubUserReposProps[]> {
	const { data } = (await axios.get(
		`https://api.github.com/users/${username}/repos`,
	)) as { data: getGithubUserReposProps[] };

	data.map(({ name, description }) => {
		return { name, description };
	});

	return data;
}

async function getGithubUserReadme(username: string): Promise<string> {
	const { data } = await axios.get(`https://raw.githubusercontent.com/${username}/${username}/master/README.md`);

	return data;
}

export { getGithubUserDetails, getGithubUserRepos, getGithubUserReadme };

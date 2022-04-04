export const getContent = (file:string) => {
	const filepath = require("../Pages/DefaultContent.md");

	return fetch(filepath).then(response => response.json());
}
import React from 'react';
import * as Fluent from '@fluentui/react';
import * as Hooks from '@fluentui/react-hooks';

export const Blogs: React.FunctionComponent = () => {

	const [posts, setPosts] = React.useState({ items: [] });
	const [error, setError] = React.useState(null);
	const bloggerAPIKey = process.env.REACT_APP_GOOGLEAPI_KEY;
	const bloggerID = process.env.REACT_APP_MAINBLOGID;

	/*
	fetch(`https://www.googleapis.com/blogger/v3/blogs/${bloggerID}/posts?key=${bloggerAPIKey}`)
	.then(response => response.json()).then(data => setPosts(data), error => setError(error));
	*/
	React.useEffect(() => {
		fetch(`https://www.googleapis.com/blogger/v3/blogs/${bloggerID}/posts?key=${bloggerAPIKey}`).then(response => response.json()).then(data => {
			setPosts(data);
			console.log(data);
		});
	}, []);

	return (
		<React.Fragment>
			<h1>Blogs</h1>
			<div>
				{
					posts && posts.items && posts.items.map((item: any, index: number) => (
						<React.Fragment>
							<h2 key={item.id}>{item.title}</h2>
							<div>Written by {item.author.displayName} on {(new Date(item.published)).toDateString()}</div>
							<Fluent.Text>
								<span dangerouslySetInnerHTML={{__html: item.content}}></span>
							</Fluent.Text>
						</React.Fragment>
					))
				}
			</div>
		</React.Fragment>
	);
};

export default Blogs;
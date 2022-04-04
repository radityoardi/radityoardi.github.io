import React, { CSSProperties } from 'react';
import * as Fluent from '@fluentui/react';
import * as Hooks from '@fluentui/react-hooks';
import * as Utility from '../utils/Utility';
import { marked } from 'marked';

const textStyle:CSSProperties = {
	fontWeight: 'bolder',
	fontSize: '18px',
	letterSpacing: '2px',
	lineHeight: 1.3
};
const myPhoto: CSSProperties = {
	float: 'right',
	height: '100px'
};

export const Default:React.FunctionComponent = () => {

	return (
		<React.Fragment>
			<img src='ToonRadityoCircle.png' style={myPhoto} />
			<h1>Hello, World!</h1>
			<p style={textStyle}>
				This is not your typical default "Hello, World!" application.
			</p>
			<p style={textStyle}>
				I'm Radityo. I'm a technical consultant focusing on the application development world, currently living in the bustling city of Singapore, the city that never sleeps (literally).
				I've been getting my hands dirty on mostly Microsoft technology such as C#, SharePoint (not long after it was born), PowerShell hardcore, and now toying with Office 365, Power Apps &amp; Automate, and lastly sharpening my skills on TypeScript and React.
				<br/>
				Though Machine Learning and AI are not really my main skills, but I'm leaning towards that.
			</p>
			<p style={textStyle}>
				In my free time, I love to cook (though I know I'm a terrible chef), love to "fish" sunbirds and yellow-vented bulbul to come to my corridor in a bid to grab their pics, and of course...eat.
			</p>
			<p style={textStyle}>
			This site got some tools I've written (click that top-right icon), it might be worth sharing. I used to <Fluent.Link href="https://otak-otak-it.blogspot.com">blog</Fluent.Link> but I'm falling away from it.
			</p>
		</React.Fragment>
	);
};

export default Default;
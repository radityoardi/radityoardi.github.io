/// <reference types="react-scripts" />

declare module "*.md" {
	const content: any;
	export default content;
}

declare module "editorjs-parser"
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";
import { uploadAsBase64, uploadByURL } from "../ImgBBPlugin";
import { sanitizeHtml } from "./editorjs-stringutils";
import HLJSCodeTool from "./editorjs-code";

export const Blocks = {
  embed: Embed,
  table: Table,
  list: List,
  code: {
    class: HLJSCodeTool,
    config: {
      placeholder: 'write or paste your code'
    },
  },
  linkTool: LinkTool,
  raw: Raw,
  header: Header,
  inlineCode: InlineCode,
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByFile: uploadAsBase64,
        uploadByUrl: uploadByURL
      }
    }
  },
  quote: Quote,
  //simpleImage: SimpleImage
};

export const customEdjsParsers = {
  code: (data, config) => {
      const markup = sanitizeHtml(data.code);
      return `<pre language="${data.language}"><code class="${data.language}">${markup}</code></pre>`;
  },
}


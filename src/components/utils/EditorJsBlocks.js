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
import { uploadAsBase64 } from "./GDriveImages";

export const Blocks = {
  embed: Embed,
  table: Table,
  list: List,
  code: Code,
  linkTool: LinkTool,
  raw: Raw,
  header: Header,
  inlineCode: InlineCode,
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByFile: uploadAsBase64
      }
    }
  },
  quote: Quote,
  simpleImage: SimpleImage
};

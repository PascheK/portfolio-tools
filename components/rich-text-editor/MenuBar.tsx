import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImagePlus,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  TextQuote,
  Underline,
  Undo,
} from "lucide-react";
import { Toggle } from "../ui/toggle";
import { Editor } from "@tiptap/react";
import { uploadImage } from "@/services/upload"
import { useState } from "react";
import PromptModal from "../modals/PromptModal";


export default function MenuBar({ editor }: { editor: Editor | null }) {
  const [isPromptOpen, setPromptOpen] = useState(false);
const [tempUrl, setTempUrl] = useState<string | null>(null);

  if (!editor) {
    return null;
  }

const Options = [
  // Headings
  {
    icon: <Heading1 className="size-4" />,
    onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    preesed: editor.isActive("heading", { level: 1 }),
  },
  {
    icon: <Heading2 className="size-4" />,
    onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    preesed: editor.isActive("heading", { level: 2 }),
  },
  {
    icon: <Heading3 className="size-4" />,
    onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    preesed: editor.isActive("heading", { level: 3 }),
  },

  // Text styles
  {
    icon: <Bold className="size-4" />,
    onClick: () => editor.chain().focus().toggleBold().run(),
    preesed: editor.isActive("bold"),
  },
  {
    icon: <Italic className="size-4" />,
    onClick: () => editor.chain().focus().toggleItalic().run(),
    preesed: editor.isActive("italic"),
  },
  {
    icon: <Underline className="size-4" />,
    onClick: () => editor.chain().focus().toggleUnderline().run(),
    preesed: editor.isActive("underline"),
  },
  {
    icon: <Strikethrough className="size-4" />,
    onClick: () => editor.chain().focus().toggleStrike().run(),
    preesed: editor.isActive("strike"),
  },
  {
    icon: <Highlighter className="size-4" />,
    onClick: () => editor.chain().focus().toggleHighlight().run(),
    preesed: editor.isActive("highlight"),
  },

  // Text alignment
  {
    icon: <AlignLeft className="size-4" />,
    onClick: () => editor.chain().focus().setTextAlign("left").run(),
    preesed: editor.isActive({ textAlign: "left" }),
  },
  {
    icon: <AlignCenter className="size-4" />,
    onClick: () => editor.chain().focus().setTextAlign("center").run(),
    preesed: editor.isActive({ textAlign: "center" }),
  },
  {
    icon: <AlignRight className="size-4" />,
    onClick: () => editor.chain().focus().setTextAlign("right").run(),
    preesed: editor.isActive({ textAlign: "right" }),
  },

  // Lists
  {
    icon: <List className="size-4" />,
    onClick: () => editor.chain().focus().toggleBulletList().run(),
    preesed: editor.isActive("bulletList"),
  },
  {
    icon: <ListOrdered className="size-4" />,
    onClick: () => editor.chain().focus().toggleOrderedList().run(),
    preesed: editor.isActive("orderedList"),
  },

  // Blocks & code
  {
    icon: <TextQuote className="size-4" />,
    onClick: () => editor.chain().focus().toggleBlockquote().run(),
    preesed: editor.isActive("blockquote"),
  },
  {
    icon: <Code className="size-4" />,
    onClick: () => editor.chain().focus().toggleCodeBlock().run(),
    preesed: editor.isActive("codeBlock"),
  },

  // Utility actions
  {
    icon: <Undo className="size-4" />,
    onClick: () => editor.chain().focus().undo().run(),
    preesed: false,
  },
  {
    icon: <Redo className="size-4" />,
    onClick: () => editor.chain().focus().redo().run(),
    preesed: false,
  },
  {
    icon: <Eraser className="size-4" />,
    onClick: () => editor.chain().focus().unsetAllMarks().clearNodes().run(),
    preesed: false,
  },
  {
    icon: <LinkIcon className="size-4" />,
    onClick: () => setPromptOpen(true),
    pressed: editor.isActive("link"),
  },

  // Custom image uploader
  {
    icon: <ImagePlus className="size-4" />,
    onClick: async () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        const path = `editor/${Date.now()}-${file.name}`;
        const url = await uploadImage(file, path);
        editor.chain().focus().setImage({ src: url }).run();
      };
    },
    preesed: false,
  },
];


  return (
    <div className="border rounded-md p-1 mb-1 border-border dark:border-dark-border bg-background dark:bg-dark-surface space-x-2 z-50 h-">
      {Options.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.preesed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
      <PromptModal
  isOpen={isPromptOpen}
  title="Insert link"
  placeholder="https://example.com"
  onCancel={() => setPromptOpen(false)}
  onConfirm={(url) => {
    if (url) {
      editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
    setPromptOpen(false);
  }}
/>
    </div>
    
  );
}
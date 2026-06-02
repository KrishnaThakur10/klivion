"use client"

import { useEditor, EditorContent, useEditorState } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Highlight from "@tiptap/extension-highlight"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import CharacterCount from "@tiptap/extension-character-count"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import { useState, useCallback } from "react"
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Highlighter, Link as LinkIcon, Link2Off, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Undo, Redo, Code, Quote, Minus, ListTodo,
  Subscript as SubIcon, Superscript as SupIcon,
  ChevronDown, Type, Pilcrow,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Toggle } from "@/components/ui/toggle"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"

// ── Types ──────────────────────────────────────────
interface TiptapProps {
  content?: string
  onChange?: (html: string) => void
  placeholder?: string
  minHeight?: string
}

// ── Tooltip Button ─────────────────────────────────
function TBtn({
  tooltip,
  onClick,
  active,
  disabled,
  children,
}: {
  tooltip: string
  onClick: () => void
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            onClick()
          }}
          disabled={disabled}
          className={cn(
            "h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors text-sm",
            active
              ? "bg-primary/15 text-primary border border-primary/20"
              : "hover:bg-accent text-foreground",
            disabled && "opacity-40 cursor-not-allowed"
          )}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">{tooltip}</TooltipContent>
    </Tooltip>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-border shrink-0 mx-0.5" />
}

// ── Heading Dropdown ───────────────────────────────
function HeadingDropdown({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const [open, setOpen] = useState(false)
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isP:  ctx.editor?.isActive("paragraph"),
      isH1: ctx.editor?.isActive("heading", { level: 1 }),
      isH2: ctx.editor?.isActive("heading", { level: 2 }),
      isH3: ctx.editor?.isActive("heading", { level: 3 }),
      isH4: ctx.editor?.isActive("heading", { level: 4 }),
    }),
  })

  const currentLabel = editorState?.isH1 ? "Heading 1"
    : editorState?.isH2 ? "Heading 2"
    : editorState?.isH3 ? "Heading 3"
    : editorState?.isH4 ? "Heading 4"
    : "Paragraph"

  const options = [
    { label: "Paragraph", icon: <Pilcrow className="w-3.5 h-3.5" />, action: () => editor?.chain().focus().setParagraph().run(), active: editorState?.isP, className: "text-sm" },
    { label: "Heading 1", icon: <Type className="w-4 h-4" />, action: () => editor?.chain().focus().setHeading({ level: 1 }).run(), active: editorState?.isH1, className: "text-xl font-bold" },
    { label: "Heading 2", icon: <Type className="w-3.5 h-3.5" />, action: () => editor?.chain().focus().setHeading({ level: 2 }).run(), active: editorState?.isH2, className: "text-lg font-bold" },
    { label: "Heading 3", icon: <Type className="w-3 h-3" />, action: () => editor?.chain().focus().setHeading({ level: 3 }).run(), active: editorState?.isH3, className: "text-base font-semibold" },
    { label: "Heading 4", icon: <Type className="w-2.5 h-2.5" />, action: () => editor?.chain().focus().setHeading({ level: 4 }).run(), active: editorState?.isH4, className: "text-sm font-semibold" },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 h-8 px-2.5 rounded-md text-sm font-medium hover:bg-accent transition-colors border border-border min-w-[110px]">
          <span className="flex-1 text-left truncate">{currentLabel}</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-1" align="start">
        {options.map((opt) => (
          <button
            key={opt.label}
            onMouseDown={(e) => { e.preventDefault(); opt.action(); setOpen(false) }}
            className={cn(
              "w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent transition-colors text-left",
              opt.active && "bg-primary/10 text-primary",
              opt.className
            )}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

// ── Color Picker ───────────────────────────────────

// ── Link Dialog ────────────────────────────────────
function LinkButton({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const [linkUrl, setLinkUrl] = useState("")
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false)

  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor?.isActive("link"),
  })

  const handleSetLink = () => {
    if (linkUrl) {
      const href = linkUrl.startsWith("http://") || linkUrl.startsWith("https://")
        ? linkUrl
        : `https://${linkUrl}`
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href })
        .run()
    } else {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run()
    }
    setIsLinkPopoverOpen(false)
    setLinkUrl("")
  }

  // Show unlink button when cursor is on a link
  if (isActive) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            pressed
            onPressedChange={() =>
              editor?.chain().focus().extendMarkRange("link").unsetLink().run()
            }
            className="h-8 w-8 p-0 rounded-md bg-primary/15 text-primary border border-primary/20"
          >
            <Link2Off className="w-4 h-4" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">Remove Link</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
      <PopoverTrigger asChild>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={false}
                onPressedChange={() => setIsLinkPopoverOpen(true)}
                className="h-8 w-8 p-0 rounded-md"
              >
                <LinkIcon className="w-4 h-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">Insert Link</TooltipContent>
          </Tooltip>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="flex flex-col gap-4">
          <h3 className="font-medium">Insert Link</h3>
          <input
            placeholder="https://example.com"
            type="url"
            value={linkUrl}
            autoFocus
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleSetLink()
              }
            }}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex justify-between gap-2">
            <button
              onClick={() => { setIsLinkPopoverOpen(false); setLinkUrl("") }}
              className="flex-1 border border-border rounded-lg py-2 text-sm hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); handleSetLink() }}
              className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ── Main Toolbar ───────────────────────────────────
function Toolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const s = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold:        ctx.editor?.isActive("bold"),
      isItalic:      ctx.editor?.isActive("italic"),
      isUnderline:   ctx.editor?.isActive("underline"),
      isStrike:      ctx.editor?.isActive("strike"),
      isHighlight:   ctx.editor?.isActive("highlight"),
      isCode:        ctx.editor?.isActive("code"),
      isCodeBlock:   ctx.editor?.isActive("codeBlock"),
      isBlockquote:  ctx.editor?.isActive("blockquote"),
      isBulletList:  ctx.editor?.isActive("bulletList"),
      isOrderedList: ctx.editor?.isActive("orderedList"),
      isTaskList:    ctx.editor?.isActive("taskList"),
      isAlignLeft:   ctx.editor?.isActive({ textAlign: "left" }),
      isAlignCenter: ctx.editor?.isActive({ textAlign: "center" }),
      isAlignRight:  ctx.editor?.isActive({ textAlign: "right" }),
      isAlignJustify:ctx.editor?.isActive({ textAlign: "justify" }),
      isSub:         ctx.editor?.isActive("subscript"),
      isSup:         ctx.editor?.isActive("superscript"),
      canUndo:       ctx.editor?.can().undo(),
      canRedo:       ctx.editor?.can().redo(),
    }),
  })

  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/20 sticky top-0 z-10">

      {/* Undo / Redo */}
      <TBtn tooltip="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()} disabled={!s?.canUndo}>
        <Undo className="w-4 h-4" />
      </TBtn>
      <TBtn tooltip="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()} disabled={!s?.canRedo}>
        <Redo className="w-4 h-4" />
      </TBtn>

      <Divider />

      {/* Heading Dropdown */}
      <HeadingDropdown editor={editor} />

      <Divider />

      {/* Text formatting */}
      <TBtn tooltip="Bold (Ctrl+B)" active={s?.isBold} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="w-4 h-4" />
      </TBtn>
      <TBtn tooltip="Italic (Ctrl+I)" active={s?.isItalic} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="w-4 h-4" />
      </TBtn>
      <TBtn tooltip="Underline (Ctrl+U)" active={s?.isUnderline} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon className="w-4 h-4" />
      </TBtn>
      <TBtn tooltip="Strikethrough" active={s?.isStrike} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="w-4 h-4" />
      </TBtn>
      <TBtn tooltip="Highlight" active={s?.isHighlight} onClick={() => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()}>
        <Highlighter className="w-4 h-4" />
      </TBtn>
      <TBtn tooltip="Inline Code" active={s?.isCode} onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code className="w-4 h-4" />
      </TBtn>


      {/* Lists */}
      <TBtn tooltip="Bullet List" active={s?.isBulletList} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="w-4 h-4" />
      </TBtn>
      <TBtn tooltip="Numbered List" active={s?.isOrderedList} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="w-4 h-4" />
      </TBtn>
      <TBtn tooltip="Task / Checklist" active={s?.isTaskList} onClick={() => editor.chain().focus().toggleTaskList().run()}>
        <ListTodo className="w-4 h-4" />
      </TBtn>

      <Divider />

      {/* Alignment */}
      <TBtn tooltip="Align Left" active={s?.isAlignLeft} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        <AlignLeft className="w-4 h-4" />
      </TBtn>
      <TBtn tooltip="Align Center" active={s?.isAlignCenter} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
        <AlignCenter className="w-4 h-4" />
      </TBtn>
      <TBtn tooltip="Align Right" active={s?.isAlignRight} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
        <AlignRight className="w-4 h-4" />
      </TBtn>
      <TBtn tooltip="Justify" active={s?.isAlignJustify} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
        <AlignJustify className="w-4 h-4" />
      </TBtn>

      <Divider />

      {/* Extras */}
      <LinkButton editor={editor} />
      <TBtn tooltip="Blockquote" active={s?.isBlockquote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="w-4 h-4" />
      </TBtn>
      <TBtn tooltip="Code Block" active={s?.isCodeBlock} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <span className="text-xs font-mono font-bold">{"{}"}</span>
      </TBtn>
      <TBtn
        tooltip="Horizontal Rule"
        onClick={() => {
          editor.chain().focus().setHorizontalRule().run()
          editor.chain().focus().run()
        }}
      >
        <Minus className="w-4 h-4" />
      </TBtn>
      <TBtn tooltip="Subscript" active={s?.isSub} onClick={() => editor.chain().focus().toggleSubscript().run()}>
        <SubIcon className="w-4 h-4" />
      </TBtn>
      <TBtn tooltip="Superscript" active={s?.isSup} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
        <SupIcon className="w-4 h-4" />
      </TBtn>
    </div>
  )
}

// ── Bubble Menu (appears on text selection) ────────
function SelectionMenu({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const s = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold:      ctx.editor?.isActive("bold"),
      isItalic:    ctx.editor?.isActive("italic"),
      isUnderline: ctx.editor?.isActive("underline"),
      isStrike:    ctx.editor?.isActive("strike"),
      isHighlight: ctx.editor?.isActive("highlight"),
      isCode:      ctx.editor?.isActive("code"),
    }),
  })
  if (!editor) return null

  return (
    <BubbleMenu
      editor={editor}
      className="flex items-center gap-0.5 bg-popover border border-border rounded-lg shadow-lg p-1"
    >
      <TBtn tooltip="Bold" active={s?.isBold} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="w-3.5 h-3.5" />
      </TBtn>
      <TBtn tooltip="Italic" active={s?.isItalic} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="w-3.5 h-3.5" />
      </TBtn>
      <TBtn tooltip="Underline" active={s?.isUnderline} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon className="w-3.5 h-3.5" />
      </TBtn>
      <TBtn tooltip="Strike" active={s?.isStrike} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="w-3.5 h-3.5" />
      </TBtn>
      <TBtn tooltip="Highlight" active={s?.isHighlight} onClick={() => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()}>
        <Highlighter className="w-3.5 h-3.5" />
      </TBtn>
      <TBtn tooltip="Code" active={s?.isCode} onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code className="w-3.5 h-3.5" />
      </TBtn>
      <Divider />
      <LinkButton editor={editor} />
    </BubbleMenu>
  )
}

// ── Main Component ─────────────────────────────────
export default function TiptapEditor({
  content = "",
  onChange,
  placeholder = "Start writing your proposal...",
  minHeight = "400px",
}: TiptapProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      Subscript,
      Superscript,
      CharacterCount,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap min-h-[400px] focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  const charCount = editor?.storage.characterCount.characters() ?? 0
  const wordCount = editor?.storage.characterCount.words() ?? 0

  if(!editor) { return null }
  return (
    <TooltipProvider delayDuration={300}>
      <div className="border border-border rounded-xl overflow-hidden bg-background shadow-sm">
        <Toolbar editor={editor} />
        <SelectionMenu editor={editor} />

        {/* Editor area */}
        <div
          className="px-6 py-4 cursor-text"
          style={{ minHeight }}
          onClick={() => editor?.chain().focus().run()}
        >
          <EditorContent editor={editor} />
        </div>

        {/* Footer — word/char count */}
        <div className="flex items-center justify-end gap-4 px-4 py-2 border-t border-border bg-muted/10">
          <span className="text-xs text-muted-foreground">{wordCount} words</span>
          <span className="text-xs text-muted-foreground">{charCount} characters</span>
        </div>
      </div>
    </TooltipProvider>
  )
}
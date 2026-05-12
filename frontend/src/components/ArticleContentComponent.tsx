import React, { useEffect } from "react";
import { f } from "../lib";
import { useTranslation } from "react-i18next";
import { Box, Typography, Button, ButtonGroup, Tooltip } from "@mui/material";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import DOMPurify from "dompurify";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";

type ArticleContentComponentProps = {
  content: string; // HTML-строка
  isEditable?: boolean;
  onChange?: (html: string) => void;
};

const ArticleContentComponentBase = ({
  content,
  isEditable,
  onChange,
}: ArticleContentComponentProps) => {
  const { t } = useTranslation();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Image,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content: content || "",
    editable: isEditable,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  }, [isEditable]); // пересоздаём при смене режима

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = editor.getHTML();
    if (content !== currentHtml) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  const insertLink = () => {
    if (!editor) {
      return;
    }

    const url = window.prompt(t("articleContent.enterLinkUrl"), "https://");
    if (!url) {
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertImage = () => {
    if (!editor) {
      return;
    }

    const url = window.prompt(t("articleContent.enterImageUrl"), "https://");
    if (!url) {
      return;
    }

    editor.chain().focus().setImage({ src: url }).run();
  };

  const toolbarButton = (
    label: string,
    icon: React.JSX.Element,
    action: () => void,
    active = false
  ) => (
    <Tooltip title={label} arrow>
      <Button
        size="small"
        variant={active ? "contained" : "outlined"}
        color={active ? "primary" : "inherit"}
        onClick={action}
        sx={{ minWidth: 36, p: 1 }}
      >
        {icon}
      </Button>
    </Tooltip>
  );

  if (isEditable) {
    return (
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          {t("articleContent.content")}
        </Typography>

        <Box sx={{ mb: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
          <ButtonGroup variant="outlined" size="small">
            {toolbarButton(
              t("articleContent.toolbarBold"),
              <FormatBoldIcon fontSize="small" />,
              () => editor?.chain().focus().toggleBold().run(),
              editor?.isActive("bold")
            )}
            {toolbarButton(
              t("articleContent.toolbarItalic"),
              <FormatItalicIcon fontSize="small" />,
              () => editor?.chain().focus().toggleItalic().run(),
              editor?.isActive("italic")
            )}
            {toolbarButton(
              t("articleContent.toolbarStrike"),
              <StrikethroughSIcon fontSize="small" />,
              () => editor?.chain().focus().toggleStrike().run(),
              editor?.isActive("strike")
            )}
            {toolbarButton(
              t("articleContent.toolbarHeading1"),
              <LooksOneIcon fontSize="small" />,
              () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
              editor?.isActive("heading", { level: 1 })
            )}
            {toolbarButton(
              t("articleContent.toolbarHeading2"),
              <LooksTwoIcon fontSize="small" />,
              () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
              editor?.isActive("heading", { level: 2 })
            )}
            {toolbarButton(
              t("articleContent.toolbarBulletList"),
              <FormatListBulletedIcon fontSize="small" />,
              () => editor?.chain().focus().toggleBulletList().run(),
              editor?.isActive("bulletList")
            )}
            {toolbarButton(
              t("articleContent.toolbarOrderedList"),
              <FormatListNumberedIcon fontSize="small" />,
              () => editor?.chain().focus().toggleOrderedList().run(),
              editor?.isActive("orderedList")
            )}
            {toolbarButton(
              t("articleContent.toolbarBlockquote"),
              <FormatQuoteIcon fontSize="small" />,
              () => editor?.chain().focus().toggleBlockquote().run(),
              editor?.isActive("blockquote")
            )}
            {toolbarButton(
              t("articleContent.toolbarLink"),
              <LinkIcon fontSize="small" />,
              insertLink,
              editor?.isActive("link")
            )}
            {toolbarButton(
              t("articleContent.toolbarImage"),
              <ImageIcon fontSize="small" />,
              insertImage
            )}
          </ButtonGroup>
        </Box>

        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            minHeight: 260,
            backgroundColor: "background.paper",
            boxShadow: theme =>
              theme.palette.mode === "light"
                ? "inset 0 0 0 1px rgba(0,0,0,0.05)"
                : "inset 0 0 0 1px rgba(255,255,255,0.08)",
            "& .ProseMirror": {
              outline: "none",
              minHeight: 220,
              fontSize: 16,
              lineHeight: 1.7,
            },
            "& .ProseMirror p": {
              margin: 0,
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Box>
    );
  }

  // Режим просмотра: безопасно рендерим HTML
  const sanitizedHtml = DOMPurify.sanitize(content || "");
  return (
    <Box>
      {sanitizedHtml ? (
        <Typography
          variant="body1"
          component="div"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          sx={{
            "& img": { maxWidth: "100%", height: "auto" },
            "& a": { color: "primary.main" },
          }}
        />
      ) : (
        <Typography variant="body1" color="text.secondary">
          {t("articleContent.noContent")}
        </Typography>
      )}
    </Box>
  );
};

export const ArticleContentComponent = f.observer(ArticleContentComponentBase);
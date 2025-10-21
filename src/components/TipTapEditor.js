'use client';

import React, { useState } from 'react';
import { Box, Button, ButtonGroup, Paper, Select, MenuItem, FormControl } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Image as ImageIcon,
  Link as LinkIcon,
  YouTube,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  Code,
  FormatQuote
} from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Extension } from '@tiptap/core';

// Custom Font Size Extension
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replace('px', ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}px`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});

const TipTapEditor = ({ value, onChange, placeholder = 'Start writing...', editable = true }) => {
  const [fontSize, setFontSize] = useState('16');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'blog-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'blog-link',
        },
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        modestBranding: true,
        width: 640,
        height: 360,
      }),
    ],
    content: value,
    editable: editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) {
        onChange(html);
      }
    },
  });

  const addImage = () => {
    // Create a hidden file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      try {
        // Create FormData
        const formData = new FormData();
        formData.append('image', file);

        // Upload to backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/upload-editor-image`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();

        if (data.status === 'success' && data.data.imageUrl) {
          // Insert image into editor
          editor.chain().focus().setImage({ src: data.data.imageUrl }).run();
        } else {
          alert('Failed to upload image');
        }
      } catch (error) {
        console.error('Image upload error:', error);
        alert('Failed to upload image. Please try again.');
      }
    };

    // Trigger file selection
    input.click();
  };

  const addLink = () => {
    const url = prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addYouTube = () => {
    const url = prompt('Enter YouTube URL:');
    if (url && editor) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  if (!editor) {
    return null;
  }

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    editor.chain().focus().setFontSize(size).run();
  };

  return (
    <Paper elevation={1} sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
      {/* Toolbar */}
      {editable && (
        <Box
          sx={{
            p: 1.5,
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            backgroundColor: '#f8fafc',
            alignItems: 'center',
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#cbd5e1',
              borderRadius: '3px',
            },
          }}
        >
        {/* Font Size */}
        <FormControl size="small" sx={{ minWidth: 70, flexShrink: 0 }}>
          <Select
            value={fontSize}
            onChange={(e) => handleFontSizeChange(e.target.value)}
            sx={{ height: '32px', fontSize: '13px' }}
            displayEmpty
          >
            <MenuItem value="12">12</MenuItem>
            <MenuItem value="14">14</MenuItem>
            <MenuItem value="16">16</MenuItem>
            <MenuItem value="18">18</MenuItem>
            <MenuItem value="20">20</MenuItem>
            <MenuItem value="24">24</MenuItem>
            <MenuItem value="28">28</MenuItem>
            <MenuItem value="32">32</MenuItem>
          </Select>
        </FormControl>

        {/* Text Formatting */}
        <ButtonGroup size="small" variant="outlined" sx={{ flexShrink: 0 }}>
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            variant={editor.isActive('bold') ? 'contained' : 'outlined'}
            title="Bold"
            sx={{ minWidth: '36px' }}
          >
            <FormatBold fontSize="small" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            variant={editor.isActive('italic') ? 'contained' : 'outlined'}
            title="Italic"
            sx={{ minWidth: '36px' }}
          >
            <FormatItalic fontSize="small" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            variant={editor.isActive('underline') ? 'contained' : 'outlined'}
            title="Underline"
            sx={{ minWidth: '36px' }}
          >
            <FormatUnderlined fontSize="small" />
          </Button>
        </ButtonGroup>

        {/* Headings */}
        <ButtonGroup size="small" variant="outlined" sx={{ flexShrink: 0 }}>
          <Button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            variant={editor.isActive('heading', { level: 2 }) ? 'contained' : 'outlined'}
            sx={{ fontWeight: 600, minWidth: '40px' }}
            title="Heading 2"
          >
            H2
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            variant={editor.isActive('heading', { level: 3 }) ? 'contained' : 'outlined'}
            sx={{ fontWeight: 600, minWidth: '40px' }}
            title="Heading 3"
          >
            H3
          </Button>
        </ButtonGroup>

        {/* Text Alignment */}
        <ButtonGroup size="small" variant="outlined" sx={{ flexShrink: 0 }}>
          <Button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            variant={editor.isActive({ textAlign: 'left' }) ? 'contained' : 'outlined'}
            title="Align Left"
            sx={{ minWidth: '36px' }}
          >
            <FormatAlignLeft fontSize="small" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            variant={editor.isActive({ textAlign: 'center' }) ? 'contained' : 'outlined'}
            title="Align Center"
            sx={{ minWidth: '36px' }}
          >
            <FormatAlignCenter fontSize="small" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            variant={editor.isActive({ textAlign: 'right' }) ? 'contained' : 'outlined'}
            title="Align Right"
            sx={{ minWidth: '36px' }}
          >
            <FormatAlignRight fontSize="small" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            variant={editor.isActive({ textAlign: 'justify' }) ? 'contained' : 'outlined'}
            title="Justify"
            sx={{ minWidth: '36px' }}
          >
            <FormatAlignJustify fontSize="small" />
          </Button>
        </ButtonGroup>

        {/* Lists */}
        <ButtonGroup size="small" variant="outlined" sx={{ flexShrink: 0 }}>
          <Button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            variant={editor.isActive('bulletList') ? 'contained' : 'outlined'}
            title="Bullet List"
            sx={{ minWidth: '36px' }}
          >
            <FormatListBulleted fontSize="small" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            variant={editor.isActive('orderedList') ? 'contained' : 'outlined'}
            title="Numbered List"
            sx={{ minWidth: '36px' }}
          >
            <FormatListNumbered fontSize="small" />
          </Button>
        </ButtonGroup>

        {/* Additional */}
        <ButtonGroup size="small" variant="outlined" sx={{ flexShrink: 0 }}>
          <Button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            variant={editor.isActive('codeBlock') ? 'contained' : 'outlined'}
            title="Code Block"
            sx={{ minWidth: '36px' }}
          >
            <Code fontSize="small" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            variant={editor.isActive('blockquote') ? 'contained' : 'outlined'}
            title="Quote"
            sx={{ minWidth: '36px' }}
          >
            <FormatQuote fontSize="small" />
          </Button>
        </ButtonGroup>

        {/* Media */}
        <ButtonGroup size="small" variant="outlined" sx={{ flexShrink: 0 }}>
          <Button onClick={addImage} title="Insert Image" sx={{ minWidth: '36px' }}>
            <ImageIcon fontSize="small" />
          </Button>
          <Button onClick={addYouTube} title="Insert YouTube Video" sx={{ minWidth: '36px' }}>
            <YouTube fontSize="small" />
          </Button>
          <Button onClick={addLink} title="Insert Link" sx={{ minWidth: '36px' }}>
            <LinkIcon fontSize="small" />
          </Button>
        </ButtonGroup>
        </Box>
      )}

      {/* Editor */}
      <Box
        sx={{
          '& .ProseMirror': {
            padding: '20px',
            minHeight: '300px',
            outline: 'none',
            '& > * + *': {
              marginTop: '0.75em',
            },
            '& h2': {
              fontSize: '1.875rem',
              fontWeight: 700,
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
              lineHeight: 1.3,
              color: '#1e293b',
            },
            '& h3': {
              fontSize: '1.5rem',
              fontWeight: 600,
              marginTop: '1.25rem',
              marginBottom: '0.625rem',
              lineHeight: 1.4,
              color: '#334155',
            },
            '& p': {
              lineHeight: 1.7,
              marginBottom: '1rem',
              color: '#475569',
            },
            '& ul, & ol': {
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            },
            '& li': {
              marginBottom: '0.5rem',
              color: '#475569',
            },
            '& img': {
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
              margin: '1rem 0',
              display: 'block',
            },
            '& a': {
              color: '#2563eb',
              textDecoration: 'underline',
              cursor: 'pointer',
              '&:hover': {
                color: '#1d4ed8',
              },
            },
            '& iframe': {
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: '8px',
              margin: '1rem 0',
              border: 'none',
              display: 'block',
            },
            '& blockquote': {
              borderLeft: '4px solid #e5e7eb',
              paddingLeft: '1rem',
              marginLeft: 0,
              marginRight: 0,
              fontStyle: 'italic',
              color: '#64748b',
            },
            '& pre': {
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              padding: '1rem',
              borderRadius: '8px',
              overflow: 'auto',
              '& code': {
                backgroundColor: 'transparent',
                color: 'inherit',
                padding: 0,
              },
            },
            '& code': {
              backgroundColor: '#f1f5f9',
              color: '#e11d48',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.875em',
            },
            '& [style*="text-align"]': {
              display: 'block',
            },
            '& p.is-editor-empty:first-of-type::before': {
              color: '#adb5bd',
              content: `"${placeholder}"`,
              float: 'left',
              height: 0,
              pointerEvents: 'none',
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );
};

export default TipTapEditor;


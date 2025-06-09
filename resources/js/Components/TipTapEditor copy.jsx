// resources/js/Components/TipTapEditor.jsx

import React, { useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Node } from '@tiptap/core'; // Node is not used, can be removed if not needed elsewhere
import { Image as TiptapImage } from '@tiptap/extension-image';
import CodeBlock from '@tiptap/extension-code-block';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import axios from 'axios';
import { Heading } from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import { FloatingMenu } from '@tiptap/react';

// Custom Image Extension to add width, height, and align attributes
const CustomImage = TiptapImage.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: null,
                parseHTML: element => element.getAttribute('width'),
                renderHTML: attributes => {
                    if (attributes.width) {
                        return { width: attributes.width };
                    }
                    return {};
                },
            },
            height: {
                default: null,
                parseHTML: element => element.getAttribute('height'),
                renderHTML: attributes => {
                    if (attributes.height) {
                        return { height: attributes.height };
                    }
                    return {};
                },
            },
            align: {
                default: null,
                parseHTML: element => element.getAttribute('data-align'),
                renderHTML: attributes => {
                    if (attributes.align) {
                        return { 'data-align': attributes.align };
                    }
                    return {};
                },
            },
        };
    },
    renderHTML({ HTMLAttributes }) {
        // Get parent's renderHTML result to inherit default attributes like src, alt, title
        const parentRender = this.parent?.({ HTMLAttributes });
        // Ensure 'tiptap-image' class is always present
        const imgClasses = (parentRender?.class || '').split(' ').filter(cls => cls); // Filter out empty strings

        if (!imgClasses.includes('tiptap-image')) {
            imgClasses.push('tiptap-image');
        }
        return ['img', { ...HTMLAttributes, class: imgClasses.join(' ') }];
    },
});

// TipTap Toolbar Component
const TipTapToolbar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const buttonClass = "px-2 py-1 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors";
    const activeButtonClass = "bg-blue-200 text-blue-800";

    return (
        <div className="flex flex-wrap items-center space-x-1 p-2 border-b border-gray-300 bg-gray-100 rounded-t-lg">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`${buttonClass} ${editor.isActive('bold') ? activeButtonClass : ''}`}
                title="Bold"
            >
                B
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`${buttonClass} ${editor.isActive('italic') ? activeButtonClass : ''}`}
                title="Italic"
            >
                I
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`${buttonClass} ${editor.isActive('strike') ? activeButtonClass : ''}`}
                title="Strike through"
            >
                S
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`${buttonClass} ${editor.isActive('code') ? activeButtonClass : ''}`}
                title="Inline Code"
            >
                {'</>'}
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`${buttonClass} ${editor.isActive('paragraph') ? activeButtonClass : ''}`}
                title="Paragraph"
            >
                P
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`${buttonClass} ${editor.isActive('heading', { level: 1 }) ? activeButtonClass : ''}`}
                title="Heading 1"
            >
                H1
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`${buttonClass} ${editor.isActive('heading', { level: 2 }) ? activeButtonClass : ''}`}
                title="Heading 2"
            >
                H2
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`${buttonClass} ${editor.isActive({ textAlign: 'left' }) ? activeButtonClass : ''}`}
                title="Align Text Left"
            >
                <i className="fas fa-align-left"></i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`${buttonClass} ${editor.isActive({ textAlign: 'center' }) ? activeButtonClass : ''}`}
                title="Align Text Center"
            >
                <i className="fas fa-align-center"></i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`${buttonClass} ${editor.isActive({ textAlign: 'right' }) ? activeButtonClass : ''}`}
                title="Align Text Right"
            >
                <i className="fas fa-align-right"></i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={`${buttonClass} ${editor.isActive({ textAlign: 'justify' }) ? activeButtonClass : ''}`}
                title="Justify Text"
            >
                <i className="fas fa-align-justify"></i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().unsetTextAlign().run()}
                className={buttonClass}
                title="Clear Text Alignment"
            >
                <i className="fas fa-times"></i>
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`${buttonClass} ${editor.isActive('bulletList') ? activeButtonClass : ''}`}
                title="Bullet List"
            >
                List
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`${buttonClass} ${editor.isActive('orderedList') ? activeButtonClass : ''}`}
                title="Ordered List"
            >
                Ordered List
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`${buttonClass} ${editor.isActive('blockquote') ? activeButtonClass : ''}`}
                title="Blockquote"
            >
                Quote
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className={buttonClass}
                title="Horizontal Rule"
            >
                HR
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setHardBreak().run()}
                className={buttonClass}
                title="Hard Break"
            >
                BR
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                className={buttonClass}
                title="Undo"
            >
                Undo
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                className={buttonClass}
                title="Redo"
            >
                Redo
            </button>
            {/* Link button */}
            <button
                type="button"
                onClick={() => {
                    const url = window.prompt('URL:');
                    if (url) {
                        editor.chain().focus().setLink({ href: url }).run();
                    }
                }}
                className={`${buttonClass} ${editor.isActive('link') ? activeButtonClass : ''}`}
                title="Insert Link"
            >
                Link
            </button>
            {/* Image upload button */}
            <button
                type="button"
                onClick={() => {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.click();

                    input.onchange = async () => {
                        const file = input.files[0];
                        if (file) {
                            const formData = new FormData();
                            formData.append('image', file);

                            try {
                                const response = await axios.post('/image-upload', formData, {
                                    headers: { 'Content-Type': 'multipart/form-data' },
                                });
                                const imageUrl = response.data.url;
                                const filename = response.data.filename;

                                editor.chain().focus().setImage({ src: imageUrl }).run();
                                if (editor.options.onImageUploadSuccess) {
                                    editor.options.onImageUploadSuccess({ filename, url: imageUrl });
                                }

                            } catch (error) {
                                console.error('Error uploading image:', error);
                                if (editor.options.onImageUploadError) {
                                    editor.options.onImageUploadError(error);
                                }
                            }
                        }
                    };
                }}
                className={buttonClass}
                title="Insert Image"
            >
                Image
            </button>
            {/* Code Block button */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`${buttonClass} ${editor.isActive('codeBlock') ? activeButtonClass : ''}`}
                title="Code Block"
            >
                Code Block
            </button>
            {/* Color picker */}
            <input
                type="color"
                onInput={(event) => editor.chain().focus().setColor(event.target.value).run()}
                value={editor.getAttributes('textStyle').color || '#000000'}
                className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                title="Text Color"
            />
            <button
                type="button"
                onClick={() => editor.chain().focus().unsetColor().run()}
                className={buttonClass}
                title="Clear Text Color"
            >
                Clear Color
            </button>
        </div>
    );
};


function TipTapEditor({ value, onChange, onImageUploadSuccess, onImageUploadError }) {

    const onImageUploadSuccessRef = useRef(onImageUploadSuccess);
    const onImageUploadErrorRef = useRef(onImageUploadError);
    const onChangeRef = useRef(onChange);


    useEffect(() => {
        onImageUploadSuccessRef.current = onImageUploadSuccess;
        onImageUploadErrorRef.current = onImageUploadError;
        onChangeRef.current = onChange;
    }, [onImageUploadSuccess, onImageUploadError, onChange]);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: {
                    HTMLAttributes: {
                        class: 'language-js', // Default class for code blocks
                    },
                },
                heading: false, // Manage Heading extension separately
            }),
            TextStyle, // For managing text styles like color
            Color,     // For applying text color
            CustomImage.configure({
                inline: true, // Allow images to be inline (for text wrapping)
                allowBase64: true, // Allow base64 encoded images (for pasting from clipboard)
                HTMLAttributes: {
                    class: 'tiptap-image', // Custom class for image nodes
                },
            }),
            CodeBlock, // Code block extension
            Link.configure({
                openOnClick: false, // Don't open link on single click (allow selection)
                autolink: true,     // Automatically convert URLs to links
            }),
            Highlight.configure({
                multicolor: true, // Allow multiple highlight colors
            }),
            Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }), // Configure heading levels
            TextAlign.configure({
                types: ['heading', 'paragraph', 'listItem'], // Apply text align to these node types
            }),
        ],
        content: value, // Initial content of the editor
        onUpdate: ({ editor }) => {
            onChangeRef.current?.(editor.getHTML()); // Call onChange prop with updated HTML
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none p-4 min-h-[300px] border border-gray-300 rounded-b-lg overflow-auto',
                // These classes are critical for styling the editor content with Tailwind Typography
            },
        },
        onCreate: ({ editor }) => {
            // Pass image upload callback functions to editor options for use in toolbar
            editor.options.onImageUploadSuccess = (data) => onImageUploadSuccessRef.current?.(data);
            editor.options.onImageUploadError = (error) => onImageUploadErrorRef.current?.(error);
        },
    });

    // Callback function to delete image from editor and server
    const deleteImage = useCallback(async () => {
        if (!editor) {
            console.warn('Editor not initialized yet for deleteImage.');
            return;
        }

        const isImageSelected = editor.isActive('image');
        const selectedImageUrl = isImageSelected ? editor.getAttributes('image').src : null;

        if (!isImageSelected || !selectedImageUrl) {
            console.warn('No image selected or URL not found for deletion.');
            return;
        }

        if (!confirm('Apakah Anda yakin ingin menghapus gambar ini? Ini akan menghapus gambar dari server juga.')) {
            return;
        }

        try {
            let filenameToDelete = selectedImageUrl.split('/').pop();
            filenameToDelete = filenameToDelete.split('?')[0]; // Remove query params if any

            const response = await axios.delete(`/image-delete/${filenameToDelete}`);

            if (response.data.success) {
                console.log('Gambar berhasil dihapus dari server:', filenameToDelete);
            } else {
                console.warn('Gambar dihapus dari editor, tapi gagal dari server:', response.data.message);
            }
        } catch (error) {
            console.error('Error saat menghapus gambar dari server:', error);
        }

        editor.chain().focus().deleteSelection().run(); // Delete image node from editor
        editor.chain().blur().run(); // Blur editor to hide floating menu after deletion
    }, [editor]);

    // Effect to update editor content when 'value' prop changes (external content update)
    useEffect(() => {
        if (editor && editor.getHTML() !== value) {
            const isFocused = editor.isFocused; // Preserve focus state
            editor.commands.setContent(value, false); // Set content without dispatching update event
            if (isFocused) {
                editor.commands.focus(); // Restore focus if it was focused
            }
        }
    }, [value, editor]);

    // Tailwind CSS classes for buttons
    const buttonClass = "px-2 py-1 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors";
    const activeButtonClass = "bg-blue-200 text-blue-800";

    return (
        <div className="border border-gray-300 rounded-lg">
            {/* Toolbar always visible */}
            <TipTapToolbar editor={editor} />
            {/* Editor content area */}
            <EditorContent editor={editor} />

            {/* Floating Menu for Image Controls */}
            {editor && (
                <FloatingMenu
                    className="image-floating-menu flex items-center space-x-1 p-1 bg-white rounded-md shadow-md"
                    editor={editor}
                    tippyOptions={{
                        duration: 100,
                        placement: 'top',
                        offset: [0, 10],
                        appendTo: () => editor.options.element, // Append to editor element
                    }}
                    shouldShow={({ editor, state }) => {
                        // Only show menu if editor is ready
                        if (!editor) return false;

                        const { selection } = state;

                        // Case 1: Image node is actively selected or cursor is inside it.
                        // This is the primary condition for showing the menu.
                        if (editor.isActive('image')) {
                            const node = selection.node;
                            // Ensure it's truly an image node being selected/focused
                            if (node && node.type.name === 'image') {
                                return true;
                            }
                            // If cursor is empty, but within an image wrapper (e.g., paragraph containing image)
                            // and the image attributes are available, show the menu.
                            if (selection.empty && editor.getAttributes('image').src) {
                                return true;
                            }
                        }

                        // Do not show menu if no image is actively selected or cursor inside it
                        return false;
                    }}
                >
                    {/* Resize Image Button */}
                    <button
                        type="button"
                        onClick={() => {
                            const currentWidth = editor.getAttributes('image').width || '100%';
                            const newWidth = window.prompt(`Masukkan lebar baru gambar (misal: 50% atau 300px):`, currentWidth);
                            if (newWidth !== null && newWidth.trim() !== '') {
                                editor.chain().focus().updateAttributes('image', { width: newWidth }).run();
                                editor.chain().blur().run(); // Hide menu after action
                            }
                        }}
                        className={`${buttonClass}`}
                        title="Resize Image"
                    >
                        <i className="fas fa-expand-alt"></i>
                    </button>
                    {/* Align Image Left Button */}
                    <button
                        type="button"
                        onClick={() => {
                            editor.chain().focus().updateAttributes('image', { align: 'left' }).run();
                            editor.chain().blur().run(); // Hide menu after action
                        }}
                        className={`${buttonClass} ${editor.isActive('image', { align: 'left' }) ? activeButtonClass : ''}`}
                        title="Align Image Left"
                    >
                        <i className="fas fa-image"></i> <i className="fas fa-align-left"></i>
                    </button>
                    {/* Align Image Center Button */}
                    <button
                        type="button"
                        onClick={() => {
                            editor.chain().focus().updateAttributes('image', { align: 'center' }).run();
                            editor.chain().blur().run(); // Hide menu after action
                        }}
                        className={`${buttonClass} ${editor.isActive('image', { align: 'center' }) ? activeButtonClass : ''}`}
                        title="Align Image Center"
                    >
                        <i className="fas fa-image"></i> <i className="fas fa-align-center"></i>
                    </button>
                    {/* Align Image Right Button */}
                    <button
                        type="button"
                        onClick={() => {
                            editor.chain().focus().updateAttributes('image', { align: 'right' }).run();
                            editor.chain().blur().run(); // Hide menu after action
                        }}
                        className={`${buttonClass} ${editor.isActive('image', { align: 'right' }) ? activeButtonClass : ''}`}
                        title="Align Image Right"
                    >
                        <i className="fas fa-image"></i> <i className="fas fa-align-right"></i>
                    </button>
                    {/* Clear Image Alignment Button */}
                    <button
                        type="button"
                        onClick={() => {
                            editor.chain().focus().updateAttributes('image', { align: null }).run();
                            editor.chain().blur().run(); // Hide menu after action
                        }}
                        className={`${buttonClass} ${editor.getAttributes('image').align === null ? activeButtonClass : ''}`}
                        title="Clear Image Alignment"
                    >
                        <i className="fas fa-image"></i> <i className="fas fa-times"></i>
                    </button>
                    {/* Delete Image Button */}
                    <button
                        type="button"
                        onClick={deleteImage} // deleteImage already calls .blur().run()
                        className={`${buttonClass} bg-red-200 text-red-800 hover:bg-red-300`}
                        title="Delete Image"
                    >
                        <i className="fas fa-trash"></i>
                    </button>
                </FloatingMenu>
            )}
        </div>
    );
}

export default TipTapEditor;
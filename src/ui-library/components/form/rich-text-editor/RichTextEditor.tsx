import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import { useEffect } from 'react';
import styles from './RichTextEditor.module.css';

export interface RichTextEditorProps {
    value?: string;
    onChange?: (html: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function RichTextEditor({ value, onChange, placeholder, disabled = false }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false,
                bulletList: false,
                listItem: false,
            }),
            Bold,
            Italic,
            BulletList,
            ListItem,
        ],
        content: value || '',
        editable: !disabled,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange?.(html);
        },
        editorProps: {
            attributes: {
                class: styles.editor,
            },
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [editor, value]);

    useEffect(() => {
        if (editor) {
            editor.setEditable(!disabled);
        }
    }, [editor, disabled]);

    if (!editor) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`${styles.toolbarButton} ${editor.isActive('bold') ? styles.active : ''}`}
                    disabled={disabled}
                    title="Bold"
                >
                    <strong>B</strong>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`${styles.toolbarButton} ${editor.isActive('italic') ? styles.active : ''}`}
                    disabled={disabled}
                    title="Italic"
                >
                    <em>I</em>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`${styles.toolbarButton} ${editor.isActive('bulletList') ? styles.active : ''}`}
                    disabled={disabled}
                    title="Bullet List"
                >
                    •
                </button>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}

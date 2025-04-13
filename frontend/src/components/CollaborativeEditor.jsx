import React, { useEffect, useRef } from 'react';
import { useCRDT } from './CRDTProvider';

const CollaborativeEditor = ({ initialContent = '', onChange }) => {
  const { sharedText } = useCRDT();
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!sharedText || !textareaRef.current) return;

    const textarea = textareaRef.current;

    // Set initial content
    if (initialContent && sharedText.toString() === '') {
      sharedText.insert(0, initialContent);
    }

    // Observe changes from other clients
    const observer = event => {
      const newContent = sharedText.toString();
      if (textarea.value !== newContent) {
        textarea.value = newContent;
        onChange?.(newContent);
      }
    };

    sharedText.observe(observer);

    // Handle local changes
    const handleInput = () => {
      const newContent = textarea.value;
      sharedText.delete(0, sharedText.length);
      sharedText.insert(0, newContent);
      onChange?.(newContent);
    };

    textarea.addEventListener('input', handleInput);

    return () => {
      sharedText.unobserve(observer);
      textarea.removeEventListener('input', handleInput);
    };
  }, [sharedText, initialContent, onChange]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <textarea
        ref={textareaRef}
        className="w-full h-96 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Start typing..."
      />
    </div>
  );
};

export default CollaborativeEditor;

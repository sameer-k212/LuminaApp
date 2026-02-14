import { useState, useEffect, useRef } from 'react';
import api from '../api';

export default function HighlightableText({ text, courseId, field }) {
  const [highlights, setHighlights] = useState([]);
  const textRef = useRef(null);

  useEffect(() => {
    if (courseId) fetchHighlights();
  }, [courseId]);

  const fetchHighlights = async () => {
    try {
      const { data } = await api.get(`/highlights/${courseId}`);
      setHighlights(data.filter(h => h.field === field));
    } catch (error) {
      console.error('Failed to fetch highlights');
    }
  };

  const handleMouseUp = async () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (!selectedText || !textRef.current) return;

    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(textRef.current);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = preSelectionRange.toString().length;
    const endOffset = startOffset + selectedText.length;

    try {
      const { data } = await api.post('/highlights', {
        courseId,
        text: selectedText,
        startOffset,
        endOffset,
        color: '#ffeb3b',
        field
      });
      setHighlights([...highlights, data]);
      selection.removeAllRanges();
    } catch (error) {
      console.error('Failed to highlight');
    }
  };

  const handleDoubleClick = async (highlightId) => {
    try {
      await api.delete(`/highlights/${highlightId}`);
      setHighlights(highlights.filter(h => h._id !== highlightId));
    } catch (error) {
      console.error('Failed to remove highlight');
    }
  };

  const renderHighlightedText = () => {
    if (!text || highlights.length === 0) return text;

    const sortedHighlights = [...highlights].sort((a, b) => a.startOffset - b.startOffset);
    const parts = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight) => {
      if (highlight.startOffset > lastIndex) {
        parts.push({ text: text.substring(lastIndex, highlight.startOffset), highlighted: false });
      }
      parts.push({
        text: text.substring(highlight.startOffset, highlight.endOffset),
        highlighted: true,
        color: highlight.color,
        id: highlight._id
      });
      lastIndex = highlight.endOffset;
    });

    if (lastIndex < text.length) {
      parts.push({ text: text.substring(lastIndex), highlighted: false });
    }

    return parts.map((part, index) =>
      part.highlighted ? (
        <mark
          key={index}
          style={{ backgroundColor: part.color, cursor: 'pointer' }}
          onDoubleClick={() => handleDoubleClick(part.id)}
          title="Double-click to remove"
        >
          {part.text}
        </mark>
      ) : (
        <span key={index}>{part.text}</span>
      )
    );
  };

  return (
    <div ref={textRef} onMouseUp={handleMouseUp} style={{ userSelect: 'text', cursor: 'text' }}>
      {renderHighlightedText()}
    </div>
  );
}

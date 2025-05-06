// GeminiFormatter.js
/**
 * Utility to format raw Gemini API responses into structured content
 */

/**
 * Parses and formats raw Gemini API text responses
 * @param {string} rawText - The raw text from Gemini API
 * @returns {object} - Formatted content with sections and parsed markdown
 */
export const formatGeminiResponse = (rawText) => {
  if (!rawText) return { formatted: "", sections: [] };
  
  // Replace markdown section headers with proper formatting
  const processedText = rawText
    // Fix section headers formatting (e.g., "**Section:**")
    .replace(/\*\*(.*?)\*\*/g, '<h3>$1</h3>')
    // Fix subsection headers
    .replace(/\*\*(.*?)\*\*/g, '<h4>$1</h4>')
    // Fix bullet points that might be malformed
    .replace(/^\s*\*\s+/gm, '• ')
    // Fix numbered lists
    .replace(/^\s*(\d+)\.\s+/gm, '$1. ')
    // Fix paragraph spacing
    .replace(/\n\n/g, '<br/><br/>');

  // Extract sections for potential navigation or structure
  const sectionRegex = /<h3>(.*?)<\/h3>/g;
  const sections = [];
  let match;
  
  while ((match = sectionRegex.exec(processedText)) !== null) {
    sections.push(match[1].trim());
  }

  return {
    formatted: processedText,
    sections: sections
  };
};

/**
 * Component to render formatted Gemini API responses
 */
import React from 'react';

const GeminiFormattedResponse = ({ rawText }) => {
  const { formatted } = formatGeminiResponse(rawText);
  
  return (
    <div 
      className="gemini-formatted-response"
      dangerouslySetInnerHTML={{ __html: formatted }}
    />
  );
};

export default GeminiFormattedResponse;
import React from 'react';

const Markdown = ({ children, className }: { children; className? }) => {
  const processMarkdown = (text) => {
    const parseList = (text, depth = 0) => {
      const re = new RegExp(
        `(?:\\n)^([ \\t]{${depth * 2},})\\d*([*+-]|\\.)[ \\t]+.*?(\\n\\1\\d*\\2.*?$|\\n*\\1[ \\t]{2,}.*?$|$)+`,
        'gm',
      );
      return text.replace(re, (match, $1, $2) => {
        match = parseList(match, depth + 1);
        match = match.replace(/^[ \t]*([*+-]|\d\.)\s+(.*?)$/gm, `<li>$2</li>`);
        return `<${$2 === '.' ? 'o' : 'u'}l>${match}\n</${$2 === '.' ? 'o' : 'u'}l>`;
      });
    };

    const isHtmlBlock = (text) => {
      const tags =
        'p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del|details|summary';
      const re = new RegExp(`(^<(${tags})|</(${tags})>)`, 'gm');
      return text.match(re) || text.match(/<hr>/gm);
    };

    const escapeHtml = (text) =>
      text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const headerId = (text) =>
      escapeHtml(text).toLowerCase().replace(/ /g, '-');

    return (
      text
        .replace(/\r\n/g, '\n')
        // First handle blockquotes with optional space after >
        .replace(/^>+(\s?.*(\n>+\s?.*)*)/gm, (_, content) => {
          const cleaned = content
            .replace(/\n>+/g, '\n') // Remove > markers from subsequent lines
            .replace(/^\s+|\s+$/g, ''); // Trim whitespace
          return cleaned ? `<blockquote>${cleaned}</blockquote>` : '';
        })
        // Then process other markdown elements
        .replace(/(\*\*|__)(.*?)\1/gm, '<strong>$2</strong>')
        .replace(/(\*|_)(.*?)\1/gm, '<em>$2</em>')
        .replace(/(~~)(.*?)\1/gm, '<del>$2</del>')
        .replace(
          /(`{3,})([\s\S]*?)\1(?!`)/gm,
          (_, $1, $2) => `<pre><code>${escapeHtml($2)}</code></pre>`,
        )
        .replace(
          /(`+)(.*?)\1(?!`)/gm,
          (_, $1, $2) => `<code>${escapeHtml($2)}</code>`,
        )
        // Fix URL parsing with underscores
        .replace(/!\[(.*?)\]\(([^)]+)\)/gm, '<img src="$2" alt="$1" />')
        .replace(/\[(.*?)\]\(([^)]+)\)/gm, '<a href="$2">$1</a>')
        // Rest of your existing processing
        .replace(/^([ ]?(\*|-|_)[ ]?){3,}$/gm, '<hr>')
        .replace(/[\s\S]*/, (match) => parseList(match))
        .replace(
          /^::: spoiler (.*?)\n([\s\S]*?)\n:::$/gm,
          '<details class="markdown-spoiler"><summary>$1</summary>$2</details>',
        )
        .split(/\n{2,}/)
        .map((p) =>
          isHtmlBlock(p)
            ? p
            : p
                .replace(/\n[ \t]*/gm, '<br>')
                .replace(/^[ \t]*([\s\S]+)$/gm, '<p>$1</p>'),
        )
        .join('\n\n')
    );
  };

  const html = processMarkdown(String(children));

  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default Markdown;

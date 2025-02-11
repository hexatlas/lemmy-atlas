import React from 'react';

const Markdown = ({
  children,
  className,
  highlight = [],
}: {
  children: React.ReactNode;
  className?: string;
  highlight?: string[];
}) => {
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

    const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    let processed = text
      .replace(/\r\n/g, '\n')
      .replace(/^>+(\s?.*(\n>+\s?.*)*)/gm, (_, content) => {
        const cleaned = content
          .replace(/\n>+/g, '\n')
          .replace(/^\s+|\s+$/g, '');
        return cleaned ? `<blockquote>${cleaned}</blockquote>` : '';
      })
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
      .replace(/!\[(.*?)\]\(([^)]+)\)/gm, '<img src="$2" alt="$1" />')
      .replace(/\[(.*?)\]\(([^)]+)\)/gm, '<a href="$2">$1</a>')
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
      .join('\n\n');

    // Apply text highlighting
    if (highlight.length > 0) {
      const wordsPattern = highlight.map(escapeRegExp).join('|');
      const regex = new RegExp(`(<[^>]*>)|\\b(${wordsPattern})\\b`, 'gi');
      processed = processed.replace(regex, (_, tag, word) =>
        tag ? tag : `<span class="highlight">${word}</span>`,
      );
    }

    return processed;
  };

  const html = processMarkdown(String(children));

  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default Markdown;

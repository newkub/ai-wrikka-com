import MarkdownIt from 'markdown-it';

export function useMarkdown() {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  });

  const renderMarkdown = (text: string): string => {
    if (!text) return '';
    return md.render(text);
  };

  return {
    renderMarkdown
  };
}

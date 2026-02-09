export function isLikelyMarkdown(text: string) {
  if (!text) return false;
  const mdIndicators = [
    "###",
    "## ",
    "---",
    "**",
    "- ",
    "* ",
    "`",
    "> ",
    "```",
  ];
  return mdIndicators.some((ind) => text.includes(ind));
}

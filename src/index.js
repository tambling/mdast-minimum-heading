const visit = require("unist-util-visit");

const ABSOLUTE_MINIMUM = 1;
const ABSOLUTE_MAXIMUM = 6;

const normalizeLevel = level => {
  let levelAsInteger;

  if (typeof level === "string") {
    const integerMatch = level.match(/\d+/g);
    levelAsInteger = integerMatch && parseInt(integerMatch[0], 10);
  } else {
    levelAsInteger = parseInt(level, 10);
  }

  return Number.isNaN(levelAsInteger) ||
    (levelAsInteger < 1 || levelAsInteger > 6)
    ? ABSOLUTE_MINIMUM
    : levelAsInteger;
};

const calculateMinimumDepth = ast => {
  let minimumDepth = ABSOLUTE_MAXIMUM;
  visit(ast, "heading", node => {
    if (node.depth < minimumDepth) minimumDepth = node.depth;
  });

  return minimumDepth;
};

const applyMinimumHeader = (ast, level) => {
  const normalizedLevel = normalizeLevel(level);
  const minimumDepth = calculateMinimumDepth(ast);
  const offset = normalizedLevel - minimumDepth;

  if (offset > 0) {
    visit(ast, "heading", node => {
      // eslint-disable-next-line no-param-reassign
      node.depth = Math.min(node.depth + offset, ABSOLUTE_MAXIMUM);
    });
  }

  return ast;
};

module.exports = applyMinimumHeader;

import fs from "fs";
import path from "path";
import remark from "remark";

import applyMinimumHeading from "..";

const loadToRemark = (collection, name) =>
  remark()
    .use({ settings: { position: false } })
    .parse(
      fs.readFileSync(
        path.join(__dirname, "fixtures", collection, `${name}.md`)
      )
    );

test("applyMinimumHeading exists and is a function", () =>
  expect(applyMinimumHeading).toBeInstanceOf(Function));

test("applyMinimumHeading increases heading depth to respect minimum", () => {
  const expected = loadToRemark("outputs", "basic");
  const actual = applyMinimumHeading(loadToRemark("inputs", "basic"), 2);

  expect(actual).toEqual(expected);
});

test("applyMinimumHeading does not change headings at the minimum", () => {
  const expected = loadToRemark("outputs", "unchanged");
  const actual = applyMinimumHeading(loadToRemark("inputs", "unchanged"), 1);

  expect(actual).toEqual(expected);
});

test("applyMinimumHeading does not increase heading depth past 6", () => {
  const expected = loadToRemark("outputs", "maximum");
  const actual = applyMinimumHeading(loadToRemark("inputs", "maximum"), 4);

  expect(actual).toEqual(expected);
});

test("applyMinimumHeading can also figure out a minimum from a tag name", () => {
  const expected = loadToRemark("outputs", "basic");
  const actual = applyMinimumHeading(loadToRemark("inputs", "basic"), "h2");

  expect(actual).toEqual(expected);
});

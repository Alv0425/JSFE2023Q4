import type Component from "src/utils/component/component";
import { div, span } from "src/utils/component/elements";

const line = (): Component =>
  div(
    ["room__line"],
    span(["room__line-separator"]),
    span(["room__text"], "new messages"),
    span(["room__line-separator"]),
  );

export default line;

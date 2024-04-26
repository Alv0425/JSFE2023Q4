import type Component from "../../../../utils/component/component";
import { div } from "../../../../utils/component/elements";

const messagePlaceholder = (): Component => {
  const placeholder = div(["room__message-placeholder"]);
  placeholder.setTextContent("no messages yet in this room");
  return placeholder;
};

export default messagePlaceholder;

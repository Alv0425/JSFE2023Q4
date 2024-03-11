import "./blobs.css";
import createSvg from "../../../utils/helpers/createsvg";
import eventEmitter from "../../../utils/eventemitter";

class Blobs {
  public constructor() {
    const blobLeft = createSvg(
      "./assets/background/blob.svg#blob-left",
      "blob-left",
    );
    const blobRight = createSvg(
      "./assets/background/blob.svg#blob-left",
      "blob-right",
    );
    document.body.append(blobLeft, blobRight);
    eventEmitter.on("login", () => {
      blobLeft.classList.add("blob-log-in");
      blobRight.classList.add("blob-log-in");
    });
    eventEmitter.on("logout", () => {
      blobLeft.classList.remove("blob-log-in");
      blobRight.classList.remove("blob-log-in");
    });
  }
}

export default Blobs;

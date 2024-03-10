import "./blobs.css";
import createSvg from "../../../utils/helpers/createsvg";

class Blobs {
  public constructor() {
    const blobLeft = createSvg(
      "../../../assets/background/blob.svg#blob-left",
      "blob-left",
    );
    const blobRight = createSvg(
      "../../../assets/background/blob.svg#blob-left",
      "blob-right",
    );
    document.body.append(blobLeft, blobRight);
  }
}

export default Blobs;

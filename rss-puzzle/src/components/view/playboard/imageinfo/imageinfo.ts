import "./imageinfo.css";
import Component from "../../../../utils/component";
import { ILevelData } from "../../../../utils/types/interfaces";
import { h3, p } from "../../../../utils/elements";

class ImageInfo extends Component {
  public constructor() {
    super("div", ["image-info"]);
  }

  public close() {
    this.getComponent().classList.add("fade-out");
    setTimeout(() => {
      this.getComponent().classList.remove("fade-out");
      this.clear();
      this.getComponent().classList.remove("image-info_show");
    }, 500);
  }

  public setInfo(levelData: ILevelData) {
    this.clear();
    const name: Component<HTMLElement> = h3(["image-info__title"], `${levelData.name}`);
    const info: Component<HTMLElement> = p(["image-info__meta"], `${levelData.author ?? ""}, ${levelData.year ?? ""}`);
    this.appendContent([name, info]);
  }

  public open() {
    this.getComponent().classList.add("image-info_hide");
    this.getComponent().classList.add("image-info_show");
    setTimeout(() => {
      this.getComponent().classList.remove("image-info_hide");
    }, 500);
  }
}

const imageInfo: ImageInfo = new ImageInfo();

export default imageInfo;

import Component from "../../../../utils/component";
import selectLevel from "../selectlevel/selectlevel";

class PlayboardNav extends Component {
  public constructor() {
    super("div", ["playboard__header"], {}, {}, selectLevel.button);
  }
}

const playboardNav: PlayboardNav = new PlayboardNav();

export default playboardNav;

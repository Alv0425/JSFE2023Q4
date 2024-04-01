import "./winners.css";
import Component from "../../utils/component";
import { h2 } from "../../utils/elements";
import winnersTable from "./winner-table/winner-table";

class Winners extends Component {
  constructor() {
    super("div", ["winners"], {}, {}, h2(["winners__title"], "WINNERS"), winnersTable);
  }
}

const winners = new Winners();

export default winners;

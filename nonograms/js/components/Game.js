import { Layout } from "./Layout.js";
import { Base } from "./Base.js";
import { Modal } from "./Modal.js";
import { Sound  } from "./Sound.js";
export class Game extends Base {
  constructor(nonograms) {
    super();
    this.nonograms = nonograms;
    this.layout = null;
    this.timer = 0;
    this.interval = null;
    this.cluesX = [];
    this.cluesY = [];
    this.currentGame = [];
    this.isTimerRunning = false;
    this.sounds = null;
  }

  renderPlayboard() {
    this.sounds = new Sound();
    this.layout = new Layout();
    this.layout.renderPage();
    this.updateScoreTable();
    this.openGame(this.nonograms[0]);
    this.layout.appButtons["reset game"].onclick = () => {
      this.openGame(this.currentGame);
    };
    this.layout.appButtons["play random"].onclick = () => {
      const sequenceLength = this.nonograms.length;
      this.openGame(this.nonograms[Math.floor(Math.random() * sequenceLength)]);
    };
    this.layout.appButtons["show solution"].onclick = () => {
      this.showSolution();
    };
    this.layout.appButtons["select game"].onclick = () => {
      const selectModal = new Modal("select");
      selectModal.openModal();
      const formSelect = this.createNode("form", ["modal__form"]);
      const modalInputs = {};
      const selectContent = this.createNode("div", ["modal__content"]);
      [5, 10, 15].forEach((size) => {
        const input = this.createNode("input", ["input"], {
          type: "radio",
          id: `size-${size}`,
          value: size,
          name: "select",
        });
        modalInputs[`size-${size}`] = input;
        const label = this.createNode("label", ["modal__tag"], {
          for: `size-${size}`,
        });
        if (size === 5) {
          label.textContent = "easy (5 x 5)";
          input.checked = true;
        }
        if (size === 10) label.textContent = "medium (10 x 10)";
        if (size === 15) label.textContent = "hard (15 x 15)";
        formSelect.append(input, label);
      });

      const showGames = (value) => {
        const allgames = this.nonograms.filter(
          (game) => value * 1 === game.size,
        );
        this.clearNode(selectContent);
        allgames.forEach((game) => {
          const card = this.createNode("div", ["modal__card"]);
          card.onclick = () => {
            selectModal.closeModal();
            this.openGame(game);
          };
          const cardTitle = this.createNode(
            "p",
            ["modal__card-title"],
            {},
            game.hint,
          );
          const mini = this.showMiniature(game);
          card.append(cardTitle, mini);
          selectContent.append(card);
        });
      };
      formSelect.oninput = (e) => {
        showGames(e.target.value);
      };
      showGames(5);
      selectModal.modalBody.append(formSelect, selectContent);
    };
    this.layout.appButtons["save game"].onclick = () => {
      if (this.layout.nonogramFieldCont.classList.contains("disabled")) return;
      const set = this.cells.map((row) =>
        row.map((cell) => {
          if (cell.classList.contains("cross")) return 2;
          if (cell.classList.contains("black")) return 1;
          return 0;
        }),
      );
      this.setSavedGame([this.currentGame, set, this.timer]);
    };
    this.layout.appButtons["open saved"].onclick = () => {
      const savedGame = this.getSavedGame();
      if (savedGame) {
        this.openGame(...savedGame);
      }
    };
  }

  setTimer() {
    if (!this.isTimerRunning) {
      this.isTimerRunning = true;
      this.interval = setInterval(() => {
        this.timer += 0.1;
        this.updateTimer();
      }, 100);
    }
  }

  fillCell(cell) {
    cell.classList.remove('cross');
    if (!cell.classList.contains('black') && this.firstCellFilled) {
      this.sounds.playFill(!this.layout.soundsTogglers["cell sounds"].checked);
      cell.classList.add('black');
    }
    if (cell.classList.contains('black') && !this.firstCellFilled) {
      this.sounds.playEmpty(!this.layout.soundsTogglers["cell sounds"].checked);
      cell.classList.remove('black');
    }
	}

  openGame(game, state, timer) {
    this.isTimerRunning = false;
    this.layout.nonogramFieldCont.classList.remove("disabled");
    this.layout.updateNonogramCont();
    this.layout.gameNameCont.textContent = game.hint;
    this.cells = [];
    this.currentGame = game;
    if (!timer) timer = 0;
    if (!state) {
      state = new Array(game.size).fill(new Array(game.size).fill(0));
    }
    this.timer = timer;
    this.updateTimer();
    clearInterval(this.interval);
    this.interval = null;
    this.cluesX = [];
    this.cluesY = [];
    if (this.timer > 0) this.setTimer();
    for (let i = 0; i < game.size; i++) {
      const row = [];
      for (let j = 0; j < game.size; j++) {
        const newCell = this.createNode("button", ["cell"]);
        if (state[i][j] === 1) newCell.classList.add("black");
        if (state[i][j] === 2) newCell.classList.add("cross");
        row.push(newCell);
      }
      this.cells.push(row);
    }
    const rows = this.cells.map((row) => {
      const newrow = this.createNode("div", ["row"]);
      this.cluesX.push(this.createNode("div", ["clues"]));
      this.cluesY.push(this.createNode("div", ["clues"]));
      newrow.append(...row);
      return newrow;
    });
    this.layout.cluesXCont.append(...this.cluesX);
    this.layout.cluesYCont.append(...this.cluesY);
    this.layout.nonogramFieldCont.append(...rows);
    this.firstCellFilled = false;
    this.addListeners([this.layout.nonogramFieldCont],["mousedown"], (e) => {
      this.mousedown = true;
			this.firstCellFilled = !e.target.classList.contains('black');
      if (this.mousedown && e.target.classList.contains('cell') && e.button === 0) {
        this.fillCell(e.target);
        this.checkGameState();
        this.setTimer();
      }
    });
    this.addListeners([this.layout.nonogramFieldCont],["mouseover"], (e) => {
      if (this.mousedown && e.target.classList.contains('cell')) {
        this.fillCell(e.target);
        this.checkGameState();
        this.setTimer();
      }
    });

    this.addListeners([this.layout.nonogramFieldCont],["mouseup"], () => {
      this.mousedown = false;
    });

    this.addListeners([this.layout.nonogramFieldCont],["mouseleave"], () => {
      this.mousedown = false;
    });

    // this.layout.nonogramFieldCont.onclick = (event) => {
    //   if (event.target.classList.contains("cell")) {
    //     event.target.classList.remove("cross");
    //     if (event.target.classList.contains('black')) {
    //       this.sounds.playEmpty(!this.layout.soundsTogglers["cell sounds"].checked);
    //     } else {
    //       this.sounds.playFill(!this.layout.soundsTogglers["cell sounds"].checked);
    //     }
    //     event.target.classList.toggle("black");
    //     this.checkGameState();
    //     this.setTimer();
    //   }
    // };
    this.layout.nonogramFieldCont.oncontextmenu = (event) => {
      event.preventDefault();
      if (event.target.classList.contains("cell")) {
        event.target.classList.remove("black");
        if (event.target.classList.contains('cross')) {
          this.sounds.playEmpty(!this.layout.soundsTogglers["cell sounds"].checked);
        } else {
          this.sounds.playCross(!this.layout.soundsTogglers["cell sounds"].checked);
        }
        event.target.classList.toggle("cross");
        this.checkGameState();
        this.setTimer();
      }
    };

    const curRow = (y) => game.field[y];
    const curCol = (x) => game.field.map((row) => row[x]);
    const setClues = (arr) => {
      let len = 0;
      return arr.reduce((accum, cell, index) => {
        if (cell === 1) {
          len += 1;
          if (index === game.size - 1) accum.push(len);
        } else if (len !== 0) {
          accum.push(len);
          len = 0;
        }
        return accum;
      }, []);
    };
    const tipsX = [];
    const tipsY = [];
    for (let i = 0; i < game.size; i++) {
      tipsX.push(setClues(curCol(i)));
      tipsY.push(setClues(curRow(i)));
    }
    tipsX.forEach((tip, index) => {
      const tipsSetX = tip.map((num) => {
        return this.createNode("div", ["clue"], {}, `${num}`);
      });
      this.clearNode(this.cluesX[index]);
      this.cluesX[index].append(...tipsSetX);
    });
    tipsY.forEach((tip, index) => {
      const tipsSetY = tip.map((num) => {
        return this.createNode("div", ["clue"], {}, `${num}`);
      });
      this.clearNode(this.cluesY[index]);
      this.cluesY[index].append(...tipsSetY);
    });
  }

  convertTime(time) {
    time = Math.round(time);
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    if (time >= 60 * 60) {
      hours = Math.floor(time / (60 * 60));
      time = time - hours * (60 * 60);
    }
    if (time >= 60) {
      minutes = Math.floor(time / 60);
      time = time - minutes * 60;
    }
    seconds = time;

    return hours > 0
      ? `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      : `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
  }

  updateTimer() {
    this.layout.timerCont.textContent = this.convertTime(this.timer);
  }

  checkGameState() {
    const isWin = () => {
      for (let i = 0; i < this.currentGame.size; i++) {
        for (let j = 0; j < this.currentGame.size; j++) {
          const isCellBlack = this.cells[i][j].classList.contains("black");
          const gameCell = this.currentGame.field[i][j];
          if (gameCell === 0 && isCellBlack) return false;
          if (gameCell === 1 && !isCellBlack) return false;
        }
      }
      return true;
    };
    if (isWin()) {
      const winModal = new Modal("win");
      winModal.openModal();
      clearInterval(this.interval);
      const mini = this.showMiniature(this.currentGame);
      const textWin = this.createNode("div", ["modal__text"]);
      textWin.textContent = `Great! You have solved the nonogram in ${Math.round(
        this.timer,
      )} seconds!`;
      winModal.modalBody.append(mini, textWin);
      this.layout.nonogramFieldCont.classList.add("disabled");
      this.updateHistory(this.currentGame, this.timer);
      this.updateScoreTable();
      this.sounds.playWin(!this.layout.soundsTogglers["win sound"].checked);
    }
  }

  showMiniature(game) {
    const miniature = this.createNode("div", ["modal__miniature"]);
    for (let i = 0; i < game.size; i++) {
      const row = this.createNode("div", ["modal__miniature-row"]);
      for (let j = 0; j < game.size; j++) {
        const cell = this.createNode("div", ["modal__miniature-cell"]);
        if (game.field[i][j] === 1) cell.classList.add("dark");
        row.append(cell);
      }
      miniature.append(row);
    }
    return miniature;
  }

  updateScoreTable() {
    this.clearNode(this.layout.scoreList);
    const history = this.getHistory();
    history.forEach((game) => {
      const li = this.createNode("li", ["app__score-item"]);
      const name = this.createNode(
        "span",
        ["app__score-item-name"],
        {},
        game.game.hint,
      );
      const level = this.createNode(
        "span",
        ["app__score-item-level"],
        {},
        `${game.game.size} x ${game.game.size}`,
      );
      const time = this.createNode(
        "span",
        ["app__score-item-time"],
        {},
        this.convertTime(game.time),
      );
      const mini = this.showMiniature(game.game);
      li.append(name, level, time, mini);
      this.layout.scoreList.append(li);
    });
  }

  showSolution() {
    for (let i = 0; i < this.currentGame.size; i++) {
      for (let j = 0; j < this.currentGame.size; j++) {
        this.cells[i][j].classList.remove("black");
        this.cells[i][j].classList.remove("cross");
        if (this.currentGame.field[i][j] === 1) {
          this.cells[i][j].classList.add("black");
        }
      }
    }
    this.layout.nonogramFieldCont.classList.add("disabled");
    clearInterval(this.interval);
  }
}

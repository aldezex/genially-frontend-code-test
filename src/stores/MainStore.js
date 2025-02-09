import { types } from "mobx-state-tree";
import uuid from "uuid/v4";
import { UndoManager } from "mst-middlewares";

import BoxModel from "./models/Box";
import getRandomColor from "../utils/getRandomColor";

const MainStore = types
  .model("MainStore", {
    boxes: types.array(BoxModel),
    selectedBoxes: types.array(types.reference(BoxModel)),
  })
  .actions((self) => {
    return {
      addBox() {
        const randomLeft = Math.floor(Math.random() * 1000);
        const randomTop = Math.floor(Math.random() * 475);

        const newBox = BoxModel.create({
          id: uuid(),
          color: getRandomColor(),
          left: randomLeft,
          top: randomTop,
        });

        self.boxes.push(newBox);

        self.saveState();
      },
      removeSelectedBoxes() {
        self.selectedBoxes.forEach((box) => {
          self.boxes.remove(box);
        });

        self.selectedBoxes.clear();

        self.saveState();
      },
      selectBox(box) {
        if (self.selectedBoxes.includes(box)) {
          self.selectedBoxes.remove(box);
        } else {
          self.selectedBoxes.push(box);
        }

        self.saveState();
      },
      changeSelectedBoxesColor(color) {
        self.selectedBoxes.forEach((box) => {
          box.color = color;
        });

        self.saveState();
      },
      updateBoxPosition(box, dx, dy) {
        box.left += dx;
        box.top += dy;

        self.saveState();
      },
      saveState() {
        const state = {
          boxes: self.boxes.toJSON(),
          selectedBoxes: self.selectedBoxes.map((box) => box.id),
        };

        localStorage.setItem("canvasState", JSON.stringify(state));
      },
      loadState() {
        const state = JSON.parse(localStorage.getItem("canvasState"));

        if (state) {
          self.boxes.replace(state.boxes);
          self.selectedBoxes.replace(
            state.selectedBoxes.map((id) =>
              self.boxes.find((box) => box.id === id),
            ),
          );
        }
      },
      afterCreate() {
        self.loadState();
      },
    };
  })
  .views((self) => ({
    get hasSelectedBoxes() {
      return self.selectedBoxes.length > 0;
    },
    get selectedBoxesCount() {
      return self.selectedBoxes.length;
    },
    get selectedBoxesColor() {
      if (self.selectedBoxes.length === 0) {
        return "#000000";
      }

      return self.selectedBoxes[0].color;
    },
    isBoxSelected(box) {
      return self.selectedBoxes.includes(box);
    },
  }));

const store = MainStore.create();

const undoManager = UndoManager.create({}, { targetStore: store });

store.undo = () => undoManager.undo();
store.redo = () => undoManager.redo();
store.canUndo = () => undoManager.canUndo;
store.canRedo = () => undoManager.canRedo;

export default store;

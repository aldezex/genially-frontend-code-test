import { types } from "mobx-state-tree";
import uuid from "uuid/v4";
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
      },
      removeSelectedBoxes() {
        self.selectedBoxes.forEach((box) => {
          self.boxes.remove(box);
        });

        self.selectedBoxes.clear();
      },
      selectBox(box) {
        if (self.selectedBoxes.includes(box)) {
          self.selectedBoxes.remove(box);
        } else {
          self.selectedBoxes.push(box);
        }
      },
      changeSelectedBoxesColor(color) {
        self.selectedBoxes.forEach((box) => {
          box.color = color;
        });
      },
      updateBoxPosition(box, dx, dy) {
        box.left += dx;
        box.top += dy;
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

const box1 = BoxModel.create({
  id: uuid(),
  color: getRandomColor(),
  left: 0,
  top: 0,
});

store.addBox(box1);

export default store;

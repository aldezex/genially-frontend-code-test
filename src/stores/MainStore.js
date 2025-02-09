import { types } from "mobx-state-tree";
import uuid from "uuid/v4";
import BoxModel from "./models/Box";
import getRandomColor from "../utils/getRandomColor";

const MainStore = types
  .model("MainStore", {
    boxes: types.array(BoxModel),
    selectedBox: types.maybeNull(types.reference(BoxModel)),
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
      removeSelectedBox() {
        if (self.selectedBox) {
          self.boxes.remove(self.selectedBox);
          self.selectedBox = null;
        }
      },
      selectBox(box) {
        self.selectedBox = box;
      },
      changeSelectedBoxColor(color) {
        if (self.selectedBox) {
          self.selectedBox.color = color;
        }
      },
    };
  })
  .views((self) => ({
    get hasSelectedBox() {
      return self.selectedBox !== null;
    },
    get selectedBoxColor() {
      if (self.selectedBox) {
        return self.selectedBox.color;
      }

      return "#000000";
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

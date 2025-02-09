import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import interact from "interactjs";

import Box from "../components/Box";

function getBox(target, store) {
  const index = Array.from(document.querySelectorAll(".box")).indexOf(target);
  return store.boxes[index];
}

function Canvas({ store }) {
  useEffect(() => {
    interact(".box").draggable({
      inertia: false,
      modifiers: [],
      listeners: {
        start: (event) => {
          const box = getBox(event.target, store);

          if (!store.isBoxSelected(box)) {
            store.selectBox(box);
          }
        },
        move: (event) => {
          store.selectedBoxes.forEach((box) => {
            store.updateBoxPosition(box, event.dx, event.dy);
          });
        },
        end: (event) => {
          const box = getBox(event.target, store);

          if (!store.isBoxSelected(box)) {
            store.selectBox(box);
          }
        },
      },
    });
  }, [store]);

  return (
    <div className="canva">
      {store.boxes.map((box, index) => (
        <Box
          id={box.id}
          key={index}
          color={box.color}
          left={box.left}
          top={box.top}
          width={box.width}
          height={box.height}
          box={box}
          store={store}
        />
      ))}
    </div>
  );
}

export default observer(Canvas);

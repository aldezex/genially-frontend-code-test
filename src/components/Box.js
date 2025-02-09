import React from "react";
import { observer } from "mobx-react";
import BoxDraggable from "./BoxDraggable";

function Box(props) {
  function handleClick() {
    props.store.selectBox(props.box);
  }

  const isSelected = props.store.selectedBox === props.box;

  return (
    <BoxDraggable {...props} onClick={handleClick}>
      <div
        style={{
          border: isSelected ? "2px solid blue" : "none",
        }}
      >
        Box
      </div>
    </BoxDraggable>
  );
}

export default observer(Box);

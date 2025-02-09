import React from "react";
import { observer } from "mobx-react";
import BoxDraggable from "./BoxDraggable";

function Box(props) {
  function handleClick(event) {
    props.store.selectBox(props.box);
  }

  const isSelected = props.store.isBoxSelected(props.box);

  return (
    <BoxDraggable {...props} selected={isSelected} onClick={handleClick}>
      <div>Box</div>
    </BoxDraggable>
  );
}

export default observer(Box);

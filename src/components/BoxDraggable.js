import React from "react";
import { observer } from "mobx-react";

function BoxDraggable(props) {
  return (
    <div
      {...props}
      id={props.id}
      className="box"
      style={{
        backgroundColor: props.color,
        width: props.width,
        height: props.height,
        transform: `translate(${props.left}px, ${props.top}px)`,
        ...(props.selected && { border: "2px solid red" }),
      }}
    >
      {props.children}
    </div>
  );
}

export default observer(BoxDraggable);

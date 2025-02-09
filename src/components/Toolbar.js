import React from "react";
import { observer } from "mobx-react";
import store from "../stores/MainStore";

function Toolbar() {
  return (
    <div className="toolbar">
      <button onClick={store.addBox}>Add Box</button>
      <button
        onClick={() => {
          store.removeSelectedBoxes();
        }}
        disabled={!store.hasSelectedBoxes}
      >
        {store.selectedBoxesCount < 2 ? "Remove Box" : "Remove Boxes"}
      </button>
      <input
        type="color"
        value={store.selectedBoxesColor}
        onChange={(e) => {
          store.changeSelectedBoxesColor(e.target.value);
        }}
        disabled={!store.hasSelectedBoxes}
      />
      <span>
        {store.selectedBoxesCount === 0
          ? "No boxes selected"
          : `${store.selectedBoxesCount} box${store.selectedBoxesCount > 1 ? "es" : ""} selected`}
      </span>
    </div>
  );
}

export default observer(Toolbar);

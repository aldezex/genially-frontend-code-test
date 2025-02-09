import React from "react";
import { observer } from "mobx-react";
import store from "../stores/MainStore";

function Toolbar() {
  return (
    <div className="toolbar">
      <button>Add Box</button>
      <button
        onClick={() => {
          store.removeSelectedBox();
        }}
        disabled={!store.hasSelectedBox}
      >
        Remove Box
      </button>
      <input type="color" />
      <span>
        {store.hasSelectedBox ? "1 box selected" : "No boxes selected"}
      </span>
    </div>
  );
}

export default observer(Toolbar);

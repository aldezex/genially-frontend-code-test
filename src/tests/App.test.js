import React from "react";
import { screen, render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../components/App";
import store from "../stores/MainStore";

test("renders the app", () => {
  render(<App />);
  expect(screen.getByText("Add Box")).toBeInTheDocument();
});

describe("Adding, selecting and removing boxes", () => {
  afterEach(() => {
    store.clear();
  });

  test("adds a box when the button is clicked", () => {
    render(<App />);
    userEvent.click(screen.getByText("Add Box"));
    expect(screen.getByText("Box")).toBeInTheDocument();
  });

  test("selects a box when it is clicked", () => {
    render(<App />);
    userEvent.click(screen.getByText("Add Box"));
    userEvent.click(screen.getByText("Box"));
    expect(screen.getByText("1 box selected")).toBeInTheDocument();
  });

  test("removes a box when the button is clicked", () => {
    render(<App />);
    userEvent.click(screen.getByText("Add Box"));
    userEvent.click(screen.getByText("Box"));
    userEvent.click(screen.getByText("Remove Box"));
    expect(screen.getByText("No boxes selected")).toBeInTheDocument();
  });

  test("removes multiple boxes when the button is clicked", () => {
    render(<App />);
    userEvent.click(screen.getByText("Add Box"));
    userEvent.click(screen.getByText("Add Box"));

    document.querySelectorAll(".box").forEach((box) => userEvent.click(box));

    userEvent.click(screen.getByText("Remove Boxes"));
    expect(screen.getByText("No boxes selected")).toBeInTheDocument();
  });
});

//describe("Drag 'n' drop", () => {
//  afterEach(() => {
//    store.clear();
//  });
//
//  test("drags a box", () => {
//    render(<App />);
//    userEvent.click(screen.getByText("Add Box"));
//    const box = screen.getByText("Box");
//
//    fireEvent.mouseDown(box, { clientX: 0, clientY: 0 });
//    fireEvent.mouseMove(box, { clientX: 100, clientY: 100 });
//    expect(box).toHaveStyle("transform: translate(100px, 100px)");
//  });
//});

describe("Undo / Redo", () => {
  afterEach(() => {
    store.clear();
  });

  test("undos the last action", () => {
    render(<App />);
    userEvent.click(screen.getByText("Add Box"));
    userEvent.click(screen.getByText("Box"));
    userEvent.click(screen.getByText("Remove Box"));
    userEvent.click(screen.getByText("Undo"));
    expect(screen.getByText("Box")).toBeInTheDocument();
  });

  test("redos the last undone action", () => {
    render(<App />);
    userEvent.click(screen.getByText("Add Box"));
    userEvent.click(screen.getByText("Box"));
    userEvent.click(screen.getByText("Remove Box"));
    userEvent.click(screen.getByText("Undo"));
    userEvent.click(screen.getByText("Redo"));
    expect(screen.getByText("No boxes selected")).toBeInTheDocument();
  });
});

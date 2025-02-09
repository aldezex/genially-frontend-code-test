Álvaro Hernández Expósito, 9 febrero 2025.

# Setup

Setting up the project was a little bit *tricky*, since we have a `package-lock` and a `yarn-lock`, so I had to dig into the commits to see which one was more updated and [I found](https://github.com/aldezex/genially-frontend-code-test/commit/f14e3bbf7d98291460a12f523e1b814591384832#diff-053150b640a7ce75eff69d1a22cae7f0f94ad64ce9a855db544dda0929316519) that the project was created using `yarn` but *developed* using `npm`, so I ran:

```jsx
npm ci
```

Well, I’m using node 22, and this project was *old* so it has the `lockfileVersion` 1, then I had to upgrade it but nevermind, `npm` takes care for us, but again, I can’t use `npm ci`, so let’s go ahed and do the *always-valid-but-not-always-recommended* `npm i`.

![Let’s just not worry, is just a test.](attachment:30737b38-49a7-4491-be63-946ee3dfebdc:Captura_de_pantalla_2025-02-09_a_las_16.26.55.png)

Let’s just not worry, is just a test.

And… it doesn’t work.

Maybe I should try an older node version.

EDIT: with node 16 and npm 8 it’s working, even thought it’s giving some warnings.

# Test

Full disclosure: it’s been years since I touched mobx, so everything it’s implemented in the best way it resonated in my mind. You can find every commit with every change next to it’s title.

Let’s go.

## Removing boxes [(commit)](https://github.com/aldezex/genially-frontend-code-test/commit/20bf390c097c998fcb506751ef3ec1a4ce83543c)

We needed to show in a few places that we have a box selected, so the fastest way to me it was creating a new *store property, `selectedBox` :`types.maybeNull(types.reference(BoxModel))`*

Also, along with it, I created a two new actions:

1. `removeSelectedBox`: to remove `self.selectedBox`
2. `selectedBox`: self explanatory

Also a new view: `hasSelectedBox`. It simply returns a boolean.

Since this is the first feature I’m doing, it needed a bit of setup that the next ones won’t need:

1. I needed to *prop-drill* the store down to `Box` from `Canvas`

Next, thanks to being able to access the store from `Box`, the next steps where easier:

1. `handleClick`: a very generic name, I know, but it takes care of calling `props.store.selectBox(props.box)`. It’s all we need.
2. `isSelected`: just to know whether **that** box is selected.

Now that we know if it’s selected, we can put a nice border to identify which one is selected.

We pass the function to `BoxDraggable`, we spread the props and done!

![Captura de pantalla 2025-02-09 a las 17.01.14.png](attachment:83b899b6-96ce-4400-9381-77ae2b42f9a5:Captura_de_pantalla_2025-02-09_a_las_17.01.14.png)

To show it on the toolbar, we can import the store and conditionally show if we have a box checked or not. Also, we need to disable (or enable) the button based on that condition too, and attach our `store.removeSelectedBox()`.

## Changing box color [(commit)](https://github.com/aldezex/genially-frontend-code-test/commit/24d49bb9c782ba667c5c30d3b979787ed3b52194)

Okay, with our setup done, this feature was easier.

1. `changeSelectedBoxColor` is an action that will help us changing the color to our selected box.
2. Our view `selectedBoxColor` simply returns the color of our box or black in case no box is selected.
3. We change our input:
    1. It’s value is `store.selectedBoxColor`
    2. We pass to `store.changeSelectedBoxColor` it’s value
    3. We disable it if nothing it’s selected.
4. Done!

## Adding boxes [(commit)](https://github.com/aldezex/genially-frontend-code-test/commit/527fc3dc6608e7b4e3049cf4749c318216b592db)

This was fun, since I chose to spawn boxes at random positions assuming the canvas proportions. Also, I reworked the action and the first box also spawns at random.

1. `addBox (action)`  spawns a new Box.
2. Add box (button) has attached `store.addBox`  and it’s in charge of firing up the action.

The visual clue that indicates that our box is selected wasn’t enough at this point, so I changed it too (the good old border red).

## Rework [(commit)](https://github.com/aldezex/genially-frontend-code-test/commit/093cf1f75ee6cdb0cb891a3c3752b2ce0a641258)

Since we have now basic features, we need to do a few refactors:

1. We should be able to select more than one box.
2. We should be able to change the color to one or more boxes.
3. We should be able to remove the entire selection.

And so on. Let’s do that before jumping into dragging.

## Dragging [(commit)](https://github.com/aldezex/genially-frontend-code-test/commit/726501866c94c8bccbb19a785836dc9fe55486e2)

This implementation has a bug on which I’ll talk later. Overall, it’s working and it’s fine, `interactjs` works like a charm. It was easy to implement and very straight forward, we only needed a new action `updateBoxPosition` to receive the box and the new coordinates.

Now, the bug.

The implementation lives inside `Canvas.js` and for the test that’s fine, but would be easier to micromanage inside every draggable.

If we select two boxes and drag them around the canvas, the box we clicked will be unselected at the end of the action, that’s the bug.

One way to resolve it (and the fastest) would be preventing the default behaviour of the click if we check previously that the box is selected, but I wanted to continue with the test and tackle it later.

EDIT: I didn’t, it’s the only known bug (by me) in the test.

## Persisting the state locally [(commit)](https://github.com/aldezex/genially-frontend-code-test/commit/75219161675c60c307e678d3c48abedade1b53bb)

This feature was easier than I thought. We created three new actions (well, really two because `afterCreate` is a lifecycle hook from mobx and it’s in charge of calling our `loadState`.

Both actions are self explanatory:

`saveState`: converts our store to JSON and saves it in the local storage, simple.

`loadState`: it gave me a little headache because I tried to replace all at once but the selectedBoxes needed to reference the actual existing boxes so I couldn’t do it all at once, so I needed to map their ids. But nothing serious.

Now, every action calls `saveState` and `afterCreate` like I said, calls `loadState`.

## Time travelling [(commit)](https://www.notion.so/Genially-Frontend-Test-195d4221d61a80db8766d4681f972801?pvs=21)

The project had installed `mst-middlewares` so a look [to the docs](https://mobx-keystone.js.org/api/classes/undomanager) made everything easier.

```jsx
const undoManager = UndoManager.create({}, { targetStore: store });

store.undo = () => undoManager.undo();
store.redo = () => undoManager.redo();
store.canUndo = () => undoManager.canUndo;
store.canRedo = () => undoManager.canRedo;
```

## Testing [(commit)](https://github.com/aldezex/genially-frontend-code-test/commit/edc9d317bca5072dfda063f5244b10fc17785b94)

Well, the project comes with unit tests for each feature, so `npm run test` should run each one and show a green screen.

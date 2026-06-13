# kaplay-layout

implements a flexboxs (and possibly grids?) in kaplay
using the [Yoga layout engine](https://github.com/react/yoga).

## installation

install the NPM library.

```sh
npm install kaplay-layout
```

and then initialize the plugin.

```typescript
import kaplay from "kaplay"
import kaplayLayout from "kaplay-layout"

export const k = kaplay({
  global: false,
  plugins: [await kaplayLayout()],
})
```

## usage

kaplay-layout is designed to be as intuitive as possible.

```typescript
// add a flexbox to the scene
const parent = k.add([
  k.pos(),
  // use rect as a background.
  // you may omit this.
  k.rect(0, 0),
  k.flex(),
])

// add a static child to the parent
// static means its size is not controlled by the plugin.
// it won't grow or shrink.
parent.add([k.pos(), k.rect(20, 20), k.static()])

// add another child to the parent
// it will be placed next to the previous child
const box = parent.add([k.pos(), k.rect(20, 20), k.static()])

// then you can just change the static object size!
// and the flexbox will grow accordingly.
k.onClick(() => {
  box.width += 4
  box.width += 4
})
```

do note that layout calculations happens during updates.
that means you can't read object sizes instantly after they are added to the scene.
this is to prevent unnecessary calculations.
though you can force a calculation imediately using `calculateLayout`.

since kaplay-layout only uses position under the hood.
scale, rotation, shaders, anchors etc. (should) just works!

```typescript
const parent = k.add([
  k.pos(),
  k.flexbox(),
  k.scale(1.1)
])
const nested = parent.add([
  k.flexbox(),
  k.pos(),
  k.rotate(45),
  k.anchor("center"),
])
nested.add([
  k.pos(),
  k.static(),
  k.text("it just works!")
])
```

(hint: you should always use `pos` to avoid edge cases
even if `flexbox` works without them)

percent lentghs and every flexbox properties also works.

```typescript
const parent = k.add([
    k.pos(),
    k.rect(0, 0),
    k.outline(1),
    k.flexbox({
        minWidth: 100,
        padding: 10,
        minHeight: 100,
        flexDirection: "row",
        justifyContent: "start"
        alignItem: "strech"
    })
])
parent.add([
    k.pos(),
    k.rect(0, 0),
    k.outline(1),
    k.flexbox({
        maxHeight: "20%",
        flex: 1,
    })
])
```

## documentation

check out the documentation at TODO

## textbox?

I planned to add align baseline and proper text support... soon.
bear with me a little.

## grids?

[taffy](https://github.com/DioxusLabs/taffy) is a layout engine that supports
both grids and flexboxes. but it doesn't have an _offical_ WASM bindings right now.

I'm definitely not learning rust just to port it over to JS.
but when it finally does, I'll migrate over to it.
I promise that the API won't change too much.

## contribute

feel free to submit things (do try to format them proper though).

clone the repo and then install the dependencies,

```sh
git clone https://github.com/hinum/kaplay-layout.git
cd ./kaplay-layout
npm install
```

to build the repo run,

```sh
npm run build
```

to run the tests run, (you need to have a browser installed ofc)

```sh
npm run test
```

to build and optionally preview the documentation run,

```sh
npm run docs
npm run docs:preview
```

# Changelog

## 1.4.0

- Add serialization APIs
- Add `Vertices.toNumbers`
- Rename `Vertices.fromArray` `Vertices.fromNumbers`
- Update deps

## 1.3.0

- Add `clearChildNodes` to `CanvasNode`

## 1.2.0

- Add `locate` method
- Add `afterLocating` hook

## 1.1.1

- Update `3h-event` to `0.4.1`

## 1.1.0

- Update Animation APIs

## 1.0.0

- Version bump

## 0.39.1

- Fix text shadow

## 0.39.0

- Add `autoStyle` option to `Renderer`

## 0.38.0

- Add `autoInitialize` option to `Renderer`
- Add `renderer.scaleX/Y`

## 0.37.0

- Replace old `position` with `offsetMode`
- Add new `position` vector
- Add `polygonNode.containsPoint`
- Add more root-related options
- Improve docs

## 0.36.0

- Add `stretch` option to `CanvasNode`
- Add `align` option to `AlignNode`

## 0.35.0

- Add `Vector.distance`

## 0.34.1

- Fix option overriding
- Fix `Vertices.fromArray`
- Fix calculation of polygon bounds

## 0.34.0

- Add `canvasNode.offset`
- Replace `polygonNode._originX/Y` with `polygonNode.origin`

## 0.33.0

- Add `select*` to `CanvasNode`

## 0.32.0

- Make layout offset public to avoid type hacks
- Improve docs

## 0.31.2

- Fix `vector.projectVector`

## 0.31.1

- Fix some property overriding

## 0.31.0

- Adjust tick procedures
- Add `ScrollNodeEvents`
- Fix some docs
- Fix generic types

## 0.30.0

- Add `vector.isZero()`
- Add `scale` option to `vector.addVector` & `vector.subVector`

## 0.29.0

- Add `vector.set` & `vector.setVector`
- Fix an internal file name

## 0.28.0

- Add `smartUpdate` to `CanvasNode`
- Fix some docs

## 0.27.0

- Change vertex type to `Vector`

## 0.26.0

- Add more vector-related APIs

## 0.25.2

- Fix type of `tag` property

## 0.25.1

- Move `3h-event` to `dependences` to fix type errors

## 0.25.0

- Add `Vector` & `Vertices`
- Add `PolygonNode`
- Add `smartSize` option to shapes
- Remove `rectNode.pendingSize`
- Improve image size defaults

## 0.24.1

- Fix tick loop

## 0.24.0

- Add identity APIs

## 0.23.0

- Remove `canvasNode.setListeners`
- Extract `animate` from `CanvasNode`
- Update `3h-event` to `0.4.0`
- Fix layout offset effect
- Improve some docs

## 0.22.0

- Add `pendingSize` to `RectNode`
- Replace `autoStretch` with `stretchX` & `stretchY`
- Fix text rendering
- Fix some docs

## 0.21.0

- Add `autoStretch` to `CanvasNode`
- Add `getRoot` to `CanvasNode`
- Make `root` optional in `AnimateOptions`
- Modify style inheritability

## 0.20.0

- Rename `canvasNode.visibility` `canvasNode.visible`
- Add animation APIs
- Add asynchronous update/render
- Add time stamp to update callbacks
- Fix error types

## 0.19.0

- Add `ImageNode`
- Add `Schedule`

## 0.18.0

- Add `ScrollNode`
- Fix style computing
- Fix some type issues

## 0.17.0

- Update `3h-event` and fix type confusion

## 0.16.1

- Fix background rendering

## 0.16.0

- Rewrite

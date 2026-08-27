import assert from "node:assert/strict";

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

globalThis.CONST = {GRID_TYPES: {GRIDLESS: 0, SQUARE: 1}};
globalThis.PIXI = {Point};
globalThis.canvas = {
	grid: {
		type: CONST.GRID_TYPES.SQUARE,
		isHexagonal: false,
		sizeX: 100,
		sizeY: 100,
		getTopLeftPoint({i, j, x, y}) {
			if (i !== undefined && j !== undefined) return {x: i * 100, y: j * 100};
			return {x: Math.floor(x / 100) * 100, y: Math.floor(y / 100) * 100};
		},
		getCenterPoint({x, y}) {
			return {x: Math.floor(x / 100) * 100 + 50, y: Math.floor(y / 100) * 100 + 50};
		},
		getOffset({x, y}) {
			return {i: Math.floor(x / 100), j: Math.floor(y / 100)};
		},
	},
};

const coordinates = await import("../js/foundry_fixes.js");
const utility = await import("../js/util.js");

assert.deepEqual(coordinates.getPixelsFromGridPosition(2, 3), [300, 200]);
assert.deepEqual(coordinates.getGridPositionFromPixels(250, 350), [3, 2]);
assert.deepEqual(coordinates.getPixelsFromGridPositionObj({x: 2, y: 3}), {x: 300, y: 200});
assert.deepEqual(coordinates.getGridPositionFromPixelsObj({x: 250, y: 350}), {x: 3, y: 2});
assert.deepEqual(coordinates.getCenterFromGridPositionObj({x: 2, y: 3}), {x: 350, y: 250});

const snapped = utility.getSnapPointForTokenDataObj({x: 110, y: 210}, {width: 1, height: 1});
assert.deepEqual(snapped, new Point(150, 250));

console.log("V14 grid-adapter smoke test passed.");

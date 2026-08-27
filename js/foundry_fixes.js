// Coordinate conversion helpers that preserve RoutingLib's x/y convention across grid types.

// https://gitlab.com/foundrynet/foundryvtt/-/issues/4705
export function getPixelsFromGridPosition(xGrid, yGrid) {
	const coordinate = canvas.grid.getTopLeftPoint({i: xGrid, j: yGrid});
	if (canvas.grid.type !== CONST.GRID_TYPES.GRIDLESS) {
		return [coordinate.y, coordinate.x];
	}
	return [coordinate.x, coordinate.y];
}

// https://gitlab.com/foundrynet/foundryvtt/-/issues/4705
export function getGridPositionFromPixels(xPixel, yPixel) {
	const offset = canvas.grid.getOffset({x: xPixel, y: yPixel});
	const x = offset.i;
	const y = offset.j;
	if (canvas.grid.type !== CONST.GRID_TYPES.GRIDLESS) return [y, x];
	return [x, y];
}

export function getGridPositionFromPixelsObj(o) {
	const [x, y] = getGridPositionFromPixels(o.x, o.y);
	return {x, y};
}

export function getPixelsFromGridPositionObj(o) {
	const [x, y] = getPixelsFromGridPosition(o.x, o.y);
	return {x, y};
}

export function getCenterFromGridPositionObj(o) {
	const result = getPixelsFromGridPositionObj(o);
	const center = canvas.grid.getCenterPoint({x: result.x, y: result.y});
	result.x = center.x;
	result.y = center.y;
	return result;
}

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const manifestPath = path.join(root, "module.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const failures = [];
const check = (condition, message) => {
	if (!condition) failures.push(message);
};

const supportedManifestKeys = new Set([
	"id",
	"title",
	"description",
	"version",
	"compatibility",
	"authors",
	"esmodules",
	"url",
	"download",
	"manifest",
	"readme",
	"changelog",
	"bugs",
]);

for (const key of Object.keys(manifest)) {
	check(supportedManifestKeys.has(key), `Unexpected manifest key: ${key}`);
}
check(manifest.id === "routinglib", "Manifest id must remain routinglib.");
check(manifest.version === "1.1.1", "Manifest version must be 1.1.1.");
check(manifest.compatibility?.minimum === "12", "Minimum core version must be 12.");
check(manifest.compatibility?.verified === "14.367", "Verified core version must be 14.367.");
check(!("allowBugReporter" in manifest), "allowBugReporter must not be present.");
check(manifest.manifest === "https://raw.githubusercontent.com/tatsumasagc/foundryvtt-routinglib/develop/module.json", "Manifest URL must point to this fork.");
check(manifest.download === "https://github.com/tatsumasagc/foundryvtt-routinglib/releases/download/v1.1.1/routinglib-1.1.1.zip", "Download URL must point to the v1.1.1 release.");

const sourcePaths = [
	"js/cache.js",
	"js/foundry_fixes.js",
	"js/main.js",
	"js/pathfinder.js",
	"js/util.js",
].map(relativePath => path.join(root, relativePath));
const source = sourcePaths.map(file => fs.readFileSync(file, "utf8")).join("\n");

const removedPatterns = [
	[/canvas\.grid\.grid/, "canvas.grid.grid"],
	[/canvas\.grid\.isHex(?!agonal)/, "canvas.grid.isHex"],
	[/canvas\.grid\.w(?![a-zA-Z])/, "canvas.grid.w"],
	[/canvas\.grid\.h(?![a-zA-Z])/, "canvas.grid.h"],
	[/canvas\.grid\.getCenter\(/, "canvas.grid.getCenter"],
	[/canvas\.grid\.getTopLeft\(/, "canvas.grid.getTopLeft"],
	[/canvas\.grid\.diagonalRule/, "canvas.grid.diagonalRule"],
	[/canvas\.grid\.getGridPositionFromPixels\(/, "canvas.grid.getGridPositionFromPixels"],
	[/canvas\.grid\.getPixelsFromGridPosition\(/, "canvas.grid.getPixelsFromGridPosition"],
	[/canvas\.grid\.getNeighbors\(/, "canvas.grid.getNeighbors"],
];
for (const [pattern, label] of removedPatterns) {
	check(!pattern.test(source), `Removed or legacy grid API remains: ${label}`);
}

const requiredV14Patterns = [
	"canvas.grid.getTopLeftPoint",
	"canvas.grid.getOffset",
	"canvas.grid.getCenterPoint",
	"canvas.grid.getAdjacentOffsets",
	"canvas.grid.isHexagonal",
	"canvas.grid.columns",
	"canvas.grid.even",
	"canvas.grid.sizeX",
	"canvas.grid.sizeY",
	"canvas.grid.diagonals === CONST.GRID_DIAGONALS.ALTERNATING_1",
];
for (const pattern of requiredV14Patterns) {
	check(source.includes(pattern), `Expected V14 API usage is missing: ${pattern}`);
}

if (failures.length) {
	console.error("V14 validation failed:");
	for (const failure of failures) console.error(`- ${failure}`);
	process.exit(1);
}

console.log("Manifest and V14 grid API validation passed.");

# routinglib v1.1.3

This maintenance release removes the unsupported `allowBugReporter` key from `module.json`, resolving Foundry VTT’s manifest warning.

The release also migrates RoutingLib’s legacy grid coordinate, grid sizing, hex-orientation, neighbor, and diagonal-rule calls to the public Grid API introduced in Foundry VTT v12. It replaces the legacy global `VisionSource` constructor with the documented `CONFIG.Canvas.visionSourceClass` used by the V14 collision backend. The manifest now declares Foundry VTT v14.367 as the verified core version, with v12 as the minimum supported core version. Its update-manifest URL resolves through the current GitHub release asset, avoiding stale branch-file delivery from GitHub’s raw-content CDN.

Validation included JavaScript syntax checks, manifest and deprecated-API regression checks, a V14 API-shaped coordinate/snap smoke test, whitespace validation, and ZIP archive integrity testing.

# Leaflet.themeControls

A set of themeControls that extend the Leaflet native controls, and also additional controls, to modify the shape of user interface according to a predefined theme. A themControl is a one whose on-screen shape can be selected by the associated css files and images provided.

## Control Class Hierarchy

| Class / Constructor | Factory function | Description |
| --------------------|------------------|-------------|
L.Control
	L.Control.Attribution				L.control.attribution
		L.ThemeAttributionControl			L.themeAttributionControl

	L.Control.Layers					L.control.layers
		L.ThemeLayersControl				L.themeLayersControl

	L.Control.Scale						L.control.scale

	L.Control.Zoom						L.control.zoom
		L.ThemeZoomControl				L.themeZoomControl
		
	L.Control.Screen					L.control.screen
		L.ThemeScreenControl				L.themeScreenControl
		
	L.Control.Bookmark					L.control.bookmark
		L.ThemeBookmarkControl			L.themeBookmarkControl
		
	L.Control.MessageBox				L.control.messageBox
		
	L.Control.Theme						L.control.theme

# Leaflet.themeControls

A set of **themeControls** that extend the Leaflet native controls, and other additional controls, in order to modify the on-screen shape of the control as defined by the associated css and image files provided.

## Control Class Hierarchy

| Class / Constructor                   | Factory function            | Description            | 
|---------------------------------------|-----------------------------|:----------------------:|
| `L.Control`                           |                             |                        |
| >>> `L.Control.Attribution`           | `L.control.attribution`     | Leaflet native control |
| >>>>>> `L.ThemeAttributionControl`    | `L.themeAttributionControl` | **themeControl**       |
| >>> `L.Control.Layers`                | `L.control.layers`          | Leaflet native control |
| >>>>>> `L.ThemeLayersControl`         | `L.themeLayersControl`      | **themeControl**       |
| >>> `L.Control.Zoom`                  | `L.control.zoom`            | Leaflet native control |
| >>>>>> `L.ThemeZoomControl`           | `L.themeZoomControl`        | **themeControl**       |
| >>> `L.Control.Screen`                | `L.control.screen`          | Additional control     |
| >>>>>> `L.ThemeScreenControl`         | `L.themeScreenControl`      | **themeControl**       |
| >>> `L.Control.Bookmark`              | `L.control.bookmark`        | Additional control     |
| >>>>>> `L.ThemeBookmarkControl`       | `L.themeBookmarkControl`    | **themeControl**       |
| >>> `L.Control.MessageBox`            | `L.control.messageBox`      | Additional control     |
| >>>>>> `L.ThemeMessageBox`            | `L.themeMessageBox`         | **themeControl**       |
| >>> `L.Control.Theme`                 | `L.control.theme`           | **themeControl**       |

## Usage

In order to use this plugin, include the essential JS and CSS in your page as follows:
```
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <link rel="stylesheet" type="text/css" href="src/css/theme-egy-leaflet-controls.css" />

        <script type="text/javascript" src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <script type="text/javascript" src="src/theme-leaflet-controls.js"></script>
    </head>
```

## Supported Leaflet Versions


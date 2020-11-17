(function(global, factory){
	if(typeof exports === 'object' && typeof module !== 'undefined')
		factory(exports);
	else
		if(typeof define === 'function' && define.amd)
			define(['exports'], factory);
	else
		factory(global.L);
}(this, function(exports){ 'use strict';

/* Theme Zoom Control */
var ThemeZoomControl = L.Control.Zoom.extend({
	options: {
		className: ''
	},
	initialize: function(options){
		L.Util.setOptions(this, options);
	},
	_createButton: function (html, title, className, container, fn) {

		var link = L.Control.Zoom.prototype._createButton.call(this, html, title, className, container, fn);
		var classes;

		if(this.options.className){
			if(L.DomUtil.hasClass(link, 'leaflet-control-zoom-in'))
				L.DomUtil.removeClass(link, 'leaflet-control-zoom-in');

			if(L.DomUtil.hasClass(link, 'leaflet-control-zoom-out'))
				L.DomUtil.removeClass(link, 'leaflet-control-zoom-out');

			L.DomUtil.removeClass(container, 'leaflet-bar');
			L.DomUtil.removeClass(container, 'leaflet-control-zoom');
			L.DomUtil.addClass(container, this.options.className);
		}
		else{
			classes = L.DomUtil.getClass(container).split(' ');

			for(var i = 0; i < classes.length; i++){
				L.DomUtil.removeClass(container, classes[i]);
			}

			if(!L.DomUtil.hasClass(container, 'leaflet-control'))
				L.DomUtil.addClass(container, 'leaflet-control');

			if(!L.DomUtil.hasClass(container, 'leaflet-bar'))
				L.DomUtil.addClass(container, 'leaflet-bar');

			if(!L.DomUtil.hasClass(container, 'leaflet-control-zoom'))
				L.DomUtil.addClass(container, 'leaflet-control-zoom');
		}
		return link;
	},
	update: function(){
		var className = 'leaflet-control-zoom', options = this.options;

		L.DomUtil.remove(this._zoomInButton);
		L.DomUtil.remove(this._zoomOutButton);

		this._zoomInButton  = this._createButton(options.zoomInText,  options.zoomInTitle, className + '-in',  this._container, this._zoomIn);
		this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle, className + '-out', this._container, this._zoomOut);

		this._updateDisabled();

		return this._container;
	}
});

var themeZoomControl = function (options){
	return new ThemeZoomControl(options);
};

/* Theme Layers Control */
var ThemeLayersControl = L.Control.Layers.extend({
	options: {
		onhover: false,
		mutual: true,
		title: '',
	},
	initialize: function(baseLayers, overlays, options){
		L.Control.Layers.prototype.initialize.call(this, baseLayers, overlays, options);
	},
	onAdd: function (map) {
		var r = L.Control.Layers.prototype.onAdd.call(this, map);

		if (this.options.collapsed) {
			if (!L.android)
				if(!this.options.onhover)
					L.DomEvent.off(this._container, {mouseenter: this.expand, mouseleave: this.collapse}, this);
			this.collapse();
		}else
			this.expand();

		return r;
	},
	_initLayout: function () {
		L.Control.Layers.prototype._initLayout.call(this);
		this._layersLink.title = this.options.title || 'Layers' ;
		this._customClass = [];
		return;
	},
	_onInputClick: function (e) {
		if(!this.options.mutual){
			L.Control.Layers.prototype._onInputClick.call(this);
			return;
		}

		var inputs = this._layerControlInputs, input, layer;
		var addedLayers = [], removedLayers = [];

		this._handlingClick = true;

		for (var i = inputs.length - 1; i >= 0; i--) {
			input = inputs[i];
			layer = this._getLayer(input.layerId).layer;

			if(input.type === 'checkbox' && e.currentTarget.type === 'checkbox' && e.currentTarget !== input){
				removedLayers.push(layer);
				if(input.checked) input.checked = false;
			}
			else
				input.checked ? addedLayers.push(layer) : removedLayers.push(layer);
		}
		for (i = 0; i < removedLayers.length; i++) {
			if (this._map.hasLayer(removedLayers[i])) {
				this._map.removeLayer(removedLayers[i]);
			}
		}
		for (i = 0; i < addedLayers.length; i++) {
			if (!this._map.hasLayer(addedLayers[i])) {
				this._map.addLayer(addedLayers[i]);
			}
		}
		this._handlingClick = false;
		this._refocusOnMap();
	},
	expand: function(){
		var container = this._container,
			link = this._layersLink,
			form = this._form,
			baselayer = this._baseLayersList,
			overlay = this._overlaysList,
			separator = this._separator;

		if(this.options.className){
			if(this.options.className['link']){
				L.DomUtil.removeClass(link, this.options.className['link']);
			}
			if(this.options.className['form']){
				L.DomUtil.addClass(form, this.options.className['form']);

				container.style.background = 'none';
				container.style.border = 'none';
			}else{
				container.style.background = '#fff';
				container.style.border = '2px solid rgba(0,0,0,0.2)';
			}

			if(this.options.className['baselayer']){
				(baselayer) && L.DomUtil.addClass(baselayer, this.options.className['baselayer']);
			}

			if(this.options.className['overlay']){
				(overlay) && L.DomUtil.addClass(overlay, this.options.className['overlay']);
			}

			if(this.options.className['separator']){
				(separator) && L.DomUtil.addClass(separator, this.options.className['separator']);
			}
		}

		return L.Control.Layers.prototype.expand.call(this);
	},
	collapse: function(){
		var container = this._container,
			link = this._layersLink,
			form = this._form,
			baselayer = this._baseLayersList,
			overlay = this._overlaysList,
			separator = this._separator;

		if(this.options.className){
			if(this.options.className['link']){
				L.DomUtil.addClass(link, this.options.className['link']);

				container.style.background = 'none';
				container.style.border = 'none';
			}else{
				container.style.background = '#fff';
				container.style.border = '2px solid rgba(0,0,0,0.2)';
			}

			if(this.options.className['form']){
				L.DomUtil.removeClass(form, this.options.className['form']);
			}
			if(this.options.className['baselayer']){
				(baselayer) && L.DomUtil.removeClass(baselayer, this.options.className['baselayer']);
			}
			if(this.options.className['overlay']){
				(overlay) && L.DomUtil.removeClass(overlay, this.options.className['overlay']);
			}
			if(this.options.className['separator']){
				(separator) && L.DomUtil.removeClass(separator, this.options.className['separator']);
			}
		}
		return L.Control.Layers.prototype.collapse.call(this);
	},
	update: function(){
		var className = 'leaflet-control-layers';

		L.DomUtil.remove(this._layersLink);

		this._layersLink = L.DomUtil.create('a', className + '-toggle', this._container);
		this._layersLink.href = '#';
		this._layersLink.title = this.options.title || 'Layers';

		var formClass = L.DomUtil.getClass(this._form).split(' ');
		for(var i = 0; i < formClass.length; i++)
			(formClass[i] === 'leaflet-control-layers-list') || L.DomUtil.removeClass(this._form, formClass[i]);

		if (L.Browser.touch){
			L.DomEvent.on(this._layersLink, 'click', L.DomEvent.stop);
			L.DomEvent.on(this._layersLink, 'click', this.expand, this);
		}else{
			L.DomEvent.on(this._layersLink, 'click', this.expand, this);
		}
		this.collapse();
	}
});

var themeLayersControl = function(baseLayers, overlays, options){
	return new L.ThemeLayersControl(baseLayers, overlays, options);
}

/* Theme Attribution Control */
var ThemeAttributionControl = L.Control.Attribution.extend({
	options: {
		postfix: '',
		className: '',
		narrowScreen: 768,
	},
	initialize: function(options){
		L.Control.Attribution.prototype.initialize.call(this, options);
	},
	onAdd: function (map){
		map.attributionControl = this;
		this._map = map;
		var theClass = this.options.className || 'leaflet-control-attribution';

		this._container = L.DomUtil.create('div', theClass);

		L.DomEvent.disableClickPropagation(this._container);

		for (var i in map._layers) {
			if (map._layers[i].getAttribution) {
				this.addAttribution(map._layers[i].getAttribution());
			}
		}
		this._update();

		return this._container;
	},
	setPostfix: function (postfix) {
		this.options.postfix = postfix;
		this._update();
		return this;
	},
	_update: function(){
		L.Control.Attribution.prototype._update.call(this);

		if(this.options.postfix)
			if(this._container.innerHTML) 
				this._container.innerHTML += (' | ' + this.options.postfix);
			else
				this._container.innerHTML = this.options.postfix;
	},
	update: function(){
		var theClass = this.options.className || 'leaflet-control-attribution';
		var currentClasses = L.DomUtil.getClass(this._container).split(' ');

		for(var i = 0; i < currentClasses.length; i++)
			(currentClasses[i] === 'leaflet-control') || L.DomUtil.removeClass(this._container, currentClasses[i]);

		L.DomUtil.addClass(this._container, theClass);
	}
});

var themeAttributionControl = function (options){
	return new ThemeAttributionControl(options);
};

/* Screen Control */
var ScreenControl = L.Control.extend({
	options: {
		position: 'topleft',

		textFullScreen: {'false': '&#8280;', 'true': '&#8281;'},
		titleFullScreen: {'false': 'View Fullscreen', 'true': 'Exit Fullscreen'},

		singleButton: true,
	},
	initialize: function (options){
		L.Util.setOptions(this, options);
	},
	onAdd: function (map){
		var options = this.options;
		var className = 'leaflet-control-screen';

	    var container = L.DomUtil.create('div', className + ' leaflet-bar');

		this._fullScreenButton   = this._createButton(options.textFullScreen['true'], options.titleFullScreen['false'], className + '-full',  container, this._fullScreenButtonFn);

		this._windowScreenButton = this._createButton(options.textFullScreen['false'], options.titleFullScreen['true'], className + '-win', container, this._windowScreenButtonFn);

		this._map = map;
		this._update();
		map.on('fullscreenchange', this._update, this);

		return container;
	},
	onRemove: function (map){
		map.off('fullscreenchange', _update, this);
	},
	enable: function () {
		this._disabled = false;
		this._update();
		return this;
	},
	disable: function () {
		this._disabled = true;
		this._update();
		return this;
	},
	_fullScreenButtonFn: function(e){
		var map = this._map;

		if(!this._disabled && !map.isFullscreen())
			map.toggleFullscreen(this.options);
	},
	_windowScreenButtonFn: function(e){
		var map = this._map;

		if(!this._disabled && map.isFullscreen())
			map.toggleFullscreen(this.options);
	},
	_createButton: function (html, title, className, container, fn) {
		var link = L.DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		/*
		 * Will force screen readers like VoiceOver to read this as "Zoom in - button"
		 */
		link.setAttribute('role', 'button');
		link.setAttribute('aria-label', title);

		L.DomEvent.disableClickPropagation(link);
		L.DomEvent.on(link, 'click', L.DomEvent.stop);
		L.DomEvent.on(link, 'click', fn, this);
		L.DomEvent.on(link, 'click', this._refocusOnMap, this);

		return link;
	},
	_update: function () {
		var map = this._map, className = 'leaflet-disabled';

		L.DomUtil.removeClass(this._fullScreenButton, className);		// remove disabled class name
		L.DomUtil.removeClass(this._windowScreenButton, className);		// remove disabled class name

		if(this.options.singleButton){
			this._windowScreenButton.style.display = map.isFullscreen() ? 'block' : 'none';
			this._fullScreenButton.style.display = map.isFullscreen() ? 'none' : 'block';
			this._fullScreenButton.style.border = 'none';
		}

		if (this._disabled || !map.isFullscreen())
			L.DomUtil.addClass(this._windowScreenButton, className);	// add disabled class name
		if (this._disabled || map.isFullscreen())
			L.DomUtil.addClass(this._fullScreenButton, className);		// add disabled class name
	}
});

var	screenControl = function (options) {
	return new ScreenControl(options);
};

exports.Control.Screen = ScreenControl;
exports.control.screen = screenControl;

L.Map.include({
	isFullscreen: function () {
		return this._isFullscreen || false;
	},

	toggleFullscreen: function (options) {
		var container = this.getContainer();
		if (this.isFullscreen()) {
			if (options && options.pseudoFullscreen) {
				this._disablePseudoFullscreen(container);
			} else if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else {
				this._disablePseudoFullscreen(container);
			}
		} else {
			if (options && options.pseudoFullscreen) {
				this._enablePseudoFullscreen(container);
			} else if (container.requestFullscreen) {
				container.requestFullscreen();
			} else if (container.mozRequestFullScreen) {
				container.mozRequestFullScreen();
			} else if (container.webkitRequestFullscreen) {
				container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			} else if (container.msRequestFullscreen) {
				container.msRequestFullscreen();
			} else {
				this._enablePseudoFullscreen(container);
			}
		}
	},

	_enablePseudoFullscreen: function (container) {
		L.DomUtil.addClass(container, 'leaflet-pseudo-fullscreen');
		this._setFullscreen(true);
		this.fire('fullscreenchange');
	},

	_disablePseudoFullscreen: function (container) {
		L.DomUtil.removeClass(container, 'leaflet-pseudo-fullscreen');
		this._setFullscreen(false);
		this.fire('fullscreenchange');
	},

	_setFullscreen: function(fullscreen) {
		this._isFullscreen = fullscreen;
		var container = this.getContainer();
		if (fullscreen) {
			L.DomUtil.addClass(container, 'leaflet-fullscreen-on');
		} else {
			L.DomUtil.removeClass(container, 'leaflet-fullscreen-on');
		}
		this.invalidateSize();
	},

	_onFullscreenChange: function (e) {
		var fullscreenElement =
			document.fullscreenElement ||
			document.mozFullScreenElement ||
			document.webkitFullscreenElement ||
			document.msFullscreenElement;

		if (fullscreenElement === this.getContainer() && !this._isFullscreen) {
			this._setFullscreen(true);
			this.fire('fullscreenchange');
		} else if (fullscreenElement !== this.getContainer() && this._isFullscreen) {
			this._setFullscreen(false);
			this.fire('fullscreenchange');
		}
	}
});

L.Map.mergeOptions({
	fullscreenControl: false
});

L.Map.addInitHook(function () {
	if (this.options.fullscreenControl) {
		this.fullscreenControl = new L.Control.Fullscreen(this.options.fullscreenControl);
		this.addControl(this.fullscreenControl);
	}

	var fullscreenchange;

	if ('onfullscreenchange' in document) {
		fullscreenchange = 'fullscreenchange';
	} else if ('onmozfullscreenchange' in document) {
		fullscreenchange = 'mozfullscreenchange';
	} else if ('onwebkitfullscreenchange' in document) {
		fullscreenchange = 'webkitfullscreenchange';
	} else if ('onmsfullscreenchange' in document) {
		fullscreenchange = 'MSFullscreenChange';
	}

	if (fullscreenchange) {
		var onFullscreenChange = L.bind(this._onFullscreenChange, this);

		this.whenReady(function () {
			L.DomEvent.on(document, fullscreenchange, onFullscreenChange);
		});

		this.on('unload', function () {
			L.DomEvent.off(document, fullscreenchange, onFullscreenChange);
		});
	}
});

/* Theme Screen Control */
var ThemeScreenControl = L.Control.Screen.extend({
	options: {
		className: ''
	},
	initialize: function (options){
		L.Util.setOptions(this, options);
	},
	onAdd: function (map){
		var options = this.options;

		if(!options.className)
			return L.Control.Screen.prototype.onAdd.call(this, map);

		var container = L.DomUtil.create('div', options.className);

		this._screenButton = this._createButton('', '', options.className + '-button',  container, this._screenButtonFn);

		this._map = map;
		this._update();
		map.on('fullscreenchange', this._update, this);

		return container;
	},
	_screenButtonFn: function (e){
		var map = this._map;

		if(!this._disabled)
			map.toggleFullscreen(this.options);
	},
	_createButton: function (html, title, className, container, fn) {
		var link = L.DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		/*
		 * Will force screen readers like VoiceOver to read this as "Zoom in - button"
		 */
		link.setAttribute('role', 'button');
		link.setAttribute('aria-label', title);

		L.DomEvent.disableClickPropagation(link);
		L.DomEvent.on(link, 'click', L.DomEvent.stop);
		L.DomEvent.on(link, 'click', fn, this);
		L.DomEvent.on(link, 'click', this._refocusOnMap, this);

		return link;
	},
	_update: function (){
		var options = this.options;
		var map = this._map;
		var className = 'leaflet-disabled';

		if(!options.className){
			L.Control.Screen.prototype._update.call(this);
		}
		else{
			if(L.DomUtil.hasClass(this._screenButton, className))
				L.DomUtil.removeClass(this._screenButton, className);

			if (this._disabled)
				L.DomUtil.addClass(this._screenButton, className);

			this._screenButton.title = options.titleFullScreen[this._map.isFullscreen()];
		}
	},
	update: function(){
		var options = this.options, container, className, classes;

			if(options.className && !this._screenButton){

				container = this._fullScreenButton.parentNode;
				className = 'leaflet-control-screen';

				L.DomUtil.remove(this._fullScreenButton);
				L.DomUtil.remove(this._windowScreenButton);

				this._fullScreenButton = this._windowScreenButton = undefined;

				L.DomUtil.removeClass(container, className);
				L.DomUtil.removeClass(container, 'leaflet-bar');

				L.DomUtil.addClass(container, options.className);

				this._screenButton = this._createButton('', '', options.className + '-button',  container, this._screenButtonFn);

				this._update();
				this._map.off('fullscreenchange', L.Control.Screen.prototype._update, this);
				this._map.on('fullscreenchange', this._update, this);
			}
			else
			if(!options.className && this._screenButton){

				container = this._screenButton.parentNode;
				className = 'leaflet-control-screen';

				L.DomUtil.remove(this._screenButton);

				this._screenButton = undefined;

				classes = L.DomUtil.getClass(container).split(' ');

				for(var i = 0; i < classes.length; i++){
					L.DomUtil.removeClass(container, classes[i]);
				}

				L.DomUtil.addClass(container, className);
				L.DomUtil.addClass(container, 'leaflet-control');
				L.DomUtil.addClass(container, 'leaflet-bar');

				this._fullScreenButton   = this._createButton(options.textFullScreen['true'], options.titleFullScreen['false'], className + '-full',  container, this._fullScreenButtonFn);

				this._windowScreenButton = this._createButton(options.textFullScreen['false'], options.titleFullScreen['true'], className + '-win', container, this._windowScreenButtonFn);

				L.Control.Screen.prototype._update.call(this);
				this._map.off('fullscreenchange', this._update, this);
				this._map.on('fullscreenchange', L.Control.Screen.prototype._update, this);
		}
	}
});

var	themeScreenControl = function (options) {
	return new ThemeScreenControl(options);
};

/* Bookmark Control */
var BookmarkControl = L.Control.extend({
	options: {
		title: 'Bookmark',
		textButton: 'B',
		center: '',
		zoom: '',
	},
	initialize: function(options){
		L.Util.setOptions(this, options);
	},
	onAdd: function(map){
		this._initLayout();
		this._map = map;

		L.DomEvent.on(this._container, 'click', this._onClick, this);
		map.on('zoomend moveend', this._update, this);

		return this._container;
	},
	onRemove: function(map){
		L.DomEvent.off(this._container, 'click', this._onClick, this);
		map.off('zoomend moveend', this._update, this);
	},
	_onClick : function(){
		var map = this._map, zoom = this.options.zoom, center = this.options.center, className = 'leaflet-disabled';

		if(!L.DomUtil.hasClass(this._bookmarkLink, className))
			map.setView(center, zoom);
	},
	enable: function () {
		this._disabled = false;
		this._update();
		return this;
	},
	disable: function () {
		this._disabled = true;
		this._update();
		return this;
	},
	_update: function (){
		var map = this._map, className = 'leaflet-disabled';

		if(L.DomUtil.hasClass(this._bookmarkLink, className))
			L.DomUtil.removeClass(this._bookmarkLink, className);		// remove disabled class name

		var disable_cond =
			this._disabled ||
			!this.options.center ||
			!this.options.zoom ||
			(this.options.zoom === map.getZoom() && map.getCenter().equals(this.options.center, 0.08)); 

		if (disable_cond){
			L.DomUtil.addClass(this._bookmarkLink, className);	// add disabled class name
		}
	},
	_initLayout: function(){
		var className = 'leaflet-bookmark-control',
			container = this._container = L.DomUtil.create('div', className + ' leaflet-bar');

		// makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
		container.setAttribute('aria-haspopup', true);

		L.DomEvent.disableClickPropagation(container);
		L.DomEvent.disableScrollPropagation(container);

		var link = this._bookmarkLink = L.DomUtil.create('a', className + '-link', container);
		link.href = '#';
		link.title = this.options.title;
		link.innerHTML = this.options.textButton;

		this._update();
	},
});

var bookmarkControl = function(options){
	return new BookmarkControl(options);
}

exports.Control.Bookmark = BookmarkControl;
exports.control.bookmark = bookmarkControl;

/* Theme Bookmark Control */
var ThemeBookmarkControl = L.Control.Bookmark.extend({
	options:{
		className: ''
	},
	initialize: function(options){
		L.Util.setOptions(this, options);
	},
	_onClick : function(){
		var map = this._map, zoom = this.options.zoom, center = this.options.center, className = 'leaflet-disabled';

		if(!L.DomUtil.hasClass(this._bookmarkLink, className))
			map.setView(center, zoom);
	},
	_update: function (){
		if(!this.options.className){
			L.Control.Bookmark.prototype._update.call(this);
			return;
		}

		var map = this._map, className = 'leaflet-disabled';

		if(L.DomUtil.hasClass(this._bookmarkLink, className))
			L.DomUtil.removeClass(this._bookmarkLink, className);		// remove disabled class name

		var disable_cond =
			this._disabled ||
			!this.options.center ||
			!this.options.zoom ||
			(this.options.zoom === map.getZoom() && map.getCenter().equals(this.options.center, 0.08)); 

		if (disable_cond){
			L.DomUtil.addClass(this._bookmarkLink, className);	// add disabled class name
		}
	},
	_initLayout: function(){
		if(!this.options.className){
			L.Control.Bookmark.prototype._initLayout.call(this);
			return;
		}

		var className = this.options.className,
			container = this._container = L.DomUtil.create('div', className);

		// makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
		container.setAttribute('aria-haspopup', true);

		L.DomEvent.disableClickPropagation(container);
		L.DomEvent.disableScrollPropagation(container);

		var link = this._bookmarkLink = L.DomUtil.create('a', className + '-link', container);
		link.href = '#';
		link.title = this.options.title;
		link.innerHTML = this.options.textButton;

		this._update();
	},
	update: function(){
		var options = this.options, container, className, classes;

		container = this._bookmarkLink.parentNode;
		className = 'leaflet-bookmark-control';

		if(options.className && L.DomUtil.hasClass(container, 'leaflet-bar')){

			L.DomUtil.removeClass(container, 'leaflet-bar');
			L.DomUtil.removeClass(container, 'leaflet-bookmark-control');

			L.DomUtil.remove(this._bookmarkLink);

			this._bookmarkLink = L.DomUtil.create('a', options.className + '-link', container);
			this._bookmarkLink.href = '#';
			this._bookmarkLink.title = this.options.title;
			this._bookmarkLink.innerHTML = this.options.textButton;

			this._update();
		}
		else
		if(!options.className && !L.DomUtil.hasClass(container, 'leaflet-bar')){

			classes = L.DomUtil.getClass(container).split(' ');

			for(var i = 0; i < classes.length; i++){
				L.DomUtil.removeClass(container, classes[i]);
			}

			L.DomUtil.addClass(container, className);
			L.DomUtil.addClass(container, 'leaflet-control');
			L.DomUtil.addClass(container, 'leaflet-bar');

			L.DomUtil.remove(this._bookmarkLink);

			this._bookmarkLink = L.DomUtil.create('a', className + '-link', container);
			this._bookmarkLink.href = '#';
			this._bookmarkLink.title = this.options.title;
			this._bookmarkLink.innerHTML = this.options.textButton;

			L.Control.Bookmark.prototype._update.call(this);
		}
	}
});

var themeBookmarkControl = function(options){
	return new ThemeBookmarkControl(options);
}

/* Message Box Control */

var MessageBoxControl = L.Control.extend({
	options: {
		position: 'topright',
		collapsed: true,
		title: '',
		textButton: 'M',
		msgClassName: ''
	},
	initialize: function(content, options){
		this._content = '';

		if(arguments.length > 0)
			this._content += content;

		L.Util.setOptions(this, options);
	},
	onAdd: function (map) {
		this._initLayout();
		this._update();

		this._map = map;
		this.show();

		return this._container;
	},
	enable: function () {
		this._disabled = false;
		this._update();
		return this;
	},
	disable: function () {
		this._disabled = true;
		this._update();
		return this;
	},
	_initLayout: function(){
		var	className = 'leaflet-control-messagebox',
			container = this._container = L.DomUtil.create('div', className),
			collapsed = this.options.collapsed,
			android = false;

		container.setAttribute('aria-haspopup', true);

		L.DomEvent.disableClickPropagation(container);
		L.DomEvent.disableScrollPropagation(container);

		var msg = null, link = null;

		if(collapsed){
			link = this._link = L.DomUtil.create('div', className + '-link', container);
			link.title = this.options.title || 'Message Box';
			link.innerHTML = this.options.textButton ?  String(this.options.textButton).charAt(0).toUpperCase() : 'M';
		}else{
			msg = this._msg = L.DomUtil.create('div', className + '-msg', container);
			(!this.options.msgClassName) || L.DomUtil.addClass(msg, this.options.msgClassName); 
		}
		if (L.Browser.touch) {
			(!collapsed) || L.DomEvent.on(container, 'click', L.DomEvent.stop);
			(!collapsed) ||	L.DomEvent.on(container, 'click', this._toggle, this);
		} else {
			(!collapsed) ||	L.DomEvent.on(container, 'focus', this._toggle, this);
		}

		if(!collapsed)
			this.expand();
	},
	_update: function(){
		var	className = 'leaflet-control-messagebox',
			container = this._container;

		if(L.DomUtil.hasClass(container, className + '-expanded')){
			this._msg.innerHTML = this._content;
			if(this._msg.innerHTML)
				L.DomUtil.addClass(container, className + '-content');
			else
				L.DomUtil.removeClass(container, className + '-content');
		}
	},
	expand: function(){
		var	className = 'leaflet-control-messagebox',
			container = this._container, link = this._link, msg = this._msg;

		L.DomUtil.addClass(container, className + '-expanded');
		if(link){
			L.DomUtil.remove(link);
			link = this._link = null;
		}

		if(!msg){
			msg = this._msg = L.DomUtil.create('div', className + '-msg', container);
			(!this.options.msgClassName) || L.DomUtil.addClass(msg, this.options.msgClassName); 
		}

		this._update();
	},
	collapse: function(){
		var	className = 'leaflet-control-messagebox',
			container = this._container, link = this._link, msg = this._msg;

		if(L.DomUtil.hasClass(container, className + '-expanded'))
			L.DomUtil.removeClass(container, className + '-expanded');

		if(!link){
			link = this._link = L.DomUtil.create('div', className + '-link', container);
			link.title = this.options.title || 'Message Box';
			link.innerHTML = this.options.textButton ?  String(this.options.textButton).charAt(0).toUpperCase() : 'M';
		}
		if(msg){
			L.DomUtil.remove(msg);
			msg = this._msg = null;
		}

		this._update();
	},
	_toggle: function(){
		var	className = 'leaflet-control-messagebox',
			container = this._container;

		if(L.DomUtil.hasClass(container, className + '-expanded'))
			this.collapse();
		else
			this.expand();
	},
	setContent: function(content) {
		this._content = content;
		this._update();

		return this;
	},
	isExpanded: function(){
		var	className = 'leaflet-control-messagebox';

		return L.DomUtil.hasClass(this._container, className + '-expanded');
	},
	show: function () {
		this._container.style.display = 'block';
	},

	hide: function () {
		this._container.style.display = 'none';
	},
});

var messageBoxControl = function (content, options) {
    return new MessageBoxControl(content, options);
};

L.Map.mergeOptions({
	messageBox: false
});

L.Map.addInitHook(function () {
	if (this.options.messageBox) {
		this.messageBox = new MessageBoxControl();
		this.addControl(this.messageBox);
	}
});

exports.Control.MessageBox = MessageBoxControl;
exports.control.messageBox = messageBoxControl;

/* Theme Message Box Control */

var ThemeMessageBox = L.Control.MessageBox.extend({
	options: {
		className: ''
	},

	initialize: function(content, options){
		L.Control.MessageBox.prototype.initialize.call(this, content, options);
	},

	_initLayout: function(){
		var className = this.options.className;

		if(!className){
			L.Control.MessageBox.prototype._initLayout.call(this);
			return;
		}

		var container = this._container = L.DomUtil.create('div', className),
			collapsed = this.options.collapsed,
			android = false;

		container.setAttribute('aria-haspopup', true);

		L.DomEvent.disableClickPropagation(container);
		L.DomEvent.disableScrollPropagation(container);

		var msg = null, link = null;

		if(collapsed){
			link = this._link = L.DomUtil.create('div', className + '-link', container);
			link.title = this.options.title || 'Message Box';
			link.innerHTML = this.options.textButton ?  String(this.options.textButton).charAt(0).toUpperCase() : 'M';
		}else{
			msg = this._msg = L.DomUtil.create('div', className + '-msg', container);
			(!this.options.msgClassName) || L.DomUtil.addClass(msg, this.options.msgClassName); 
		}
		if (L.Browser.touch) {
			(!collapsed) || L.DomEvent.on(container, 'click', L.DomEvent.stop);
			(!collapsed) ||	L.DomEvent.on(container, 'click', this._toggle, this);
		} else {
			(!collapsed) ||	L.DomEvent.on(container, 'focus', this._toggle, this);
		}

		if(!collapsed)
			this.expand();
	},

	_update: function(){
		var	className = this.options.className || 'leaflet-control-messagebox',
			container = this._container;

		if(L.DomUtil.hasClass(container, className + '-expanded')){
			this._msg.innerHTML = this._content;
			if(this._msg.innerHTML)
				L.DomUtil.addClass(container, className + '-content');
			else
				L.DomUtil.removeClass(container, className + '-content');
		}
	},

	expand: function(){
		var	className = this.options.className || 'leaflet-control-messagebox',
			container = this._container, link = this._link, msg = this._msg;

		L.DomUtil.addClass(container, className + '-expanded');
		if(link){
			L.DomUtil.remove(link);
			link = this._link = null;
		}

		if(!msg){
			msg = this._msg = L.DomUtil.create('div', className + '-msg', container);
			(!this.options.msgClassName) || L.DomUtil.addClass(msg, this.options.msgClassName); 
		}

		this._update();
	},

	collapse: function(){
		var	className = this.options.className || 'leaflet-control-messagebox',
			container = this._container, link = this._link, msg = this._msg;

		if(L.DomUtil.hasClass(container, className + '-expanded'))
			L.DomUtil.removeClass(container, className + '-expanded');

		if(!link){
			link = this._link = L.DomUtil.create('div', className + '-link', container);
			link.title = this.options.title || 'Message Box';
			link.innerHTML = this.options.textButton ?  String(this.options.textButton).charAt(0).toUpperCase() : 'M';
		}
		if(msg){
			L.DomUtil.remove(msg);
			msg = this._msg = null;
		}

		this._update();
	},

	_toggle: function(){
		var	className = this.options.className || 'leaflet-control-messagebox',
			container = this._container;

		if(L.DomUtil.hasClass(container, className + '-expanded'))
			this.collapse();
		else
			this.expand();
	},	

	isExpanded: function(){
		var	className = this.options.className || 'leaflet-control-messagebox';

		return L.DomUtil.hasClass(this._container, className + '-expanded');
	},

	update: function(){
		var	className = this.options.className || 'leaflet-control-messagebox',
			collapsed = this.options.collapsed,
			android = false,
			container = this._container, classes;

		if(L.DomUtil.hasClass(container, className))
			return;

		classes = L.DomUtil.getClass(container).split(' ');

		for(var i = 0; i < classes.length; i++){
			L.DomUtil.removeClass(container, classes[i]);
		}

		L.DomUtil.addClass(container, className);
		L.DomUtil.addClass(container, 'leaflet-control');

		(!this._msg) || L.DomUtil.remove(this._msg);
		(!this._link) || L.DomUtil.remove(this._link);

		var msg = this._msg = null, link = this._link = null;

		if(collapsed){
			link = this._link = L.DomUtil.create('div', className + '-link', container);
			link.title = this.options.title || 'Message Box';
			link.innerHTML = this.options.textButton ?  String(this.options.textButton).charAt(0).toUpperCase() : 'M';
		}else{
			msg = this._msg = L.DomUtil.create('div', className + '-msg', container);
			(!this.options.msgClassName) || L.DomUtil.addClass(msg, this.options.msgClassName); 
		}

		if(!collapsed)
			this.expand();
	}
});

var themeMessageBox = function(content, options){
	return new ThemeMessageBox(content, options);
}

/* Leaflet Control */
var ThemeControl = L.Control.extend({
	options: {
		title: {'true': 'Change to Custom Controls', 'false': 'Change to Leaflet Controls'},
		leaflet: true,
		func: null,
		className: ''
	},

	initialize: function(options){
		L.Util.setOptions(this, options);
	},

	onAdd: function(map){
		this._initLayout();
		this._map = map;

		L.DomEvent.on(this._container, 'click', this.onClick, this);

		return this._container;
	},

	onRemove: function(map){
		L.DomEvent.off(this._container, 'click', this.onClick, this);
	},

	onClick: function(){
		this._switch();
		if(typeof this.options.func === 'function')
			this.options.func();
	},

	_switch: function (){
		var leaflet = this.options.leaflet;
		var className = this.options.leaflet ? 'std-leaflet-control' : this.options.className;

		className = className || 'std-leaflet-control';

		if(this.options.className){

			if(leaflet){
				L.DomUtil.removeClass(this._container, 'leaflet-bar');
			}
			L.DomUtil.removeClass(this._container, className);
			L.DomUtil.removeClass(this._leafletLink, className + '-link');

			if(leaflet){
				L.DomUtil.addClass(this._container, this.options.className);
				L.DomUtil.addClass(this._leafletLink, this.options.className + '-link');
			}
			else{
				L.DomUtil.addClass(this._container, 'std-leaflet-control' + ' leaflet-bar');
				L.DomUtil.addClass(this._leafletLink, 'std-leaflet-control-link');
			}
		}
		this._leafletLink.title = this.options.title[!leaflet];
		this.options.leaflet = !leaflet;
	},

	_initLayout: function(){
		var className = this.options.leaflet ? 'std-leaflet-control' : this.options.className;
		className = className || 'std-leaflet-control';
		var container;

		if(this.options.leaflet)
			container = this._container = L.DomUtil.create('div', className + ' leaflet-bar');
		else{
			container = this._container = L.DomUtil.create('div', className);
			(this.options.className) || L.DomUtil.addClass(this._container, 'leaflet-bar');
		}

		// makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
		container.setAttribute('aria-haspopup', true);

		L.DomEvent.disableClickPropagation(container);
		L.DomEvent.disableScrollPropagation(container);

		var link = this._leafletLink = L.DomUtil.create('a', className + '-link', container);
		link.href = '#';
		link.title = this.options.title[this.options.leaflet];
		link.innerHTML = '';
	},
});

var themeControl = function(options){
	return new ThemeControl(options);
}

exports.ThemeZoomControl = ThemeZoomControl;
exports.themeZoomControl = themeZoomControl;

exports.ThemeLayersControl = ThemeLayersControl;
exports.themeLayersControl = themeLayersControl;

exports.ThemeAttributionControl = ThemeAttributionControl;
exports.themeAttributionControl = themeAttributionControl;

exports.Control.Screen = ScreenControl;
exports.control.screen = screenControl;

exports.ThemeScreenControl = ThemeScreenControl;
exports.themeScreenControl = themeScreenControl;

exports.Control.Bookmark = BookmarkControl;
exports.control.bookmark = bookmarkControl;

exports.ThemeBookmarkControl = ThemeBookmarkControl;
exports.themeBookmarkControl = themeBookmarkControl;

exports.Control.MessageBox = MessageBoxControl;
exports.control.messageBox = messageBoxControl;

exports.ThemeMessageBox = ThemeMessageBox;
exports.themeMessageBox = themeMessageBox;

exports.Control.Theme = ThemeControl;
exports.control.theme = themeControl;
}));
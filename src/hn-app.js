import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';

import '@polymer/iron-pages/iron-pages.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';

// custom elements here

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(HnAppGlobals.rootPath);

class HnApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          height: 100%;
          margin: 0;
        }
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]"></app-location>
      <app-route
        route="{{route}}"
        pattern="[[rootPath]]:page"
        data="{{routeData}}"
        tail="{{subroute}}"></app-route>

      <iron-pages
          selected="[[page]]"
          attr-for-selected="name"
          fallback-selection="404">
        <hn-story-list name="story-list" subroute="[[subroute]]"></hn-story-list>
        <hn-story name="story" subroute="[[subroute]]"></hn-story>
        <hn-user name="user" subroute="[[subroute]]"></hn-user>
        <hn-404 name="404"></hn-404>
      </iron-pages>
    `;
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      rootPattern: String,
      routeData: Object,
      subroute: String,
    }
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)',
    ];
  }

  _routePageChanged(page) {
     // Show the corresponding page according to the route.
     //
     // If no page was found in the route data, page will be an empty string.
     // Show 'story-list' in that case. And if the page doesn't exist, show '404'.
     if (!page) {
      this.page = 'story-list';
    } else if (['story-list', 'story', 'user'].indexOf(page) !== -1) {
      this.page = page;
    } else {
      this.page = '404';
    }

    document.body.scrollTop = 0;
  }

  _pageChanged(page) {
    // Import the page component on demand.
    //
    // Note: `polymer build` doesn't like string concatenation in the import
    // statement, so break it up.
    switch (page) {
      case 'story-list':
        import('./hn-story-list.js');
        break;
      case 'story':
        import('./hn-story.js');
        break;
      case 'user':
        import('./hn-user.js');
        return;
      case '404':
        import('./hn-404.js');
        break;
    }
  }
};

window.customElements.define('hn-app', HnApp);

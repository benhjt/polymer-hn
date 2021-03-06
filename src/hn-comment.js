import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '@polymer/polymer/lib/elements/dom-repeat.js';

class HnComment extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        .comments {
          padding-left: 20px;
        }

        .comment__toggle {
          background-color: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          user-select: none;
        }
      </style>

      <div class="comment__header">
        <button class="comment__toggle" on-click="_toggleCollapse" aria-label="[[_collapseTitle]]">[[_collapseButton]]</button>
        <a href$="/user/[[comment.user]]">[[comment.user]]</a>
        <span>[[comment.time_ago]]</span>
      </div>

      <div class="comment" inner-h-t-m-l="[[comment.content]]" hidden$="[[collapsed]]"></div>

      <div class="comments" hidden$="[[collapsed]]">
        <template is="dom-repeat" items="[[comment.comments]]" as="comment" initial-count="3">
          <hn-comment comment="[[comment]]"></hn-comment>
        </template>
      </div>
    `;
  }

  static get properties() {
    return {
      comment: Object,
      collapsed: Boolean,
      _collapseTitle: String,
      _collapseButton: String
    }
  }

  constructor() {
    super();
    this.collapsed = false;
    this._collapseButton = '[-]';
    this._collapseTitle = 'Hide replies';
    this._commentThreadSize = 0;
  }

  _calculateThreadSize(comment) {
    let threadSize = 0;

    let flat = (comment) => {
      threadSize++;
      comment.comments.forEach(flat);
    };

    flat(comment);
    return threadSize;
  }

  _toggleCollapse() {
    this.collapsed = !this.collapsed;
    if (!this._commentThreadSize) {
      this._commentThreadSize = this._calculateThreadSize(this.comment);
    }

    this._collapseButton = this.collapsed ? `[+${this._commentThreadSize}]` : '[–]';
    this._collapseTitle = `${this.collapsed ? 'Show' : 'Hide'} ${this._commentThreadSize} comments`;
  }
};

window.customElements.define('hn-comment', HnComment);

'use strict';

import '../css/styles.css';
import $ from 'jquery';
import LayoutView from './views/LayoutView';

const NODE = 'main';

$(() => {
    let layoutView = new LayoutView();
    layoutView.render();

    $(NODE).append(layoutView.el);
});

"use strict";

import React from "react";
import $ from "jQuery";

// fill={$($.ajax({type: "GET",url: "https://github.com/skohar",async: false}).responseText).find("rect.day[data-date=2015-10-17]").attr("fill")}
export default class ReactApp extends React.Component {
    constructor() {
        super();
        this.state = {count:JSON.stringify($($.ajax({type: "GET",url: "https://github.com/skohar",async: false}).responseText).find("rect.day[data-date=2015-10-17]").attr("fill"))};
    }
    render() {
        return (
            <div>Hello World!{this.state.count}</div>
        );
    }
}

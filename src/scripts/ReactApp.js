// "use strict";
import React from "react";
import $ from "jQuery";
import ipc from "ipc";

export default class ReactApp extends React.Component {
    constructor() {
        super();
        let date = moment.utc().format("YYYY-MM-DD");
        this.state = {count:JSON.stringify($($.ajax({type: "GET",url: "https://github.com/skohar",async: false}).responseText).find("rect.day[data-date=" + date + "]").attr("fill"))};
        this.state.count = this.state.count === undefined ? "#eeeeee" : this.state.count
        ipc.send('asynchronous-message', this.state.count);
    }
    render() {
        return (
            <div style={{width: 11 + `px`, height: 11 + `px`, backgroundColor: this.state.count}}></div>
        );
    }
}

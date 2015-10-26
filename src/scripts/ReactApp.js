// "use strict";
import React from "react";
import $ from "jQuery";
import ipc from "ipc";

export default class ReactApp extends React.Component {
    constructor() {
        super();
        this.setState = this.setState.bind(this);
        this.tick();
        setInterval(this.tick, 60000)
    }
    tick() {
      let date = moment.utc().format("YYYY-MM-DD");
      this.state = {count:JSON.stringify($($.ajax({type: "GET",url: "https://github.com/skohar",async: false}).responseText).find("rect.day[data-date=" + date + "]").attr("fill"))};
      this.state.count = this.state.count === undefined ? "#eeeeee" : this.state.count;
      ipc.send('asynchronous-message', this.state.count);
    }
    changeText(e) {
      this.setState({ name: e.target.value })
    }
    render() {
        return (
          <div>
            <input type="text" value={this.state.name} onChange={this.changeText} />
          </div>
        );
    }
}

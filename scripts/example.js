const electron = require("electron");
const ipc = electron.ipcMain;
const $ = require("jquery");

if (localStorage.getItem("name") === null) {
  ipc.send("window", "open");
}

const GrassBox = React.createClass({
  loadGrassFromServer: function() {
    $.ajax({
      url: "https://github.com/" + this.state.name,
      cache: false,
      success: function(data) {
        let date = moment.utc().format("YYYY-MM-DD");
        let color = $(data).find("rect.day[data-date=" + date + "]").attr("fill");
        let state = {
          color: color === undefined ? "#eeeeee" : color
        };
        this.setState(state);
        ipc.send("tray.color", this.state.color);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    const name = this.refs.name.value.trim();
    localStorage.setItem("name", name);
    this.setState({name: name});
  },
  getInitialState: function() {
    return {
      name: localStorage.getItem("name")
    };
  },
  componentDidMount: function() {
    this.loadGrassFromServer();
    setInterval(this.loadGrassFromServer, 10000);
  },
  render: function() {
    return (
      <div className="grassBox">
        <h1>Preference</h1>

        <div>Your account name: {this.state.name}</div>
        <form className="userNameForm" onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Your account name" defaultValue={this.state.name} ref="name"/>
          <input type="submit" value="Save"/>
        </form>
      </div>
    );
  }
});

const CloseBox = React.createClass({
  onClick: function(e) {
    e.preventDefault();
    ipc.send("window", "close")
  },
  render: function() {
    return (
      <div className="closeBox">
        <button onClick={this.onClick}>Close</button>
      </div>
    );
  }
});

ReactDOM.render(
  <div>
    <GrassBox/>
    <CloseBox/>
  </div>,
  document.getElementById("content")
);

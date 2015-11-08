var $ = require("jquery");
var ipc = require("ipc");

var GrassBox = React.createClass({
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
        ipc.send("asynchronous-message", this.state.color);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var name = this.refs.name.value.trim();
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

ReactDOM.render(
  <div>
    <GrassBox/>
  </div>,
  document.getElementById("content")
);
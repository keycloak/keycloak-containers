import React from "react";
import {connect} from "react-redux";
import {initChannel, sendCommand} from "../actions/channels";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      command: ''
    };
  }

  componentWillMount() {
    this.props.init();
  }

  onChangeCommand(evt) {
    this.setState({
      command: evt.target.value
    });
  }

  sendCommand() {
    this.props.sendCommand(this.state.command);
    this.setState({
      command: ''
    });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.sendCommand();
    }
  }

  render() {
    const kc = this.props.kc;
    const commandChannel = this.props.channels.commandChannel;

    let channelMessage = 'Nothing';
    if (commandChannel == null)
      {}
    else if (commandChannel.readyState == 0)
      channelMessage = 'Not connected';
    else if (commandChannel.readyState == 1)
      channelMessage = 'Connected.';
    else if (commandChannel.readyState == 3)
      channelMessage = 'Connection error.';

    const dataReceived = this.props.channels.results.map(function(e, i) {
      return (<p key={i}>{e}</p>);
    });

    return (
      <div>
        <div className="row">
          <h2>Identity</h2>
          <p>
            Logged as {kc.tokenParsed.preferred_username}&nbsp;
            <button className="btn btn-success btn-sm" onClick={kc.logout}>Logout</button>
          </p>
          <hr/>
        </div>
        <div className="row">
          <h2>Send command</h2>
          <p>Channel status: {channelMessage}</p>
          { commandChannel != null && commandChannel.readyState == 1 ? (
            <div>
              <input type="text" onKeyPress={evt => this.handleKeyPress(evt)} value={this.state.command} onChange={evt => this.onChangeCommand(evt)} />
              <button onClick={evt => this.sendCommand()}>Send</button>
            </div>
          ):
            (<div></div>)
          }
        </div>
        <h2>Commands results</h2>
        <div>
          {dataReceived}
        </div>
      </div>
    );
  }
}

Home.defaultProps = {

};

const mapStateToProps = state => {
  return {
    kc: state.keycloak,
    channels: state.channels
  }
};

const mapDispatchToProps = dispatch => {
  return {
    init: () => {
      dispatch(initChannel());
    },
    sendCommand: (cmd) => {
      dispatch(sendCommand(cmd));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home)

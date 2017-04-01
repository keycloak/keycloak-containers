import React from 'react';
import ReactDOM from 'react-dom';

import {Step, Stepper, StepLabel, StepContent} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {green500} from 'material-ui/styles/colors';
import DoneIcon from 'material-ui/svg-icons/action/done';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
const ReactCodeMirror = require('./ReactCodeMirror')

module.exports = () => {
  const ScriptTag = require('./ScriptTag')(React);
  require('./setup.scss');

  return React.createClass({

    propTypes: {
      application_id: React.PropTypes.string.isRequired,
      endpoint:React.PropTypes.string.isRequired,
      state:React.PropTypes.object.isRequired,
      onSetupDone:React.PropTypes.func.isRequired,
    },

    componentWillReceiveProps: function(newProps){
      this.updateState(newProps.state);
    },

    updateState: function(obj){
      this.setState(Object.assign(this.state, obj));
    },

    componentDidMount: function() {
      this.updateState(this.props.state);
      this.props.state.on('changed', (state) => this.updateState(state));
    },
    componentWillUnmount: function() {
      this.props.state.removeAllListeners('changed');
    },

    getInitialState: () => {
      return {};
    },


    render() {
        return (<Card className="setup-steps-card">
          <CardHeader>
            <Stepper activeStep={this.state.activeStep}  orientation="vertical">
              <Step>
                <StepLabel icon={<DoneIcon
                  color={green500}
                  style={({height: 46, width: 46})}
                />}>Create an account</StepLabel>

              </Step>
              <Step>
                <StepLabel icon={this.state.activeStep === 2 ? <DoneIcon
                  color={green500}
                  style={({height: 46, width: 46})}
                /> : undefined}>Install the basic JavaScript snippet</StepLabel>
                <StepContent>
                  <CardActions>
                    <p>Copy and paste the following snippet before the <code>&lt;/body&gt;</code> tag on every web page you want the Kill Bug to be available:</p>
                    <ScriptTag application_id={this.props.application_id} endpoint={this.props.endpoint}/>
                    <p>The snippet shown above tracks user data in Kill Bug and allow you to remotely take control of the user browser.</p>
                    <p>To verify your JavaScript install:</p>
                    <ul>
                      <li>Open a new browser window.</li>
                      <li>Load a page where you installed Intercom.</li>
                    </ul>
                    <p>Once the JavaScript loads and connects to Kill Bug, this step will complete automatically.</p>
                    <div className="setup-steps-card-loader-box">
                      <CircularProgress className="setup-steps-card-loader"/>
                      <span><strong>Status</strong>: Waiting to receive data from a Kill Bug install…</span></div>
                  </CardActions>
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Done!</StepLabel>
                <StepContent>
                  <CardActions>
                    <p>Welcome to a whole new frontend developer experience!</p>
                    <p>Debug remotely any user sessions in real-time and track any JavaScript expression for every session.</p>
                    <RaisedButton
                      label={`Start to debug remote sessions!`}
                      disableTouchRipple={true}
                      disableFocusRipple={true}
                      primary={true}
                      onTouchTap={this.props.onSetupDone}
                      style={{marginRight: 12}}
                    />
                  </CardActions>
                </StepContent>
              </Step>
            </Stepper>
          </CardHeader>
        </Card>);
    }
  });
}

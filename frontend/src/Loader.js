import LinearProgress from 'material-ui/LinearProgress';

module.exports = (React) => {
  return React.createClass({

    propTypes: {
      transitionService: React.PropTypes.object
    },

    getInitialState() {
      return {isLoading: false};
    },

    componentDidMount() {
      this.props.transitionService.onStart({}, () => {
        this.setState({isLoading: true});
      });

      this.props.transitionService.onFinish({}, () => {
        this.setState({isLoading: false});
      });
    },

    componentWillUnmount() {
      throw new Error('@todo remove listeners');
    },

    render() {
      return (<div className="app-loader">
        {this.state.isLoading ? <LinearProgress mode="indeterminate" /> : null}
      </div>);
    }
  });
}

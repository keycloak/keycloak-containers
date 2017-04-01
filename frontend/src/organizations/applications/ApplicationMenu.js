import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {get, filter} from 'lodash';
require('./applications.scss');

const getProp = (arr, f, prop, def) => get(arr.find(f), prop, def);

module.exports = (React) => {
  return React.createClass({

    getInitialState() {
      return {
        isMenuOpened:false
      }
    },

    propTypes: {
      application_id: React.PropTypes.string.isRequired,
      organization_id: React.PropTypes.string.isRequired,
    },

    toggleMenu() {
      this.setState({isMenuOpened: !this.state.isMenuOpened});
      return true;
    },

    render() {
      const menu = this.state.isMenuOpened ? (<Menu className="application-menu" autoWidth={false}>
        {this.props.organizations.map(orga => (
          <div>
            <MenuItem
              disabled={true}
              primaryText={orga.name}
               checked={orga.organization_id === this.props.organization_id}
              insetChildren={true} />
            <MenuItem primaryText="User-management & invites" insetChildren={true} />
            <MenuItem primaryText="Subscription" insetChildren={true} />
            <MenuItem
              primaryText="Applications"
              insetChildren={true}
              rightIcon={<ArrowDropRight />}
              menuItems={
                filter(this.props.applications, {organization_id: orga.organization_id}).map((app, i) =>
                  <MenuItem
                    checked={app.application_id === this.props.application_id}
                    primaryText={app.name}
                    onTouchTap={() => this.toggleMenu() && this.props.openApplication(app)} />)
              }
            />
            <Divider />
          </div>
        ))}
      </Menu>) : <div></div>;

      const selectedApplicationName = getProp(this.props.organizations, orga => orga.organization_id === this.props.organization_id, 'name') + ' / ' + getProp(this.props.applications, app => app.application_id === this.props.application_id, 'name');
      return (
        <div>
           <RaisedButton
             label={selectedApplicationName}
             labelPosition="before"
             icon={<ArrowDropDown />}
             onTouchTap={() => this.toggleMenu()} />
          <Paper>
            {menu}
          </Paper>
        </div>
      );
    }
  });
}

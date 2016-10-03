import React, { Component } from 'react'
import {auditLogShow, auditLogHide, logout} from './actions'
import './vms.css'

class LoginButton extends Component {
    render () {
        const {config, dispatch} = this.props

        const onLogout = () => dispatch(logout())
        // const onLogin = () => dispatch(showLoginDialog())
        const onLogin = () => {} // dispatch(showLoginDialog())

        if (config.get('loginToken')) {
            return (<a className="user-name" href="#" onClick={onLogout}>
                {config.getIn(['user', 'name'])}&nbsp;<i className="fa fa-sign-out" aria-hidden="true"></i>
            </a>)
        }
        return (<a className="user-name" href="#" onClick={onLogin}><i className="fa fa-sign-out" aria-hidden="true"></i>&nbsp;Login</a>) // TODO: dispatch login action to show login dialog
    }
}
LoginButton.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    config: React.PropTypes.object.isRequired
}

/**
 * Main header application on top of the page
 */
class Header extends Component {
    isUnread (auditLog) {
        return auditLog.get('unread')
    }
    render () {
        const {auditLog, config, dispatch} = this.props
        const onStatusClick = auditLog.get('show') ? () => dispatch(auditLogHide()) : () => dispatch(auditLogShow())

        return (<nav className="navbar navbar-default navbar-pf">
            <div className="container-fluid">
                <div className="navbar-header">
                    <a className="navbar-brand" href="/">oVirt User Portal</a>
                </div>
                <ul className="nav navbar-nav navbar-utility">
                    <li>
                        <a href="#" onClick={onStatusClick}>
                            <div className={this.isUnread(auditLog) ? 'auditlog-unread' : 'auditlog-allread'}>
                                Status
                            </div>
                        </a>
                    </li>
                    <li>
                        <LoginButton dispatch={dispatch} config={config}/>
                    </li>

                    <li className="dropdown">
                        <a href="#" data-toggle="dropdown">
                            <span className="pficon pficon-info"></span>
                            Messages: <strong>2</strong>
                        </a>
                        <div className="dropdown-menu infotip bottom-right">
                            <div className="arrow"></div>
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <span className="i pficon pficon-info"></span>
                                    Added Datasources TestDS
                                </li>
                                <li className="list-group-item">
                                    <span className="i pficon pficon-info"></span>
                                    Modified Datasources ExampleDS
                                </li>
                            </ul>
                            <div className="footer"><a href="#">Clear Messages</a></div>
                        </div>
                    </li>
                </ul>
                </div>
            </nav>
        )
    }
}
Header.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    auditLog: React.PropTypes.object.isRequired,
    config: React.PropTypes.object.isRequired
}

    /* Keep for reference, this is working:
class Header extends Component {
    isUnread (auditLog) {
        return auditLog.get('unread')
    }
    render () {
        const {auditLog, config, dispatch} = this.props
        const onStatusClick = auditLog.get('show') ? () => dispatch(auditLogHide()) : () => dispatch(auditLogShow())

        return (<nav className="navbar navbar-default navbar-pf">
                <div className="navbar-header">
                    <a className="navbar-brand" href="/">oVirt User Portal</a>
                </div>
                <ul className="nav navbar-nav navbar-utility">
                    <li>
                        <a href="#" onClick={onStatusClick}>
                            <div className={this.isUnread(auditLog) ? 'auditlog-unread' : 'auditlog-allread'}>
                                Status
                            </div>
                        </a>
                    </li>
                    <li>
                        <LoginButton dispatch={dispatch} config={config}/>
                    </li>
                </ul>
            </nav>
        )
    }
}
Header.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    auditLog: React.PropTypes.object.isRequired,
    config: React.PropTypes.object.isRequired
}
*/
export default Header

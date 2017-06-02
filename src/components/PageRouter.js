import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { matchRoutes } from 'react-router-config'

import {
  Link,
  withRouter,
  Redirect,
} from 'react-router-dom'

import { redirectRoute } from '../actions/route'

import style from './sharedStyle.css'

import Toolbar from './Toolbar/Toolbar'

const buildPath = (route) => {
  let res = []
  for (let i in route) {
    if (typeof route[i].route.title === 'function') {
      res.push({ title: route[i].route.title(route[i].match), url: route[i].match.url })
    } else {
      if (typeof route[i].route.title === 'string') {
        res.push({ title: route[i].route.title, url: route[i].match.url })
      }
    }
  }
  return res
}

const Breadcrumb = ({ route, root }) => {
  let pathArray = buildPath(route)
  pathArray = [ root ].concat(pathArray)
  const breadcrumbPaths = []
  for (let i = 0; i < pathArray.length; i++) {
    if ((i + 1) === pathArray.length) {
      breadcrumbPaths.push(<li key={pathArray[i].url} className='active'>{pathArray[i].title}</li>)
    } else {
      breadcrumbPaths.push(<li key={pathArray[i].url}><Link to={pathArray[i].url}>{pathArray[i].title}</Link></li>)
    }
  }

  return (<ol className={`breadcrumb ${style['breadcrumb']}`}>
    {breadcrumbPaths}
  </ol>)
}

Breadcrumb.propTypes = {
  route: PropTypes.array.isRequired,
  root: PropTypes.object.isRequired,
}

const findExactMatch = (branches) => {
  if (branches.length === 1) {
    return branches[0]
  } else {
    for (let i = 0; i < branches.length; i++) {
      if (branches[i].match.isExact) {
        return branches[i]
      }
    }
  }
  return null
}

class PageRouter extends React.Component {
  componentDidUpdate () {
    if (this.props.routeReducer.get('redirect') && this.props.routeReducer.get('redirect') !== this.props.location.pathname) {
      this.props.onRedirect()
    }
  }

  render () {
    let { route, location, history, routeReducer } = this.props
    if (routeReducer.get('redirect') && routeReducer.get('redirect') !== location.pathname) {
      return (<Redirect to={routeReducer.get('redirect')} />)
    }
    const branches = matchRoutes(route.routes, location.pathname)

    let branch = findExactMatch(branches)
    let tools = []
    if (branch) {
      for (let i in branch.route.toolbars) {
        tools.push(branch.route.toolbars[i](branch.match))
      }
    }

    const RenderComponent = branch.route.component
    return (<div className={style['navbar-top-offset']}>
      <Breadcrumb route={branches} root={{ title: 'Virtual Machines', url: '/' }} />
      <Toolbar>
        {tools}
      </Toolbar>
      <RenderComponent route={branch.route} match={branch.match} location={location} history={history} />
    </div>)
  }
}

PageRouter.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  routeReducer: PropTypes.object.isRequired,
  onRedirect: PropTypes.func.isRequired,
}

export default withRouter(connect(
  (state) => ({
    routeReducer: state.route,
  }),
  (dispatch) => ({
    onRedirect: () => dispatch(redirectRoute({ route: null })),
  })
)(PageRouter))
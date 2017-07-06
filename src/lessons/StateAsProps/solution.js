////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Using Recompose and the container/presentational component pattern:
// - Render a tab for each country with its name in the tab
// - Make it so that you can click on a tab and it will appear active
//   while the others appear inactive. (Hint: this will require withState and withHandlers)
// - Make it so the panel renders the correct content for the selected tab
//
// Don't forget to refer to the recompose docs!
// https://github.com/acdlite/recompose/blob/master/docs/API.md
//
// Got extra time?
//
// - Make <Tabs> generic so that it doesn't know anything about
//   country data (Hint: good propTypes help)
////////////////////////////////////////////////////////////////////////////////
import React from 'react'
import pt from 'prop-types'
import { compose, withState, withHandlers } from 'recompose'
import classnames from 'classnames'
import './index.scss'

const TabComponent = ({ content, style, onClick, isActive }) => {
  const classNames = classnames('tab', { active: isActive })
  return (
    <div className={classNames} onClick={onClick}>
      {content}
    </div>
  )
}

TabComponent.propTypes = {
  content: pt.string.isRequired,
  onClick: pt.func.isRequired,
  isActive: pt.bool,
}

const Tab = withHandlers({
  onClick: ({ index, onClickUpdateIndex }) => () => onClickUpdateIndex(index),
})(TabComponent)

const TabsComponent = ({ data, activeTabIndex, updateActiveTabIndex }) => {
  const tabs = data.map((country, index) => {
    const isActive = index === activeTabIndex
    return (
      <Tab
        key={country.id}
        index={index}
        isActive={isActive}
        content={country.name}
        onClickUpdateIndex={updateActiveTabIndex}
      />
    )
  })
  const activeCountry = data[activeTabIndex]
  const content = activeCountry && activeCountry.description
  return (
    <div className="tabs">
      {tabs}
      <div className="panel">
        {content}
      </div>
    </div>
  )
}

TabsComponent.propTypes = {
  data: pt.array.isRequired,
  activeTabIndex: pt.number.isRequired,
  updateActiveTabIndex: pt.func.isRequired,
}

const Tabs = compose(
  withState('activeTabIndex', 'updateActiveTabIndex', 0),
  withHandlers({
    selectTabIndex: ({ updateActiveTabIndex }) => activeTabIndex => {
      updateActiveTabIndex(activeTabIndex)
    },
  }),
)(TabsComponent)

const defaultState = [
  { id: 1, name: 'USA', description: 'Land of the Free, Home of the brave' },
  { id: 2, name: 'Brazil', description: 'Sunshine, beaches, and Carnival' },
  { id: 3, name: 'Russia', description: 'World Cup 2018!' },
]

const AppComponent = ({ countries }) => (
  <div className="state-as-props">
    <h1>Countries</h1>
    <Tabs data={countries} />
  </div>
)

AppComponent.propTypes = {
  countries: pt.array.isRequired,
}

const App = withState('countries', 'updateCountries', defaultState)(AppComponent)

export { App as Solution }
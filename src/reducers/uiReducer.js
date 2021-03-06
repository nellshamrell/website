// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { combineReducers } from 'redux'
import { ROUTE_CURATE, ROUTE_DEFINITIONS, ROUTE_HARVEST, ROUTE_ABOUT, ROUTE_INSPECT } from '../utils/routingConstants'
import {
  UI_NAVIGATION,
  UI_NOTIFICATION_NEW,
  UI_NOTIFICATION_DELETE,
  UI_CURATE_UPDATE_FILTER,
  UI_CURATE_GET,
  UI_CURATE_GET_PROPOSED,
  UI_CURATE_GET_DEFINITION,
  UI_CURATE_GET_DEFINITION_PROPOSED,
  UI_CURATE_DEFINITION_PREVIEW,
  UI_BROWSE_UPDATE_FILTER,
  UI_BROWSE_UPDATE_LIST,
  UI_HARVEST_UPDATE_FILTER,
  UI_HARVEST_UPDATE_QUEUE,
  UI_INSPECT_UPDATE_FILTER,
  UI_INSPECT_GET_CURATION,
  UI_INSPECT_GET_DEFINITION,
  UI_INSPECT_GET_HARVESTED
} from '../actions/ui'
import listReducer, { initialState as initialListState } from './listReducer'
import { isEqual } from 'lodash'
import valueReducer from './valueReducer'
import itemReducer from './itemReducer'
import yaml from 'js-yaml'

/**
 * protected:
 * -1 - only public
 * 0 - common
 * 1 - only protected
 */
const initialStateNavigation = [
  {
    title: 'Browse',
    to: ROUTE_DEFINITIONS,
    protected: 0,
    isSelected: false
  },
  {
    title: 'Inspect',
    to: ROUTE_INSPECT,
    protected: 0,
    isSelected: false
  },
  {
    title: 'Curate',
    to: ROUTE_CURATE,
    protected: 0,
    isSelected: false
  },
  {
    title: 'Harvest',
    to: ROUTE_HARVEST,
    protected: 1,
    isSelected: false,
    permissions: ['harvest']
  },
  {
    title: 'About',
    to: ROUTE_ABOUT,
    protected: 0,
    isSelected: false
  }
]

const navigation = (state = initialStateNavigation, action) => {
  switch (action.type) {
    case UI_NAVIGATION:
      const selected = action.to
      return state.map(nav => {
        return { ...nav, isSelected: selected.to === nav.to }
      })
    default:
      return state
  }
}

const curate = combineReducers({
  filter: new valueReducer(UI_CURATE_UPDATE_FILTER),
  currentCuration: new itemReducer(UI_CURATE_GET),
  proposedCuration: new itemReducer(UI_CURATE_GET_PROPOSED),
  currentDefinition: new itemReducer(UI_CURATE_GET_DEFINITION),
  proposedDefinition: new itemReducer(UI_CURATE_GET_DEFINITION_PROPOSED),
  previewDefinition: new itemReducer(UI_CURATE_DEFINITION_PREVIEW)
})

const inspect = combineReducers({
  filter: new valueReducer(UI_INSPECT_UPDATE_FILTER),
  definition: new itemReducer(UI_INSPECT_GET_DEFINITION, item => yaml.safeDump(item, { sortKeys: true })),
  curation: new itemReducer(UI_INSPECT_GET_CURATION, item => yaml.safeDump(item, { sortKeys: true })),
  harvested: new itemReducer(UI_INSPECT_GET_HARVESTED, item => JSON.stringify(item, null, 2))
})

const componentList = listReducer(UI_BROWSE_UPDATE_LIST, null, isEqual)
const initialBrowse = { filter: null, componentList: initialListState }
const browse = (state = initialBrowse, action) => {
  switch (action.type) {
    case UI_BROWSE_UPDATE_FILTER:
      return { ...state, filter: action.value }
    case UI_BROWSE_UPDATE_LIST:
      return { ...state, componentList: componentList(state.componentList, action) }
    default:
      return state
  }
}

const harvestQueue = listReducer(UI_HARVEST_UPDATE_QUEUE, null, isEqual)
const initialHarvest = { filter: null, requestQueue: initialListState }
const harvest = (state = initialHarvest, action) => {
  switch (action.type) {
    case UI_HARVEST_UPDATE_FILTER:
      return { ...state, filter: action.value }
    case UI_HARVEST_UPDATE_QUEUE:
      return { ...state, requestQueue: harvestQueue(state.requestQueue, action) }
    default:
      return state
  }
}

const notifications = (state = [], action) => {
  const { type, message } = action
  switch (type) {
    case UI_NOTIFICATION_NEW:
      return [...state, message]
    case UI_NOTIFICATION_DELETE:
      return state.filter(x => x.id !== message.id)
    default:
      return state
  }
}

export default combineReducers({
  navigation,
  browse,
  inspect,
  curate,
  harvest,
  notifications
})

// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import { asyncActions } from './'
import { getDefinitions, getDefinition, previewDefinition, getDefinitionList } from '../api/clearlyDefined'

export const DEFINITION_GET = 'DEFINITION_GET'
export const DEFINITION_GET_PROPOSED = 'DEFINITION_GET_PROPOSED'
export const DEFINITION_PREVIEW = 'DEFINITION_PREVIEW'
export const DEFINITION_LIST = 'DEFINITION_LIST'
export const DEFINITION_BODIES = 'DEFINITION_BODIES'

export function getDefinitionAction(token, entity) {
  return (dispatch) => {
    const actions = asyncActions(entity.pr ? DEFINITION_GET_PROPOSED: DEFINITION_GET)
    dispatch(actions.start())
    return getDefinition(token, entity).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}

export function getDefinitionsAction(token, entities) {
  return (dispatch) => {
    const actions = asyncActions(DEFINITION_BODIES)
    dispatch(actions.start())
    return getDefinitions(token, entities).then(
      result => dispatch(actions.success({ add: result })),
      error => dispatch(actions.error(error))
    )
  }
}

export function getDefinitionListAction(token, prefix, force) {
  return (dispatch) => {
    const actions = asyncActions(DEFINITION_LIST)
    dispatch(actions.start())
    return getDefinitionList(token, prefix, force).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}

export function previewDefinitionAction(token, entity, curation) {
  return (dispatch) => {
    const actions = asyncActions(DEFINITION_PREVIEW)
    dispatch(actions.start())
    return previewDefinition(token, entity, curation).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}
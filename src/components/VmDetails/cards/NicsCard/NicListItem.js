import React from 'react'
import PropTypes from 'prop-types'

import { msg } from '_/intl'
import { escapeHtml } from '../../../utils'
import itemStyle from '../../itemListStyle.css'
import style from './style.css'

import { Icon } from 'patternfly-react'
import { Grid, Row, Col } from '_/components/Grid'
import DeleteConfirmationModal from '../../../VmModals/DeleteConfirmationModal'
import NicEditor from './NicEditor'
import NicLinkStateIcon from './NicLinkStateIcon'
import OverlayTooltip from '_/components/OverlayTooltip'

/**
 * Render a single NIC in the list of Nics on the Nics Card.
 *
 * If _edit_ then render the appropriate action buttons linked to provided
 * handler functions.
 */
const NicListItem = ({ idPrefix, nic, vmStatus, vnicProfileList, isEditing, onEdit, onDelete }) => {
  const canEdit = !!onEdit
  const canDelete = !!onDelete

  return <div className={itemStyle['item-row']}>
    {/* Status Column - content width only */}
    <span className={itemStyle['item-row-status']}>
      <NicLinkStateIcon linkState={nic.linked} idSuffix={nic.id} />
    </span>

    {/* Details Column - take the rest of the space */}
    <span className={itemStyle['item-row-info']}>
      <div>
        <span id={`${idPrefix}-name`}>{nic.name}</span>
        <span className={style['vnic-info']} id={`${idPrefix}-vnic-info`}>
          { nic.vnicProfile.id
            ? `(${nic.vnicProfile.name}/${nic.vnicProfile.network})`
            : `[${msg.nicNoVnicAssigned()}]`
          }
        </span>
      </div>
      <Grid>
        <Row>
          <Col cols={4} className={style['ip4-container']} id={`${idPrefix}-ipv4`}>
            { nic.ipv4.length > 0 &&
              <div>
                {nic.ipv4.map(ip4 => <div key={`${nic.id}-${ip4}`}>{msg.nicIP4()}: {ip4}</div>)}
              </div>
            }
          </Col>
          <Col cols={8} className={style['ip6-container']} id={`${idPrefix}-ipv6`}>
            { nic.ipv6.length > 0 &&
              <div>
                {nic.ipv6.map(ip6 => <div key={`${nic.id}-${ip6}`}>{msg.nicIP6()}: {ip6}</div>)}
              </div>
            }
          </Col>
        </Row>
      </Grid>
    </span>

    {/* Actions Column (if edit) - content width, no wrapping */}
    { isEditing &&
    <span className={itemStyle['item-row-actions']} id={`${idPrefix}-actions`}>
      { canEdit &&
        <NicEditor
          idPrefix={`${idPrefix}-edit`}
          nic={nic}
          vmStatus={vmStatus}
          vnicProfileList={vnicProfileList}
          onSave={onEdit}
          trigger={
            <OverlayTooltip id={`${idPrefix}-edit-tooltip`} tooltip={msg.nicEditTooltip()}>
              <a id={`${idPrefix}-edit-action`} className={itemStyle['item-action']}>
                <Icon type='pf' name='edit' />
              </a>
            </OverlayTooltip>
          }
        />
      }
      { !canEdit &&
        <OverlayTooltip id={`${idPrefix}-edit-tooltip-disabled`} tooltip={msg.nicEditDisabledTooltip()}>
          <Icon
            type='pf'
            name='edit'
            id={`${idPrefix}-edit-action-disabled`}
            className={`${itemStyle['item-action']} ${itemStyle['item-action-disabled']}`}
          />
        </OverlayTooltip>
      }

      { canDelete &&
        <DeleteConfirmationModal
          id={`${idPrefix}-delete-modal`}
          onDelete={() => { onDelete(nic.id) }}
          trigger={
            <OverlayTooltip id={`${idPrefix}-delete-tooltip`} tooltip={msg.nicDeleteTooltip()}>
              <a id={`${idPrefix}-delete-action`} className={itemStyle['item-action']}>
                <Icon type='pf' name='delete' />
              </a>
            </OverlayTooltip>
          }
        >
          <span
            dangerouslySetInnerHTML={{
              __html: msg.areYouSureYouWantToDeleteNic({
                nicName: `"<strong>${escapeHtml(nic.name)}</strong>"`,
              }),
            }}
          />
        </DeleteConfirmationModal>
      }
      { !canDelete &&
        <OverlayTooltip id={`${idPrefix}-delete-tooltip-disabled`} tooltip={msg.nicDeleteDisabledTooltip()}>
          <Icon
            type='pf'
            name='delete'
            id={`${idPrefix}-delete-action-disabled`}
            className={`${itemStyle['item-action']} ${itemStyle['item-action-disabled']}`}
          />
        </OverlayTooltip>
      }
    </span>
    }
  </div>
}
NicListItem.propTypes = {
  idPrefix: PropTypes.string.isRequired,
  nic: PropTypes.object.isRequired,
  vmStatus: PropTypes.string.isRequired,
  vnicProfileList: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,

  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
}

export default NicListItem

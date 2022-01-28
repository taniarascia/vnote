import React, { useEffect, useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import { useDispatch, useSelector } from 'react-redux'
import {
  Eye,
  Edit,
  Star,
  Trash2,
  Download,
  RefreshCw,
  Loader,
  Settings,
  Sun,
  Moon,
  Clipboard as ClipboardCmp,
} from 'react-feather'

import { TestID } from '@resources/TestID'
import { LastSyncedNotification } from '@/components/LastSyncedNotification'
import { NoteItem, CategoryItem } from '@/types'
import {
  toggleSettingsModal,
  togglePreviewMarkdown,
  toggleDarkTheme,
  updateCodeMirrorOption,
} from '@/slices/settings'
import { toggleFavoriteNotes, toggleTrashNotes } from '@/slices/note'
import { getCategories, getNotes, getSync, getSettings } from '@/selectors'
import { downloadNotes, isDraftNote, getShortUuid, copyToClipboard } from '@/utils/helpers'
import { sync } from '@/slices/sync'

export const NoteMenuBar = () => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { notes, activeNoteId } = useSelector(getNotes)
  const { categories } = useSelector(getCategories)
  const { syncing, lastSynced, pendingSync } = useSelector(getSync)
  const { darkTheme } = useSelector(getSettings)

  // ===========================================================================
  // Other
  // ===========================================================================

  const copyNoteIcon = <ClipboardCmp size={18} aria-hidden="true" focusable="false" />
  const successfulCopyMessage = 'Note copied!'
  const activeNote = notes.find((note) => note.id === activeNoteId)!
  const shortNoteUuid = getShortUuid(activeNoteId)

  // ===========================================================================
  // State
  // ===========================================================================

  const [uuidCopiedText, setUuidCopiedText] = useState<string>('')
  const [isToggled, togglePreviewIcon] = useState<boolean>(false)

  // ===========================================================================
  // Hooks
  // ===========================================================================

  useEffect(() => {
    if (uuidCopiedText === successfulCopyMessage) {
      const timer = setTimeout(() => {
        setUuidCopiedText('')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [uuidCopiedText])

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()

  const _togglePreviewMarkdown = () => dispatch(togglePreviewMarkdown())
  const _toggleTrashNotes = (noteId: string) => dispatch(toggleTrashNotes(noteId))
  const _toggleFavoriteNotes = (noteId: string) => dispatch(toggleFavoriteNotes(noteId))
  const _sync = (notes: NoteItem[], categories: CategoryItem[]) =>
    dispatch(sync({ notes, categories }))
  const _toggleSettingsModal = () => dispatch(toggleSettingsModal())
  const _toggleDarkTheme = () => dispatch(toggleDarkTheme())
  const _updateCodeMirrorOption = (key: string, value: any) =>
    dispatch(updateCodeMirrorOption({ key, value }))

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const downloadNotesHandler = () => downloadNotes([activeNote], categories)
  const favoriteNoteHandler = () => _toggleFavoriteNotes(activeNoteId)
  const trashNoteHandler = () => _toggleTrashNotes(activeNoteId)
  const syncNotesHandler = () => _sync(notes, categories)
  const settingsHandler = () => _toggleSettingsModal()
  const toggleDarkThemeHandler = () => {
    _toggleDarkTheme()
    _updateCodeMirrorOption('theme', darkTheme ? 'base16-light' : 'new-moon')
  }
  const togglePreviewHandler = () => {
    togglePreviewIcon(!isToggled)
    _togglePreviewMarkdown()
  }

  return (
    <section className="note-menu-bar">
      {activeNote && !isDraftNote(activeNote) ? (
        <nav>
          <button
            className="note-menu-bar-button"
            onClick={togglePreviewHandler}
            data-testid={TestID.PREVIEW_MODE}
          >
            {isToggled ? (
              <Tooltip title="Edit">
                <IconButton>
                  <Edit aria-hidden="true" size={18} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Preview">
                <IconButton>
                  <Eye aria-hidden="true" size={18} />
                </IconButton>
              </Tooltip>
            )}
            <span className="sr-only">{isToggled ? 'Edit note' : 'Preview note'}</span>
          </button>
          {!activeNote.scratchpad && (
            <>
              <button className="note-menu-bar-button" onClick={favoriteNoteHandler}>
                <Tooltip title="Favorite">
                  <IconButton>
                    <Star aria-hidden="true" size={18} />
                  </IconButton>
                </Tooltip>
                <span className="sr-only">Add note to favorites</span>
              </button>
              <button className="note-menu-bar-button trash" onClick={trashNoteHandler}>
                <Tooltip title="Delete">
                  <IconButton>
                    <Trash2 aria-hidden="true" size={18} />
                  </IconButton>
                </Tooltip>
                <span className="sr-only">Delete note</span>
              </button>
            </>
          )}
          <button className="note-menu-bar-button">
            <Tooltip title="Download">
              <IconButton>
                <Download aria-hidden="true" size={18} onClick={downloadNotesHandler} />
              </IconButton>
            </Tooltip>
            <span className="sr-only">Download note</span>
          </button>
          <button
            className="note-menu-bar-button uuid"
            onClick={() => {
              copyToClipboard(`{{${shortNoteUuid}}}`)
              setUuidCopiedText(successfulCopyMessage)
            }}
            data-testid={TestID.UUID_MENU_BAR_COPY_ICON}
          >
            {
              <Tooltip title="Copy">
                <IconButton>
                  <ClipboardCmp size={18} aria-hidden="true" focusable="false" />
                </IconButton>
              </Tooltip>
            }

            {uuidCopiedText && <span className="uuid-copied-text">{uuidCopiedText}</span>}
            <span className="sr-only">Copy note</span>
          </button>
        </nav>
      ) : (
        <div />
      )}
      <nav>
        <LastSyncedNotification datetime={lastSynced} pending={pendingSync} syncing={syncing} />
        <button
          className="note-menu-bar-button"
          onClick={syncNotesHandler}
          data-testid={TestID.TOPBAR_ACTION_SYNC_NOTES}
        >
          {syncing ? (
            <Tooltip title="Syncing">
              <IconButton>
                <Loader aria-hidden="true" size={18} className="rotating-svg" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Refresh">
              <IconButton>
                <RefreshCw aria-hidden="true" size={18} />
              </IconButton>
            </Tooltip>
          )}
          <span className="sr-only">Sync notes</span>
        </button>
        <button className="note-menu-bar-button" onClick={toggleDarkThemeHandler}>
          {darkTheme ? (
            <Tooltip title="Light Theme">
              <IconButton>
                <Sun aria-hidden="true" size={18} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Dark Theme">
              <IconButton>
                <Moon aria-hidden="true" size={18} />
              </IconButton>
            </Tooltip>
          )}
          <span className="sr-only">Themes</span>
        </button>

        <button className="note-menu-bar-button" onClick={settingsHandler}>
          <Tooltip title="Settings">
            <IconButton>
              <Settings aria-hidden="true" size={18} />
            </IconButton>
          </Tooltip>
          <span className="sr-only">Settings</span>
        </button>
      </nav>
    </section>
  )
}

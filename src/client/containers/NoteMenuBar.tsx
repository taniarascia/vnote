import React, { useEffect, useState } from 'react'
import {
  Clipboard as ClipboardCmp,
  Download,
  Edit,
  Eye,
  Loader,
  Moon,
  RefreshCw,
  Settings,
  Star,
  Sun,
  Trash2,
} from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'

import { LastSyncedNotification } from '@/components/LastSyncedNotification'
import { StyledTooltipButton } from '@/components/StyledTooltipButton'
import { getCategories, getNotes, getSettings, getSync } from '@/selectors'
import { toggleFavoriteNotes, toggleTrashNotes } from '@/slices/note'
import {
  toggleDarkTheme,
  togglePreviewMarkdown,
  toggleSettingsModal,
  updateCodeMirrorOption,
} from '@/slices/settings'
import { sync } from '@/slices/sync'
import { CategoryItem, NoteItem } from '@/types'
import { Shortcuts } from '@/utils/enums'
import { copyToClipboard, downloadNotes, getShortUuid, isDraftNote } from '@/utils/helpers'
import { TestID } from '@resources/TestID'

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
  const [isToggled, setIsToggled] = useState<boolean>(false)

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
    setIsToggled(!isToggled)
    _togglePreviewMarkdown()
  }

  return (
    <section className="note-menu-bar">
      {activeNote && !isDraftNote(activeNote) ? (
        <nav>
          <StyledTooltipButton
            className="note-menu-bar-button"
            onClick={togglePreviewHandler}
            data-testid={TestID.PREVIEW_MODE}
            content={isToggled ? 'Edit note' : 'Preview note'}
          >
            {isToggled ? (
              <Edit aria-hidden="true" size={18} />
            ) : (
              <Eye aria-hidden="true" size={18} />
            )}
            <span className="sr-only">{isToggled ? 'Edit note' : 'Preview note'}</span>
          </StyledTooltipButton>
          {!activeNote.scratchpad && (
            <>
              <StyledTooltipButton
                content="Add note to favorites"
                className="note-menu-bar-button"
                onClick={favoriteNoteHandler}
              >
                <Star aria-hidden="true" size={18} />
                <span className="sr-only">Add note to favorites</span>
              </StyledTooltipButton>

              <StyledTooltipButton
                content="Trash"
                className="note-menu-bar-button trash"
                onClick={trashNoteHandler}
              >
                <Trash2 aria-hidden="true" size={18} />
                <span className="sr-only">Delete note</span>
              </StyledTooltipButton>
            </>
          )}

          <StyledTooltipButton
            onClick={downloadNotesHandler}
            content="Add note to favorites"
            className="note-menu-bar-button"
          >
            <Download aria-hidden="true" size={18} />
            <span className="sr-only">Download note</span>
          </StyledTooltipButton>

          <StyledTooltipButton
            content="Copy note"
            className="note-menu-bar-button uuid"
            onClick={() => {
              copyToClipboard(`{{${shortNoteUuid}}}`)
              setUuidCopiedText(successfulCopyMessage)
            }}
            data-testid={TestID.UUID_MENU_BAR_COPY_ICON}
          >
            {copyNoteIcon}
            {uuidCopiedText && <span className="uuid-copied-text">{uuidCopiedText}</span>}
            <span className="sr-only">Copy note</span>
          </StyledTooltipButton>
        </nav>
      ) : (
        <div />
      )}
      <nav>
        <LastSyncedNotification datetime={lastSynced} pending={pendingSync} syncing={syncing} />
        <StyledTooltipButton
          content={`Sync notes (${Shortcuts.SYNC_NOTES})`}
          className="note-menu-bar-button"
          onClick={syncNotesHandler}
          data-testid={TestID.TOPBAR_ACTION_SYNC_NOTES}
        >
          {syncing ? (
            <Loader aria-hidden="true" size={18} className="rotating-svg" />
          ) : (
            <RefreshCw aria-hidden="true" size={18} />
          )}
          <span className="sr-only">Sync notes</span>
        </StyledTooltipButton>
        <StyledTooltipButton
          className="note-menu-bar-button"
          onClick={toggleDarkThemeHandler}
          content={darkTheme ? 'Toggle light theme' : 'Toggle dark theme'}
          place="top-end"
        >
          {darkTheme ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}
          <span className="sr-only">Themes</span>
        </StyledTooltipButton>

        <StyledTooltipButton
          className="note-menu-bar-button"
          onClick={settingsHandler}
          place="top-end"
          content="Settings"
        >
          <Settings aria-hidden="true" size={18} />
          <span className="sr-only">Settings</span>
        </StyledTooltipButton>
      </nav>
    </section>
  )
}

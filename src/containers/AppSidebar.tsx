import kebabCase from 'lodash/kebabCase'
import React, { useState } from 'react'
import { Book, Bookmark, Folder, Plus, Settings, Trash2, UploadCloud, X } from 'react-feather'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import {
  addCategory,
  addNote,
  deleteCategory,
  pruneCategoryFromNotes,
  swapCategory,
  swapFolder,
  swapNote,
  syncState,
  toggleSettingsModal,
  toggleTrashedNote,
  addCategoryToNote,
  toggleFavoriteNote,
} from 'actions'
import { Folders } from 'constants/enums'
import { useKeyboard } from 'contexts/KeyboardContext'
import { newNote } from 'helpers'
import { ApplicationState, CategoryItem, NoteItem } from 'types'

const iconColor = 'rgba(255, 255, 255, 0.25)'

interface AppProps {
  addNote: (note: NoteItem) => void
  activeNote?: NoteItem
  addCategory: (category: CategoryItem) => void
  deleteCategory: (categoryId: string) => void
  pruneCategoryFromNotes: (categoryId: string) => void
  swapCategory: (categoryId: string) => void
  swapFolder: (folder: string) => void
  swapNote: (swapNote: string) => void
  notes: NoteItem[]
  categories: CategoryItem[]
  activeCategoryId: string
  activeFolder: string
  syncState: (notes: NoteItem[], categories: CategoryItem[]) => void
  toggleSettingsModal: () => void
  toggleTrashedNote: (noteId: string) => void
  addCategoryToNote: (categoryId: string, noteId: string) => void
  toggleFavoriteNote: (noteId: string) => void
}

const AppSidebar: React.FC<AppProps> = ({
  addNote,
  activeNote,
  addCategory,
  deleteCategory,
  pruneCategoryFromNotes,
  swapCategory,
  swapFolder,
  swapNote,
  notes,
  categories,
  activeCategoryId,
  activeFolder,
  syncState,
  toggleSettingsModal,
  toggleTrashedNote,
  addCategoryToNote,
  toggleFavoriteNote,
}) => {
  const { addingTempCategory, setAddingTempCategory } = useKeyboard()
  const [tempCategory, setTempCategory] = useState('')

  const newTempCategoryHandler = () => {
    !addingTempCategory && setAddingTempCategory(true)
  }

  const newNoteHandler = () => {
    if ((activeNote && activeNote.text !== '') || !activeNote) {
      const note = newNote(activeCategoryId, activeFolder)

      addNote(note)
      swapNote(note.id)
    }
  }

  const onSubmit = (
    event: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>
  ): void => {
    event.preventDefault()

    const category = { id: kebabCase(tempCategory), name: tempCategory }

    if (!categories.find(cat => cat.id === kebabCase(tempCategory))) {
      addCategory(category)

      setTempCategory('')
      setAddingTempCategory(false)
    }
  }

  const syncNotesHandler = () => {
    syncState(notes, categories)
  }

  const settingsHandler = () => {
    toggleSettingsModal()
  }

  const allowDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const trashNoteHandler = (event: React.DragEvent<HTMLDivElement>) => {
    toggleTrashedNote(event.dataTransfer.getData('text'))
  }

  const favoriteNoteHandler = (event: React.DragEvent<HTMLDivElement>) => {
    toggleFavoriteNote(event.dataTransfer.getData('text'))
  }

  return (
    <aside className="app-sidebar">
      <section className="app-sidebar-main">
        <div
          className={activeFolder === Folders.ALL ? 'app-sidebar-link active' : 'app-sidebar-link'}
          onClick={() => {
            swapFolder(Folders.ALL)
          }}
        >
          <Book size={15} style={{ marginRight: '.75rem' }} color={iconColor} />
          All Notes
        </div>
        <div
          className={
            activeFolder === Folders.FAVORITES ? 'app-sidebar-link active' : 'app-sidebar-link'
          }
          onClick={() => {
            swapFolder(Folders.FAVORITES)
          }}
          onDrop={favoriteNoteHandler}
          onDragOver={allowDrop}
        >
          <Bookmark size={15} style={{ marginRight: '.75rem' }} color={iconColor} />
          Favorites
        </div>
        <div
          className={
            activeFolder === Folders.TRASH ? 'app-sidebar-link active' : 'app-sidebar-link'
          }
          onClick={() => {
            swapFolder(Folders.TRASH)
          }}
          onDrop={trashNoteHandler}
          onDragOver={allowDrop}
        >
          <Trash2 size={15} style={{ marginRight: '.75rem' }} color={iconColor} />
          Trash
        </div>

        <div className="category-title vbetween">
          <h2>Categories</h2>
          <button className="add-category-button" onClick={newTempCategoryHandler}>
            <Plus size={15} color={iconColor} />
          </button>
        </div>
        <div className="category-list">
          {categories.map(category => {
            return (
              <div
                key={category.id}
                className={
                  category.id === activeCategoryId ? 'category-each active' : 'category-each'
                }
                onClick={() => {
                  const notesForNewCategory = notes.filter(
                    note => !note.trash && note.category === category.id
                  )
                  const newNoteId = notesForNewCategory.length > 0 ? notesForNewCategory[0].id : ''
                  if (category.id !== activeCategoryId) {
                    swapCategory(category.id)
                    swapNote(newNoteId)
                  }
                }}
                onDrop={event => {
                  addCategoryToNote(category.id, event.dataTransfer.getData('noteId'))
                }}
                onDragOver={allowDrop}
              >
                <div className="category-each-name">
                  <Folder size={15} style={{ marginRight: '.75rem' }} color={iconColor} />
                  {category.name}
                </div>
                <div
                  className="category-options"
                  onClick={() => {
                    const notesNotTrash = notes.filter(note => !note.trash)
                    const newNoteId = notesNotTrash.length > 0 ? notesNotTrash[0].id : ''

                    deleteCategory(category.id)
                    pruneCategoryFromNotes(category.id)
                    swapFolder(Folders.ALL)
                    swapNote(newNoteId)
                  }}
                >
                  <X size={12} />
                </div>
              </div>
            )
          })}
        </div>
        {addingTempCategory && (
          <form className="add-category-form" onSubmit={onSubmit}>
            <input
              autoFocus
              placeholder="New category..."
              onChange={event => {
                setTempCategory(event.target.value)
              }}
              onBlur={event => {
                if (!tempCategory) {
                  setAddingTempCategory(false)
                } else {
                  onSubmit(event)
                }
              }}
            />
          </form>
        )}
      </section>
      <section className="app-sidebar-actions">
        <div>
          {activeFolder !== Folders.TRASH && (
            <Plus className="action-button" size={18} color={iconColor} onClick={newNoteHandler} />
          )}
          <UploadCloud
            size={18}
            className="action-button"
            color={iconColor}
            onClick={syncNotesHandler}
          />
          <Settings
            size={18}
            className="action-button"
            color={iconColor}
            onClick={settingsHandler}
          />
        </div>
      </section>
    </aside>
  )
}

const mapStateToProps = (state: ApplicationState) => ({
  activeNote: state.noteState.notes.find(note => note.id === state.noteState.activeNoteId),
  activeFolder: state.noteState.activeFolder,
  activeCategoryId: state.noteState.activeCategoryId,
  categories: state.categoryState.categories,
  notes: state.noteState.notes,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addNote: (note: NoteItem) => dispatch(addNote(note)),
  swapNote: (noteId: string) => dispatch(swapNote(noteId)),
  swapCategory: (categoryId: string) => dispatch(swapCategory(categoryId)),
  swapFolder: (folder: string) => dispatch(swapFolder(folder)),
  addCategory: (category: CategoryItem) => dispatch(addCategory(category)),
  deleteCategory: (categoryId: string) => dispatch(deleteCategory(categoryId)),
  pruneCategoryFromNotes: (categoryId: string) => dispatch(pruneCategoryFromNotes(categoryId)),
  syncState: (notes: NoteItem[], categories: CategoryItem[]) =>
    dispatch(syncState(notes, categories)),
  toggleSettingsModal: () => dispatch(toggleSettingsModal()),
  toggleTrashedNote: (noteId: string) => dispatch(toggleTrashedNote(noteId)),
  addCategoryToNote: (categoryId: string, noteId: string) =>
    dispatch(addCategoryToNote(categoryId, noteId)),
  toggleFavoriteNote: (noteId: string) => dispatch(toggleFavoriteNote(noteId)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppSidebar)

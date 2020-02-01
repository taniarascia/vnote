// note.spec.ts
// Tests for managing notes (create, trash, favorite, etc)

import { TestIDEnum, TextEnum } from './utils/testHelperEnums'
import {
  defaultInit,
  getNoteCount,
  navigateToAllNotes,
  navigateToFavorites,
  navigateToTrash,
  testIDShouldContain,
  testIDShouldNotExist,
} from './utils/testHelperUtils'
import {
  assertNewNoteCreated,
  assertNoteEditorCharacterCount,
  assertNoteEditorLineCount,
  assertNoteListLengthEquals,
  assertNoteListLengthGTE,
  assertNoteOptionsOpened,
  clickCreateNewNote,
  clickEmptyTrash,
  clickNoteAtIndex,
  clickNoteOptionDeleteNotePermanently,
  clickNoteOptionFavorite,
  clickNoteOptionRestoreFromTrash,
  clickNoteOptionTrash,
  clickNoteOptions,
  clickSyncNotes,
  typeNoteEditor,
} from './utils/testNotesHelperUtils'

describe('Manage notes test', () => {
  defaultInit()

  before(() => {
    // Delete welcome note
    clickNoteOptions()
    clickNoteOptionTrash()
  })

  beforeEach(() => {
    navigateToAllNotes()
    clickCreateNewNote()
  })

  it('should have a welcome note', () => {
    assertNoteListLengthEquals(2)
    clickNoteAtIndex(1)
    cy.get('.note-list-each.active').should('contain', TextEnum.WELCOME_TO_TAKENOTE)
  })

  it('should try to create a few new notes', () => {
    clickCreateNewNote()
    assertNoteListLengthEquals(2)
    assertNewNoteCreated()

    clickCreateNewNote()
    assertNoteListLengthEquals(2)
    assertNewNoteCreated()

    clickCreateNewNote()
    assertNoteListLengthEquals(2)
    assertNewNoteCreated()
  })

  it('should update a note', () => {
    const sampleText = 'Sample note text.'

    // add some text to the editor
    typeNoteEditor(sampleText)
    assertNoteEditorLineCount(1)
    assertNoteEditorCharacterCount(sampleText.length)

    typeNoteEditor('{enter}123')
    assertNoteEditorLineCount(2)
    assertNoteEditorCharacterCount(sampleText.length + 3)

    typeNoteEditor('{backspace}{backspace}{backspace}{backspace}')
    assertNoteEditorLineCount(1)
    assertNoteEditorCharacterCount(sampleText.length)

    // clean up state
    clickNoteOptions()
    clickNoteOptionTrash()
    clickCreateNewNote()
    navigateToTrash()
    clickEmptyTrash()
  })

  it('should open options', () => {
    clickNoteOptions()
    assertNoteOptionsOpened()
  })

  it('should add a note to favorites', () => {
    // make sure favorites is empty
    navigateToFavorites()
    assertNoteListLengthEquals(0)

    // favorite the note in All Notes
    navigateToAllNotes()
    clickNoteOptions()
    testIDShouldContain(TestIDEnum.NOTE_OPTION_FAVORITE, TextEnum.MARK_AS_FAVORITE)
    clickNoteOptionFavorite()

    // assert there is 1 favorited note
    navigateToFavorites()
    assertNoteListLengthEquals(1)

    // assert button now says 'Remove'
    clickNoteOptions()
    testIDShouldContain(TestIDEnum.NOTE_OPTION_FAVORITE, TextEnum.REMOVE_FAVORITE)
    clickNoteOptionFavorite()

    // assert favorites is empty
    assertNoteListLengthEquals(0)
  })

  it('should send a note to trash', () => {
    // make sure trash is currently empty
    navigateToTrash()
    assertNoteListLengthEquals(0)

    // navigate back to All Notes and move the note to trash
    navigateToAllNotes()
    clickNoteOptions()
    testIDShouldContain(TestIDEnum.NOTE_OPTION_TRASH, TextEnum.MOVE_TO_TRASH)
    clickNoteOptionTrash()
    testIDShouldNotExist(TestIDEnum.NOTE_OPTION_TRASH)

    // make sure the new note is in the trash
    navigateToTrash()
    assertNoteListLengthEquals(1)
  })

  it('should empty notes in trash', () => {
    // move note to trash
    clickNoteOptions()
    clickNoteOptionTrash()

    // make sure there is a note in the trash and empty it
    navigateToTrash()
    assertNoteListLengthGTE(1)
    clickEmptyTrash()
    assertNoteListLengthEquals(0)

    // assert the empty trash button is gone
    testIDShouldNotExist(TestIDEnum.EMPTY_TRASH_BUTTON)
  })

  it('should delete the active note in the trash permanently', () => {
    // move note to trash
    clickNoteOptions()
    clickNoteOptionTrash()

    // navigate to trash and delete the active note permanently
    navigateToTrash()
    clickNoteOptions()
    testIDShouldContain(TestIDEnum.NOTE_OPTION_DELETE_PERMANENTLY, TextEnum.DELETE_PERMANENTLY)
    clickNoteOptionDeleteNotePermanently()
    assertNoteListLengthEquals(0)

    // assert the empty trash button is gone
    testIDShouldNotExist(TestIDEnum.EMPTY_TRASH_BUTTON)
  })

  it('should restore the active note in the trash', function() {
    getNoteCount('allNoteStartCount')

    // move note to trash and make sure All Notes is empty
    clickNoteOptions()
    clickNoteOptionTrash()
    cy.then(() => assertNoteListLengthEquals(this.allNoteStartCount - 1))

    // navigate to trash and restore the active note
    navigateToTrash()
    getNoteCount('trashStartCount')
    clickNoteOptions()
    testIDShouldContain(TestIDEnum.NOTE_OPTION_RESTORE_FROM_TRASH, TextEnum.RESTORE_FROM_TRASH)
    clickNoteOptionRestoreFromTrash()
    cy.then(() => assertNoteListLengthEquals(this.trashStartCount - 1))

    // assert the empty trash button is gone
    testIDShouldNotExist(TestIDEnum.EMPTY_TRASH_BUTTON)

    // make sure the note is back in All Notes
    navigateToAllNotes()
    assertNoteListLengthEquals(2)
  })

  it('should sync some notes', function() {
    // start with a refresh so we know our current saved state
    cy.reload()
    getNoteCount('allNoteStartCount')

    // create a new note and refresh without syncing
    clickCreateNewNote()
    typeNoteEditor('note1')
    cy.reload()
    cy.then(() => assertNoteListLengthEquals(this.allNoteStartCount))

    // create a couple new notes and sync them
    clickCreateNewNote()
    typeNoteEditor('note2')
    clickCreateNewNote()
    typeNoteEditor('note3')
    clickSyncNotes()

    // make sure notes persisted
    cy.reload()
    cy.then(() => assertNoteListLengthEquals(this.allNoteStartCount + 2))
  })
})

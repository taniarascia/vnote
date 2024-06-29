import { v4 as uuid } from 'uuid'
import dayjs from 'dayjs'

import { NoteItem, SyncPayload, SettingsState } from '@/types'

const scratchpadNote = {
  id: uuid(),
  text: `# Scratchpad

The easiest note to find this.`,
  category: '',
  scratchpad: true,
  favorite: false,
  created: dayjs().format(),
  lastUpdated: dayjs().format(),
}

const markdown = `# Welcome to Takenote!

TakeNote is a free, open-source notes app for the web. It is a demo project only, and does not integrate with any database or cloud. Your notes are saved in local storage and will not be permanently persisted, but are available for download.

View the source on [Github](https://github.com/taniarascia/takenote).

## Features

- **Plain text notes** - take notes in an IDE-like environment that makes no assumptions
- **Markdown preview** - view rendered HTML
- **Linked notes** - use \`{{uuid}}\` syntax to link to notes within other notes
- **Syntax highlighting** - light and dark mode available (based on the beautiful [New Moon theme](https://taniarascia.github.io/new-moon/))
- **Keyboard shortcuts** - use the keyboard for all common tasks - creating notes and categories, toggling settings, and other options
- **Drag and drop** - drag a note or multiple notes to categories, favorites, or trash
- **Multi-cursor editing** - supports multiple cursors and other [Codemirror](https://codemirror.net/) options
- **Search notes** - easily search all notes, or notes within a category
- **Prettify notes** - use Prettier on the fly for your Markdown
- **No WYSIWYG** - made for developers, by developers
- **No database** - notes are only stored in the browser's local storage and are available for download and export to you alone
- **No tracking or analytics** - 'nuff said
- **GitHub integration** - self-hosted option is available for auto-syncing to a GitHub repository (not available in the demo)
`

const welcomeNote = {
  id: uuid(),
  text: markdown,
  category: '',
  favorite: false,
  created: dayjs().format(),
  lastUpdated: dayjs().format(),
}

type PromiseCallback = (value?: any) => void
type GetLocalStorage = (
  key: string,
  errorMessage?: string
) => (resolve: PromiseCallback, reject: PromiseCallback) => void

const getLocalStorage: GetLocalStorage = (key, errorMessage = 'Something went wrong') => (
  resolve,
  reject
) => {
  const data = localStorage.getItem(key)

  if (data) {
    resolve(JSON.parse(data))
  } else {
    reject({
      message: errorMessage,
    })
  }
}

const getUserNotes = () => (resolve: PromiseCallback, reject: PromiseCallback) => {
  const notes: any = localStorage.getItem('notes')

  // check if there is any data in localstorage
  if (!notes) {
    // if there is none (i.e. new user), create the welcomeNote and scratchpadNote
    resolve([scratchpadNote, welcomeNote])
  } else if (Array.isArray(JSON.parse(notes))) {
    // if there is (existing user), show the user's notes
    resolve(
      // find does not work if the array is empty.
      JSON.parse(notes).length === 0 || !JSON.parse(notes).find((note: NoteItem) => note.scratchpad)
        ? [scratchpadNote, ...JSON.parse(notes)]
        : JSON.parse(notes)
    )
  } else {
    reject({
      message: 'Something went wrong',
    })
  }
}

export const saveState = ({ categories, notes }: SyncPayload) =>
  new Promise((resolve) => {
    localStorage.setItem('categories', JSON.stringify(categories))
    localStorage.setItem('notes', JSON.stringify(notes))

    resolve({
      categories: JSON.parse(localStorage.getItem('categories') || '[]'),
      notes: JSON.parse(localStorage.getItem('notes') || '[]'),
    })
  })

export const saveSettings = ({ isOpen, ...settings }: SettingsState) =>
  Promise.resolve(localStorage.setItem('settings', JSON.stringify(settings)))

export const requestNotes = () => new Promise(getUserNotes())
export const requestCategories = () => new Promise(getLocalStorage('categories'))
export const requestSettings = () => new Promise(getLocalStorage('settings'))

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { SettingsState } from '@/types'
import { NotesSortKey, DirectionText } from '@/utils/enums'

export const initialState: SettingsState = {
  previewMarkdown: false,
  darkTheme: false,
  sidebarVisible: true,
  notesSortKey: NotesSortKey.LAST_UPDATED,
  codeMirrorOptions: {
    mode: 'gfm',
    theme: 'base16-light',
    lineNumbers: false,
    lineWrapping: true,
    styleActiveLine: { nonEmpty: true },
    viewportMargin: Infinity,
    keyMap: 'default',
    dragDrop: false,
    direction: DirectionText.LEFT_TO_RIGHT,
    scrollPastEnd: false,
  },
  isOpen: false,
  loading: false,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleSettingsModal: (state) => {
      state.isOpen = !state.isOpen
    },

    updateCodeMirrorOption: (state, { payload }: PayloadAction<{ key: string; value: string }>) => {
      state.codeMirrorOptions[payload.key] = payload.value
    },

    togglePreviewMarkdown: (state) => {
      state.previewMarkdown = !state.previewMarkdown
    },

    toggleDarkTheme: (state) => {
      state.darkTheme = !state.darkTheme
    },

    updateNotesSortStrategy: (state, { payload }: PayloadAction<NotesSortKey>) => {
      state.notesSortKey = payload
    },

    loadSettings: (state) => {
      state.loading = true
    },

    loadSettingsError: (state) => {
      state.loading = false
    },

    loadSettingsSuccess: (state, { payload }: PayloadAction<SettingsState>) => {
      return { ...payload, loading: false }
    },
  },
})

export const {
  toggleSettingsModal,
  updateCodeMirrorOption,
  togglePreviewMarkdown,
  toggleDarkTheme,
  updateNotesSortStrategy,
  loadSettings,
  loadSettingsError,
  loadSettingsSuccess,
} = settingsSlice.actions

export default settingsSlice.reducer

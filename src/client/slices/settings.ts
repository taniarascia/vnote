import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { SettingsState } from '@/types'
import { NotesSortKey } from '@/utils/enums'

export const initialState: SettingsState = {
  isOpen: false,
  loading: false,
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
  },
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleSettingsModal: state => ({
      ...state,
      isOpen: !state.isOpen,
    }),
    updateCodeMirrorOption: (
      state,
      { payload }: PayloadAction<{ key: string; value: string }>
    ) => ({
      ...state,
      codeMirrorOptions: {
        ...state.codeMirrorOptions,
        [payload.key]: payload.value,
      },
    }),
    togglePreviewMarkdown: state => ({
      ...state,
      previewMarkdown: !state.previewMarkdown,
    }),
    toggleDarkTheme: state => ({
      ...state,
      darkTheme: !state.darkTheme,
    }),
    toggleSidebarVisibility: state => ({
      ...state,
      sidebarVisible: !state.sidebarVisible,
    }),
    updateNotesSortStrategy: (state, { payload }: PayloadAction<NotesSortKey>) => ({
      ...state,
      notesSortKey: payload,
    }),
    loadSettings: state => ({
      ...state,
      loading: true,
    }),
    loadSettingsError: state => ({
      ...state,
      loading: false,
    }),
    loadSettingsSuccess: (state, { payload }: PayloadAction<SettingsState>) => ({
      ...payload,
      isOpen: false,
      loading: false,
      notesSortKey: !state.notesSortKey ? NotesSortKey.LAST_UPDATED : state.notesSortKey,
    }),
  },
})

export const {
  toggleSettingsModal,
  updateCodeMirrorOption,
  toggleDarkTheme,
  togglePreviewMarkdown,
  toggleSidebarVisibility,
  updateNotesSortStrategy,
  loadSettings,
  loadSettingsError,
  loadSettingsSuccess,
} = settingsSlice.actions

export default settingsSlice.reducer

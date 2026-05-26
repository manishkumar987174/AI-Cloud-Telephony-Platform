import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null,
  loading: false,
  error: null,
}

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload },
    setError: (state, action) => { state.error = action.payload },
    setData: (state, action) => { state.data = action.payload },
    reset: () => initialState,
  },
})

export const { setLoading, setError, setData, reset } = contactSlice.actions
export default contactSlice.reducer

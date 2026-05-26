import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null,
  loading: false,
  error: null,
}

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload },
    setError: (state, action) => { state.error = action.payload },
    setData: (state, action) => { state.data = action.payload },
    reset: () => initialState,
  },
})

export const { setLoading, setError, setData, reset } = agentSlice.actions
export default agentSlice.reducer

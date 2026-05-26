import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import callReducer from './slices/callSlice'
import campaignReducer from './slices/campaignSlice'
import dashboardReducer from './slices/dashboardSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    call: callReducer,
    campaign: campaignReducer,
    dashboard: dashboardReducer,
  },
})

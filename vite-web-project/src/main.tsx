import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { searchHighlighter } from './searchBar'
import { setupShowHideToggle, setupCommentForm } from './comments'
import { loadBears } from './bearContentAPI'

searchHighlighter()
setupShowHideToggle()
setupCommentForm()
loadBears()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
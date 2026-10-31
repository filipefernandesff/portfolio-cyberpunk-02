import { lazy, Suspense } from 'react'
import App from './App'

// /materiais/* é outra "página": carregada sob demanda para não pesar no bundle da home.
const Materiais = lazy(() => import('./components/Materiais'))

export default function Raiz() {
  if (!/^\/materiais(\/|$)/.test(window.location.pathname)) return <App />
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07040f]" />}>
      <Materiais />
    </Suspense>
  )
}

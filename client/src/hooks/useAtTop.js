import { useEffect, useRef, useState } from 'react'

export const useAtTop = () => {
	const [atTop, setAtTop] = useState(true)
	const ref = useRef()

	useEffect(() => {
		if (!ref) return
		const cb = () => setAtTop(ref.current.scrollTop === 0)
		ref.current.addEventListener('scroll', cb)
		return () => {
			ref.current?.removeEventListener('scroll', cb)
		}
	}, [setAtTop, ref])
	
	return { atTop, ref }
}
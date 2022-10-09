import { useEffect, useRef, useState } from 'react'

export const useOnTop = () => {
	const [onTop, setOnTop] = useState(true)
	const ref = useRef()

	useEffect(() => {
		if (!ref) return
		const cb = () => setOnTop(ref.current.scrollTop === 0)
		ref.current.addEventListener('scroll', cb)
		return () => {
			ref.current?.removeEventListener('scroll', cb)
		}
	}, [setOnTop, ref])
	
	return { onTop, ref }
}
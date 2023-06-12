import { useEffect } from "react"

export default function SelectImage({ onChange }: { onChange: (arg: File) => void }) {
    function onDrop(event: any) {
        event.preventDefault()
        const file = event.dataTransfer.items?.[0].getAsFile()
        onChange(file)

    }

    function onDragOver(event: any) {
        event.preventDefault()
    }

    function onSelect(event: any) {
        const file = event.target.files?.[0]
        onChange(file)
    }

    function handlePaste(event: any) {
        const file = event?.clipboardData?.files?.[0]
        onChange(file)
    }

    useEffect(() => {
        document.addEventListener('paste', handlePaste)
        return () => document.removeEventListener('paste', handlePaste)
    })


    return (
        <div onDragOver={onDragOver} onDrop={onDrop} className="flex items-center justify-center w-full mt-5">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-[300px] border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 className=hover:bg-bray-800  hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>

                    <p className="mb-2 text-sm text-gray-500 className=text-gray-400">Paste / Drop</p>
                </div>
                <input onChange={onSelect} id="dropzone-file" type="file" className="hidden" accept="image/png" />
            </label>
        </div>
    )
}

import React, { useEffect, useState, useRef } from 'react';
import { Worker, createWorker } from 'tesseract.js';
import './App.css';
import { CropperRef, Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css'
import languages from './languages.json'
import { useLocalStorage } from './useLocalStorage';



interface SelectLaguageProps {
  onChange: (arg: any) => void
  options: any
  defaultValue?: string
}

function SelectLaguage({ onChange, options, defaultValue }: SelectLaguageProps) {
  const [listVisible, setListVisible] = useState(false)
  const defaultOption = options.find((o: any) => o.code === defaultValue)
  const [selected, setSelected] = useState(defaultOption ?? { "code": "eng", "name": "English" })
  const [filter, setFilter] = useState('')
  const divRef = useRef<HTMLDivElement>(null)

  options = options.filter((i: any) => i.name.toLowerCase().includes(filter.toLowerCase()))

  function onSelect(option: any) {
    setSelected(option)
    onChange(option)
    setListVisible(false)
    setFilter('')
  }

  function onClickOut(event: any) {
    if (!divRef?.current?.contains(event.target)) {
      setListVisible(false);
    }
  }

  useEffect(() => {
    document.addEventListener('click', onClickOut)
    return () => document.removeEventListener('click', onClickOut)
  })
  return (
    <div ref={divRef}>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
          </svg>

        </div>
        <input onFocus={() => setListVisible(true)} value={filter} onChange={e => setFilter(e.target.value)} type="text" id="voice-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 " placeholder={selected.name} required />
        {listVisible && (
          <div id="dropdown" className="z-40 bg-white divide-y divide-gray-100 shadow absolute w-full shadow-lg">
            <ul className="pl-5 text-start py-2 text-sm text-gray-700 w-full max-h-[200px] overflow-y-scroll hide-scroll" aria-labelledby="dropdownDefaultButton">
              {options.map((o: any) => (
                <li key={o.code} onClick={() => onSelect(o)}>
                  <span className="block px-4 py-2 hover:bg-gray-100">{o.name as string}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </div>
  )
}

function App() {

  const [img, setImage] = useState('')
  const [language, setLanguage] = useLocalStorage('language', 'eng')
  console.log(language)
  const cropperRef = useRef<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  async function recognize() {
    setLoading(true)
    const worker = await createWorker({
      logger: m => console.log(m),
    }) as unknown as Worker;
    await worker.load();
    console.log('set language => ', language)
    await worker.loadLanguage(language);
    await worker.initialize(language);
    const { data: { text } } = await worker.recognize(cropperRef.current.getCanvas()?.toDataURL() as string ?? img);
    setResult(text)
    setLoading(false)
  }

  const onChange = (cropper: CropperRef) => {
    // console.log(cropper.getImage())
    // console.log(cropper.getCoordinates(), cropper.getCanvas());
    // setCropImg(cropper.getImage()?.src as string)
    cropperRef.current = cropper
  };

  function readImage(file: any) {
    setImage(URL.createObjectURL(file))
  }

  function onDrop(event: any) {
    event.preventDefault()
    const file = event.dataTransfer.items?.[0].getAsFile()
    readImage(file)

  }

  function onDragOver(event: any) {
    event.preventDefault()
  }

  function onSelect(event: any) {
    const file = event.target.files?.[0]
    readImage(file)
  }

  function handlePaste(event: any) {
    // const items = event.clipboardData ?? event.originalEvent?.clipboardData?.items;
    // console.log(items)
    const file = event?.clipboardData?.files?.[0]
    readImage(file)
  }

  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  })



  return (
    <div className="App">
      <span className='text-5xl font-bold text-blue-600'>
        Lexy
      </span>
      <div className='pt-8'>
        <SelectLaguage onChange={(lang) => {
          setLanguage(lang.code)
        }} options={languages} defaultValue={language} />
      </div>
      {!img && (
        <div onDragOver={onDragOver} onDrop={onDrop} className="flex items-center justify-center w-full mt-5">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-[400px] border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 className=hover:bg-bray-800  hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>

              <p className="mb-2 text-sm text-gray-500 className=text-gray-400">Paste or Drop!</p>
            </div>
            <input onChange={onSelect} id="dropzone-file" type="file" className="hidden" />
          </label>
        </div>
      )}

      {img && (
        <Cropper
          src={img}
          onChange={onChange}
          className={'cropper w-full h-[400px] mt-5 rounded-lg'}
        />
      )}
      {img && (
        <button onClick={recognize} disabled={loading} type="button" className="flex flex-col items-center w-full mt-5 mb-5 py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 className=bg-gray-800 className=text-gray-400 className=border-gray-600 className=hover:text-white className=hover:bg-gray-700 inline-flex items-center">
          {loading && (
            <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-gray-200 animate-spin " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
            </svg>
          )}

          {loading ? null : 'Create'}
        </button>
      )}
      <div>
        {result && (
          <form className='mt-5'>
            <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 className=bg-gray-700 className=border-gray-600">
              <div className="flex items-center justify-between px-3 py-2 border-b className=border-gray-600">
                <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x className=divide-gray-600">
                  <div className="flex items-center space-x-1 sm:pr-4">
                    <button onClick={() => navigator.clipboard.writeText(result)} type="button" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 className=text-gray-400 className=hover:text-white className=hover:bg-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                      </svg>

                    </button>
                  </div>
                </div>

              </div>
              <div className="px-4 py-2 bg-white rounded-b-lg className=bg-gray-800">
                <textarea value={result} id="editor" rows={8} className="block w-full px-0 text-sm text-gray-800 bg-white border-0 className=bg-gray-800 focus:ring-0 className=text-white className=placeholder-gray-400" placeholder="" required></textarea>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

export default App;
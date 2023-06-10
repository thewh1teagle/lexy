import { useEffect, useState, useRef} from 'react';
import { Language } from '../App';

interface SelectLaguageProps {
    onChange: (arg: Language) => void
    options: Array<Language>
    langs: Array<Language>
    setLangs: React.Dispatch<Array<Language>>
  }
  
  export default function SelectLaguage({ onChange, options, langs, setLangs }: SelectLaguageProps) {
    const [listVisible, setListVisible] = useState(false)
    const [filter, setFilter] = useState('')
    const divRef = useRef<HTMLDivElement>(null)
  
    options = options.filter((i: Language) => i.name.toLowerCase().includes(filter.toLowerCase()))
  
    function onSelect(option: Language) {
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
          <input onKeyDown={e => e.key === 'Enter' ? onSelect(options?.[0]) : null} onFocus={() => setListVisible(true)} value={filter} onChange={e => setFilter(e.target.value)} type="text" id="voice-search" className="rounded-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 "
            placeholder='Select languages...' required
          />
  
          <div id="dropdown" className="z-40 bg-white absolute w-full shadow-lg" style={{ height: listVisible ? 'inherit' : '0px' }}>
            <ul className={`bg-white pl-0 text-start shadow-lg rounded-b-lg text-sm text-gray-700 w-full transition-all duration-200 overflow-y-scroll hide-scroll" aria-labelledby="dropdownDefaultButton`} style={{ maxHeight: listVisible ? '200px' : '0px', visibility: listVisible ? 'visible' : 'hidden' }}>
              {options.map((o: Language) => (
                <li key={o.code} onClick={() => onSelect(o)}>
                  <span className="block px-4 py-2 hover:bg-gray-100">{o.name as string}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='flex flex-row flex-wrap gap-3 mt-3'>
          {langs.map(lang => (
            <div className={`py-1 shadow-lg text-black text-xs pl-2 gap-1 pr-2 rounded-full flex items-center uppercase`}>
              {lang.name}
              <svg onClick={() => langs.length > 1 ? setLangs(langs.filter(l => l !== lang)) : null} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={`w-6 h-6 stroke-red-500 ${langs.length > 1 ? 'cursor-pointer' : null}`}>
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
  
  
  
            </div>
          ))}
        </div>
      </div>
    )
  }
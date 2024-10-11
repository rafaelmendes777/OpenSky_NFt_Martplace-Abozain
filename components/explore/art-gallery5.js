import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'
import InputDialog from '../dialog/input'
import LoaderDialog from '../dialog/loader'
import SuccessDialog from '../dialog/success'
import { useState,useEffect } from 'react'

export default function ArtGallery5(props) {


let [priceOpen, setPriceOpen] = useState(false)
let [loaderOpen, setLoaderOpen] = useState(false)
let [successOpen, setSuccessOpen] = useState(false)    

function closePriceModal() {
    setPriceOpen(false)
}

function openPriceModal() {
    setPriceOpen(true)
}

function closeLoaderModal() {
    setLoaderOpen(false)
}

function openLoaderModal() {
    closePriceModal()
    setLoaderOpen(true)

    setTimeout(purchaseSuccesss, 1000)
}

function closeSuccessModal() {
    closePriceModal()
    closeLoaderModal()
    setSuccessOpen(false)
}

function openSuccessModal() {
    setSuccessOpen(true)
}

function purchaseSuccesss() {
    closeLoaderModal()
    openSuccessModal()
}
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
            {props.galleries.map((item, index) => (
                 <div key={item.itemId} className='w-full h-auto grid grid-cols-1 bg-[#161A42] border-2 border-[#161A42] dark:bg-white rounded-2xl text-white dark:text-gray-800 dark:border-2 dark:border-gray-200'>
                    <div className='grid grid-cols-1 gap-2 p-4'>
                        <div className='bg-white rounded-xl'>
                        <Link href={{
                            pathname:`/market/${item.tokenId}/`,
                            query: {
                                id: `${item.itemId}`,
                               
                            }
                                }}>
                            <img src={item.image} alt={item.name} className='w-full h-auto'></img>
                            </Link>
                        </div>
                        <div className='flex flex-row'>
                            <h1 className="flex-grow text-base">{item.name}</h1>
                            <Link href={{
                            pathname:`/market/${item.tokenId}/`,
                            query: {
                                id: `${item.itemId}`,
                               
                            }
                                }}>
                            <button className="rounded-full border-2 border-[#2E357B] dark:border-0 dark:bg-[#325BC5] w-[1.75rem] h-[1.75rem] text-white">
                        
                                <FontAwesomeIcon icon={faAngleRight} className="" />
                              
                            </button>
                            </Link>
                        </div>
                        <p className="text-[#A2A6D0] text-sm">{item.category}</p>
                        <div className='flex flex-row py-4'>
                            <div className="rounded-full w-[1.5rem] text-center bg-[#325BC5] text-white">
                                <FontAwesomeIcon icon={faEthereum} className="" />
                            </div>
                            <h1 className="flex-grow text-[#47DEF2] text-base ml-2">{item.price } ETH</h1>
                        </div>
                        <p className="text-sm truncate ... ">{item.creator} </p>
                        <p className="text-[#A2A6D0] text-xs">Creator</p>
                    </div>                            
                    
                    <div className="border-t-2 border-[#2E357B] dark:border-gray-200 p-4">
                        <button className='rounded-full bg-gradient-to-b from-[#3461FF] to-[#8454EB] text-white text-base w-full px-4 py-2 shadow-md' onClick={()=>props.children.cancelSellFucnction(item)}>⚡ {item.buttonTitle}</button>
                    </div>

                       {/* price input dialog  */}

                </div>
                
            ))}

{/* loader dialog  */}
<LoaderDialog show={loaderOpen} openLoaderModal={openLoaderModal}></LoaderDialog>

{/* success dialog  */}
<SuccessDialog show={successOpen} closeSuccessModal={closeSuccessModal}>{{msg:"",title:"",buttonTitle:""}}</SuccessDialog>

        </div>

        
    )
}
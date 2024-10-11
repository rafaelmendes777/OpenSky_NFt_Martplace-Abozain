import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState,useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import Header from './../components/header'
import Footer from './../components/footer'
import { create } from 'ipfs-http-client'
import Breadcrumbs from '../components/breadcrumbs'
import { useWeb3 } from '../components/web3'
import Web3 from "web3"
import LoaderDialog from '../components/dialog/loader'
import SuccessDialog from '../components/dialog/success'
import { useSelector } from "react-redux";



export default function CreateNftPage() {

   

    const breadcrumbs = ["Create NFT"]


    const account = useSelector((state) => state.wallet.account);
    const web3 = useSelector((state) => state.wallet.web3);
        //============<
    
    const[buttonTitle,setButtonTitle]= useState("Please Fill All Fields")
      
    
       //Load Contracts Function
       const[nftContract,setNFtContract]= useState(null)
       const[marketContract,setMarketContract]= useState(null)
       const[unsoldItems,setUnsoldItems]= useState([])
    
       const[isActive,setIsActive]=useState(false)
    
       const router = useRouter();

    
    
       const [urlHash,setUrlHash] = useState()
       const onChange = async(e)=>{
           const file = e.target.files[0];
    
           console.log("before")
    
           try{
               console.log("after try")
               
                const ipfsUrl = `https://mrbebo.infura.io/ipfs/${file}`;
               setUrlHash(ipfsUrl)
    
           }catch(e){
               console.log(e)
           }
    
       }
    
       const [nftFormInput,setNftFormInput] =useState({
           price:'',
           name:"",
           description:"",
           category:""
       })
    
       const createMarketItem =  async()=>{
           const {price,name,description,category}=nftFormInput;
           if(!price||!name||!description||!category ||!urlHash) return
           setButtonTitle("Wait Mint Processing the NFT")
           openLoaderModal()
    
    
           const data = JSON.stringify({
               name,description,category,image:urlHash
           });
    
    
           try{
               setIsActive(false)
               
               const ipfsUrl = `https://mrbebo.infura.io/ipfs/${file}`;
               createMarketForSale(ipfsUrl);
    
    
    
           }catch(e){
               console.log(e)
           }
    
    
       }
    
       useEffect(()=>{
    
          const {price,name,category,description}=nftFormInput;
           if(!price||!name||!description||!category ||!urlHash) {
             setIsActive(false)  
           }else{
               setIsActive(true)
           }
       },[nftFormInput,urlHash])
    
  
       useEffect(()=>{
           const LoadContracts = async()=>{
               //Paths of Json File
    
              const netWorkId =  await web3.eth.net.getId();
    
    
             
    
    
           }
           web3&&account&&LoadContracts()
    
       },[web3&&account])
    
    
    
           const createMarketForSale = async(url)=>{
               //Paths of Json File
               const nftContratFile =  await fetch("/abis/NFT.json");
               const marketContractFile = await fetch("/abis/NFTMarketPlace.json");
    //Convert all to json
              const  convertNftContratFileToJson = await nftContratFile.json();
              const  convertMarketContractFileToJson = await marketContractFile.json();
    //Get The ABI
              const markrtAbi = convertMarketContractFileToJson.abi;
              const nFTAbi = convertNftContratFileToJson.abi;
    
              const netWorkId =  await  web3.eth.net.getId();
    
              const nftNetWorkObject =  convertNftContratFileToJson.networks[netWorkId];
              const nftMarketWorkObject =  convertMarketContractFileToJson.networks[netWorkId];
    
              if(nftMarketWorkObject && nftMarketWorkObject){
               const nftAddress = nftNetWorkObject.address;
               const marketAddress = nftMarketWorkObject.address;
    
               const deployedNftContract = await new web3.eth.Contract(nFTAbi,nftAddress);
               setNFtContract(deployedNftContract)
               const deployedMarketContract = await new web3.eth.Contract(markrtAbi,marketAddress);
               setMarketContract(deployedMarketContract)
               
               if(account){
                               //Start to create NFt Item Token To MarketPlace
                               openLoaderModal()
               let createTokenResult  = await deployedNftContract.methods.createNFtToken(url).send({from:account})
    
               const tokenid = createTokenResult.events.Transfer.returnValues["2"]
    
               console.log(tokenid)
    
               setIsActive(false)
               openLoaderModal()
               setButtonTitle("Wait Mint Processing the NFT")
               

               const marketFees =(Number(nftFormInput.price)) * (1.5/100); //1.5
    
               const feesToWei = Web3.utils.toWei(marketFees.toString(),"ether")
    
               const priceToWei = Web3.utils.toWei(nftFormInput.price,"ether")


    
               openLoaderModal()
                   const lanchTheNFtForSale = await deployedMarketContract.methods.createItemForSale(nftAddress,tokenid,priceToWei).send({from:account})
                   openLoaderModal()
    
                   if(lanchTheNFtForSale){
                    openLoaderModal()
                    router.push("/")

    
                   }
               } else{
                   
               }
    
            
    
    
    
              }else{
                  console.log("You are at Wrong Netweok")
              }
    
    
    
    
    
    
    
    
    
           }
    
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
       
           const [dynamicCustomTokenName,setDynamicCustomTokenName]= useState("JUSTICE")
  
           useEffect(()=>{
         
         
         
             try{
               web3.eth.net.getId().then(networkId => {
             
                 switch(networkId) {
                   case 5777:
                     // code block
                     setDynamicCustomTokenName("JUSTICE")
                     break;
                   case 1:
                       setDynamicCustomTokenName("JUSTICE")
                     break;
                     case 56:
                       setDynamicCustomTokenName("JUSTICE")
                     break;
               
                     case 97:
                       setDynamicCustomTokenName("JUSTICE")
                     break;
                     case 80001:
                       setDynamicCustomTokenName("JUSTICE")
                     break;
                    case 5:
                       setDynamicCustomTokenName("JUSTICE")
                     break;
                   default:
                       setDynamicCustomTokenName("JUSTICE")
                 }
               })
             
              }catch(e){
             
              }
                    
           },[web3])


    
    return (
        <>
            <Head>
                <title>Mint NFT</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header current={2}></Header>

            <div className='bg-[#373F4E] dark:bg-white'>
                <div className='w-full 2xl:max-w-screen-2xl h-auto pt-[104px] m-auto'>
                    <div className='flex flex-col mx-8 sm:mx-12 lg:mx-[9vw] space-y-6 py-12 text-white dark:text-gray-800'>
                        {/* custom breadcrubs */}
                        <Breadcrumbs home="Create NFT" breadcrumbs={breadcrumbs}></Breadcrumbs>

                        <div className='border border-[#787984]'></div>

                        <h1 className='text-4xl md:text-6xl font-bold'>Create Your NFT</h1>
                        <p className='text-xl'>This is a descriptive sub-headline that introduces the whole content of this text to the audience who is interested in reading about this topic.</p>

                        <div className='flex flex-col lg:flex-row items-center'>
                            {/* left input element */}
                            <div className='w-full lg:w-[40%] flex-none flex flex-col space-y-4'>
                                {/* file chooser */}
                                <div className='bg-[#000000] dark:bg-white h-[160px] rounded-md border-dashed border border-[#9FA4FF] text-[#B4BAEF]'>
                                    <label className='h-full flex flex-col text-center p-2 cursor-pointer'>
                                        <div className='flex-1 text-6xl my-2'>
                                            {
                                                    urlHash?    <img className="object-fit svg-inline--fa fa-image " width="60" src={urlHash} alt="preview image"/> :<FontAwesomeIcon icon={faImage} className="" />
                                            }
                                        </div>
                                        <span className="flex-1 text-xs leading-normal">Drag and Drop File</span>
                                        <span className="flex-1 text-xs leading-normal">Browse Media on Your Device</span>
                                        <span className="flex-1 text-[8px] leading-normal">JPG, PNG, GIF, SVG, WEBM, </span>
                                        <input type='file' className="hidden" id="file-chooser" onChange={onChange} />
                                    </label>
                                </div>
                            
                                <input className='text-[#B4BAEF] text-sm p-3.5 rounded-md border border-[#9FA4FF] bg-[#000000] dark:bg-white focus:outline-none focus:ring-2' placeholder='NFT Title' id="nft-title"
                              onChange = {e=>setNftFormInput({...nftFormInput,name:e.target.value})}

                                >

                                </input>

                                <select className='text-[#B4BAEF] text-sm px-3.5 py-3 rounded-md border border-[#9FA4FF] bg-[#000000] dark:bg-white focus:outline-none focus:ring-2 appearance-none custom-select' placeholder='NFT Title' defaultValue={0} id="nft-category" onChange={e=>setNftFormInput({...nftFormInput,category:e.target.value})}>
                                    <option value="0" disabled>Choose Category</option>
                                    <option value="ART">ART</option>
                                        <option value="COLLECTIBLES">COLLECTIBLES</option>
                                        <option value="PHOTOGRAPHY">PHOTOGRAPHY</option>
                                        <option value="SPORT">SPORT</option>
                                        <option value="TRADING CARDS">TRADING CARDS</option>
                                        <option value="UTILITY">UTILITY</option>
                                        <option value="VIRTUAL WORDS">VIRTUAL WORDS</option>
                                </select>

                                <div className='relative text-[#B4BAEF]'>
                                    <input className='w-full text-sm p-3.5 pr-16 rounded-md border border-[#9FA4FF] bg-[#000000] dark:bg-white focus:outline-none focus:ring-2' type="number" min={0}  placeholder='Price' id="nft-price"
                                                    onChange = {e=>setNftFormInput({...nftFormInput,price:e.target.value})} 
                                    ></input>
                                    <p className='absolute top-1/2 right-8 -translate-y-1/2 text-sm'>{dynamicCustomTokenName}</p>
                                    
                                </div>
                                

                                
                            <textarea className='text-[#B4BAEF] text-sm p-3.5 rounded-md border border-[#9FA4FF] bg-[#000000] dark:bg-white focus:outline-none focus:ring-2' rows="6" placeholder='Desription'
                                            onChange ={e=>setNftFormInput({...nftFormInput,description:e.target.value})}

                            >

                                </textarea>
                                {isActive?                                <button className='rounded-full bg-[#5864f2]  text-white text-base px-6 sm:px-10 py-2 shadow-md m-auto' id="btn-create-nft" onClick={createMarketItem}>Create</button>
:<button className='rounded-full bg-[#5864f2]  text-white text-base px-6 sm:px-10 py-2 shadow-md m-auto' id="btn-create-nft" >{buttonTitle}</button>}

                            </div>

                            {/* right art element */}
                            <div className='flex-1 w-full h-full mt-8 lg:mt-0 pl-8 lg:pl-24 lg:pr-0'>
                                <div className='relative w-full h-auto'>
                                    <img src="/assets/svg/bg-abstr-nft.svg"></img>
                                    
                                    <img src="/assets/svg/brand-ethereum.gif" className='absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/5'></img>

                                    <div className='absolute left-0 top-1/2 -translate-y-1/2  w-[57.5%] h-full flex flex-col items-start p-3 sm:p-6 lg:p-4 xl:p-8'>
                                        <h1 className='flex-none text-white text-xl sm:text-2xl py-2'>Abstr Gradient NFT</h1>
                                        <div className='flex-none flex flex-row items-center  w-full'>
                                            <div className='flex-none'>
                                                <img src="/assets/svg/brand-abstr.svg" className='w-2/3'></img>
                                            </div>
                                            <p className='flex-grow text-white text-sm sm:text-xl'>4363733</p>
                                        </div>

                                        <div className='flex-grow'></div>

                                        <div className='w-full flex flex-row space-x-2 sm:space-x-4 text-white bg-[#47DEF2] bg-opacity-90 rounded-lg p-2 sm:p-3'>
                                            <div className='flex-1 flex flex-col space-y-1'>
                                                <p className='text-xs'>Current Bid</p>
                                                <div className="flex flex-row items-center">
                                                    <div className='mr-1'>
                            <img
                        src=
                          "/assets/png/logo-light.png"
                        alt="Logo"
                      ></img>                                                     </div>
                                                    <div className='flex flex-row text-xs sm:text-base lg:text-sm xl:text-base font-bold'>
                                                        <div>0.25</div>
                                                        <div className='ml-1 sm:ml-2'>JUSTICE</div>
                                                    </div>
                                                    
                                                </div>
                                            </div>

                                            <div className='flex-1 flex flex-col space-y-1'>
                                                <p className='text-xs'>Ends in</p>
                                                <div className="flex-grow flex flex-row space-x-2 text-xs sm:text-base lg:text-sm xl:text-base">
                                                    <div className='flex-1 flex flex-row items-center'>
                                                        <div className='flex-none font-bold'>12</div>
                                                        <div className='flex-1'>h</div>
                                                    </div>
                                                    <div className='flex-1 flex flex-row items-center'>
                                                        <div className='flex-none font-bold'>43</div>
                                                        <div className='flex-1'>m</div>
                                                    </div>
                                                    <div className='flex-1 flex flex-row items-center'>
                                                        <div className='flex-none font-bold'>42</div>
                                                        <div className='flex-1'>s</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <LoaderDialog show={loaderOpen} openLoaderModal={openLoaderModal}></LoaderDialog>

            <Footer></Footer>

        </>
    )
}

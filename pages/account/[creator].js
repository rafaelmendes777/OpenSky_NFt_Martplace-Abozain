import Head from 'next/head'
import Link from 'next/link'
import { useState,useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone } from '@fortawesome/free-regular-svg-icons'
import { faShareAlt } from '@fortawesome/free-solid-svg-icons'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Breadcrumbs from '../../components/breadcrumbs'
import { useRouter } from 'next/router'
import ArtGallery3 from '../../components/explore/art-gallery3'
import { useWeb3 } from '../../components/web3'
import Web3 from "web3"

import axios from 'axios'
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ProfileAsViewer() {


	const web3Api = useWeb3();
    console.log(web3Api)
	const router = useRouter();
	const {creator} = router.query
	console.log("we are profle as view")
	console.log(creator)
    
      //Create LoadAccounts Function
      const account =   creator;

	 
		const[noProvider,setNoProvider] = useState(true);
	
	
	  
	
		//Create LoadAccounts Function
		const[accountBalance,setAccountBalance]= useState(0);
	
	
		const [isLoading,setIsLoading] = useState(true);
	
	
		//Load Contracts Function
		const[nftContract,setNFtContract]= useState(null)
		const[marketContract,setMarketContract]= useState(null)
		const[nftAddress,setNFtAddress]= useState(null)
		const[marketAddress,setMarketAddress]= useState(null)
		const[unsoldItems,setUnsoldItems]= useState([])
	
		const[tokenContract,setTokenContract]= useState(null)
		const[tokenBalance,setTokenBalnce] =useState("0");
		const [creatorCommissionValueInwei,setCreatorCommissionValueInwei]= useState(null)
	
  
  
	  //Load Contracts Function
	  const[creathedItems,setcreathedItems]= useState([])
	  const[soldItems,setSoldItems]= useState([])
  
  
	  useEffect(()=>{
		  const LoadContracts = async()=>{
		   //Paths of Json File
		   const nftContratFile =  await fetch("/abis/NFT.json");
		   const marketContractFile = await fetch("/abis/NFTMarketPlace.json");
//Convert all to json
		  const  convertNftContratFileToJson = await nftContratFile.json();
		  const  convertMarketContractFileToJson = await marketContractFile.json();
//Get The ABI
		  const markrtAbi = convertMarketContractFileToJson.abi;
		  const nFTAbi = convertNftContratFileToJson.abi;

		  const netWorkId =  await web3Api.web3.eth.net.getId();

		  const nftNetWorkObject =  convertNftContratFileToJson.networks[netWorkId];
		  const nftMarketWorkObject =  convertMarketContractFileToJson.networks[netWorkId];

	
	
		

		  if(nftMarketWorkObject && nftMarketWorkObject){
		   const nftAddress = nftNetWorkObject.address;
		   setNFtAddress(nftAddress)
		   const marketAddress = nftMarketWorkObject.address;
		   setMarketAddress(marketAddress)

		   const deployedNftContract = await new web3Api.web3.eth.Contract(nFTAbi,nftAddress);
		   setNFtContract(deployedNftContract)
		   const deployedMarketContract = await new web3Api.web3.eth.Contract(markrtAbi,marketAddress);
		   setMarketContract(deployedMarketContract)

		

			 if(account){
			  const data =  await deployedMarketContract.methods.getMyItemCreated().call({from:account})
			  const items = await Promise.all(data.map(async item=>{
			   const nftUrl = await deployedNftContract.methods.tokenURI(item.tokenId).call();
			   console.log(nftUrl)
			   console.log(item)
			   const priceToWei = Web3.utils.fromWei((item.price).toString(),"ether")
			   const metaData =  await axios.get(nftUrl);

			   let classChange;

			   if((item.sold||item.soldFirstTime)){
				   classChange = "Sold"
				   
			   }else{
				classChange = "Created"
			   }

  
  //TODO: fix this object
			 let myItem = {
				 
				ClassChange:classChange,
                price:priceToWei,
                itemId : item.id,
                tokenId:item.tokenId,
                owner :item.owner,
                seller:item.seller,
                oldOwner :item.oldOwner,
                creator:item.creator,
                oldSeller :item.oldSeller,

                oldPrice:item.oldPrice,
                image:metaData.data.image,
                name:metaData.data.name,
                description:metaData.data.description,
                category:classChange,

                isResell:item.isResell,
                soldFirstTime:item.soldFirstTime

		   }
  
		   return myItem;
  
			 }))
  
			 const mySoldItems = items.filter(item=>(item.sold||item.isResell));
			 //setSoldItems(mySoldItems)
			 setcreathedItems(items)
			 
			 }
			
		   
  
  
  
   
			 }else{
				 window.alert("You are at Wrong Netweok, Connect with Cronos Please")
			 }
  
  
  
		  }
		  setIsLoading(false) 
		  web3Api.web3&&LoadContracts()
  
	  },[account])

	//   setIsLoading(false)




    const [current, setCurrent] = useState(0)  

    const breadcrumbs = ["My Profile"]
    const btnCategories = [  "Created","Sold"]
  
    const [data, setData] = useState(creathedItems);
    const [category, setCategory] = useState("Created");
    
    useEffect(() => {
      const filteredData = creathedItems.filter((d) => d.category === category);
    
      if (category === "Created") {
        setData(creathedItems);
      } else {
        setData(filteredData);
      }
    }, [creathedItems,category]);
    

    return (
        <>
            <Head>
                <title>Account Address</title>
                <link rel="icon" href="/favicon.png" />
            </Head>

            <Header current={-1}></Header>

            <div className='bg-[#0D0F23] dark:bg-white'>
                <div className='w-full 2xl:max-w-screen-2xl h-auto pt-[104px] m-auto'>
                    <div className='flex flex-col mx-8 sm:mx-16 lg:mx-[9vw] space-y-6 py-12'>
                        {/* custom breadcrubs */}
                        <Breadcrumbs home="Home" breadcrumbs={breadcrumbs}></Breadcrumbs>

                        <div className='border border-[#787984]'></div>

                        <div className='flex flex-col space-y-6'>
                            <div className='relative h-[200px] rounded-md bg-gradient-to-b from-[#3461FF] to-[#8454EB]'>
                                <div className='absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-[128px] h-[128px] rounded-full border-2 border-white dark:border-gray-800'></div>
                                <div className='absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-[112px] h-[112px] rounded-full bg-gradient-to-b from-[#3461FF] to-[#8454EB]'></div>
                            </div>

                            <div className='flex flex-row pt-16'>
                                <div className='flex-none w-16'>
                                </div>

                                <div className='flex-grow flex flex-col items-center space-y-6 text-white dark:text-gray-800 text-center'>
                                    <h1 className='text-xl font-semibold'>Account Address</h1>
                                    <div className='w-[80%] sm:w-[60%] md:w-[40%] text-sm'>{account}</div>

                                    <div className="flex flex-row space-x-4 text-[#FAD804] text-2xl mr-3">
                                        <FontAwesomeIcon icon={faShareAlt} />
                                    </div>

                                    {/* categories */}
                                    <div className='flex flex-row space-x-2'>
                                    {btnCategories.map((item, index) => (
                                <button key={"btn-category" + index.toString()} className={classNames(index === current ? 'bg-[#FF457D] dark:bg-gray-800 text-white' : 'border border-[#2C3166] dark:border-gray-400 bg-[#002046] dark:bg-white text-[#919CC1] dark:text-gray-800', 'text-xs rounded-full px-4 py-1.5')} onClick={() => {setCurrent(index)
                                    setCategory(item)
                                }}>{item}</button>
                            ))}
                                    </div>
                                </div>

                                <div className='flex-none flex flex-col items-center space-y-1'>
                                    <div className='w-16 h-12 rounded-xl bg-white dark:bg-gray-800 text-lg text-center py-[10px]'>
                                        <p className='dark:text-white'>{creathedItems.length}</p>
                                    </div>
                                    <div className='text-white dark:text-gray-800 text-xs'>NFT Count</div>
                                </div>
                            </div>

                            {/* galleries */}
                            {
                                    !data.length?                                <a className="flex-none text-center text-[#A2A6D0] hover:text-white dark:text-gray-800 dark:hover:text-gray-600">
                                    NO NFTs At This Category
                                </a>:    <ArtGallery3 galleries={data}></ArtGallery3> 
                            }
                         
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    )
}

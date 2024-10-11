const {createContext,useContext,useState,useEffect,useMemo} = require("react");
const Web3Context = createContext(null);
import Web3 from "web3"
import detectEthereumProvider from '@metamask/detect-provider'




export default function Web3Provider({children}){

    const[web3Api,setWe3Api] = useState({
        provider:null,
        web3:null,
        account:"",
        isLoading:false
    })

    const providerChanged = (provider)=>{
        provider.on("accountsChanged",_=>window.location.reload());
        provider.on("chainChanged",_=>window.location.reload());

    }

 

    useEffect(()=>{
        const loadProvider = async()=>{
            const provider =  await detectEthereumProvider();

            if(provider){
                providerChanged(provider);
                setWe3Api({
                    provider,
                    web3:new Web3(provider),
                    isLoading:true
                })
            } else {
                setWe3Api(api=>({...api,isLoading:true}))
                window.alert("Please install any provider wallet like MetaMask or Defi Wallet")
            }


        }

        loadProvider()
    },[])

   

 

    const _web3Api =useMemo(() =>{
        return{
            ...web3Api,
            metaMaskConnect:web3Api.provider? async()=>{

                try{
                    await web3Api.provider.request({methods:"eth_requestAccounts"})

                }catch(e){
                    
                    location.reload()
                }

            }:()=>{
                console.error("Cannot connect with meta mask, try to reload your browser")
            },
            // defiConnect:web3Api.provider? async()=>{

            //     try{
            //         // await web3Api.provider.request( await connector.getProvider())
            //         connectDefiWallet()

            //     }catch(e){
                    
            //         location.reload()
            //     }

            // }:()=>{
            //     console.error("Cannot connect with Defi Wallet, try to reload your browser")
            // },
        }
    },[web3Api])
        //Create LoadAccounts Function
       
        useEffect(()=>{
             const loadAccount = async()=>{
                 const accounts = await web3Api.web3.eth.getAccounts();
                 setWe3Api(api=>({...api,account:accounts[0]}))

    
             }
    
           web3Api.web3&&  loadAccount();
        },[ web3Api.web3])

    return(
        <Web3Context.Provider value={_web3Api}>
            {children}
        </Web3Context.Provider>
    )
}
export function useWeb3(){
    return useContext(Web3Context)
}
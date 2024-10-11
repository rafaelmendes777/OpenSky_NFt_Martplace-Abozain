import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import ArtGallery1 from "../explore/art-gallery1";
import axios from "axios";
import Web3 from "web3";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useWeb3 } from "../web3";
import SuccessDialog from "../dialog/success";
import LoaderDialog from "../dialog/loader";

export default function Paragraph2() {
  ///////////////////
  const web3Api = useWeb3();
  console.log("Web3 At Home", web3Api);
  const account = web3Api.account;
  const router = useRouter();
  let [loaderOpen, setLoaderOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  //Create LoadAccounts Function
  const [accountBalance, setAccountBalance] = useState(0);
  const [showDialog, setShowDialog] = useState(true);

  let [priceOpen, setPriceOpen] = useState(false);
  let [successOpen, setSuccessOpen] = useState(false);

  function closePriceModal() {
    setPriceOpen(false);
  }

  function openPriceModal() {
    setPriceOpen(true);
  }

  function closeLoaderModal() {
    setLoaderOpen(false);
  }

  function openLoaderModal() {
    closePriceModal();
    setLoaderOpen(true);

    setTimeout(purchaseSuccesss, 1000);
  }

  function closeSuccessModal() {
    closePriceModal();
    closeLoaderModal();
    setSuccessOpen(false);
  }

  function openSuccessModal() {
    setSuccessOpen(true);
  }

  function purchaseSuccesss() {
    closeLoaderModal();
    openSuccessModal();
  }

  //Load Contracts Function
  const [nftContract, setNFtContract] = useState(null);
  const [marketContract, setMarketContract] = useState(null);
  const [nftAddress, setNFtAddress] = useState(null);
  const [marketAddress, setMarketAddress] = useState(null);
  const [unsoldItems, setUnsoldItems] = useState([]);

  const indexOfunsold = unsoldItems.length;

  const firstOne = unsoldItems[indexOfunsold - 1];
  const secondOne = unsoldItems[indexOfunsold - 2];
  const thirdOne = unsoldItems[indexOfunsold - 3];
  const galleries = [firstOne, secondOne, thirdOne];

  useEffect(() => {
    const LoadContracts = async () => {
      //Paths of Json File
      const nftContratFile = await fetch("/abis/NFT.json");
      const marketContractFile = await fetch("/abis/NFTMarketPlace.json");
      //Convert all to json
      const convertNftContratFileToJson = await nftContratFile.json();
      const convertMarketContractFileToJson = await marketContractFile.json();
      //Get The ABI
      const markrtAbi = convertMarketContractFileToJson.abi;
      const nFTAbi = convertNftContratFileToJson.abi;

      const netWorkId = await web3Api.web3.eth.net.getId();

      const nftNetWorkObject = convertNftContratFileToJson.networks[netWorkId];
      const nftMarketWorkObject =
        convertMarketContractFileToJson.networks[netWorkId];

      //Get Token Contract

      if (nftMarketWorkObject && nftMarketWorkObject) {
        const nftAddress = nftNetWorkObject.address;
        setNFtAddress(nftAddress);
        const marketAddress = nftMarketWorkObject.address;
        setMarketAddress(marketAddress);

        const deployedNftContract = await new web3Api.web3.eth.Contract(
          nFTAbi,
          nftAddress
        );
        setNFtContract(deployedNftContract);
        const deployedMarketContract = await new web3Api.web3.eth.Contract(
          markrtAbi,
          marketAddress
        );
        setMarketContract(deployedMarketContract);

        if (account) {
          const myBalance = await web3Api.web3.eth.getBalance(account);
          const convertBalance = await web3Api.web3.utils.fromWei(
            myBalance,
            "ether"
          );
          setAccountBalance(convertBalance);
        }

        //Fetch all unsold items
        const data = await deployedMarketContract.methods
          .getAllUnsoldItems()
          .call();
        console.log(data);
        const items = await Promise.all(
          data.map(async (item) => {
            const nftUrl = await deployedNftContract.methods
              .tokenURI(item.tokenId)
              .call();
            console.log(nftUrl);
            console.log(item);
            const priceToWei = Web3.utils.fromWei(
              item.price.toString(),
              "ether"
            );
            const metaData = await axios.get(nftUrl);

            //TODO: fix this object
            let myItem = {
              price: priceToWei,
              itemId: item.id,
              tokenId: item.tokenId,
              owner: item.owner,
              seller: item.seller,
              oldOwner: item.oldOwner,
              creator: item.creator,
              oldSeller: item.oldSeller,

              oldPrice: item.oldPrice,
              image: metaData.data.image,
              name: metaData.data.name,
              description: metaData.data.description,
              category: metaData.data.category,

              isResell: item.isResell,
              buttonTitle: "View More",
            };
            console.log(item);

            return myItem;
          })
        );

        setUnsoldItems(items);
        setIsLoading(false);
        setShowDialog(false);
      } else {
        openSuccessModal();

        //  window.alert("You are at Wrong Netweok, Connect with Ropston Please")
      }
    };
    web3Api.web3 && account && LoadContracts();
  }, [web3Api.web3, account]);

  //Create nft Buy Function

  //////////////////

  return (
    <div className="w-full h-auto">
      {/* absolute */}
      <div className="relative w-full h-full">
        <img
          src="/assets/svg/dot-square.svg"
          alt="dot-square"
          className="absolute left-0 top-0 w-[10vw]"
        ></img>
      </div>

      <div className="relative grid grid-cols-1 gap-8 mx-8 sm:mx-16 lg:mx-[9vw]">
        {/* galleries */}
        <div className="flex flex-cols">
          <h1 className="flex-grow text-white dark:text-gray-800 text-2xl sm:text-4xl font-bold">
            Check Top Newest NFTs
          </h1>
          <Link href="/categories">
            <a className="flex-none text-right text-[#A2A6D0] dark:text-gray-800 dark:hover:text-gray-600">
              See All
              <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
            </a>
          </Link>
        </div>

        {isLoading ? (
          <LoaderDialog
            show={loaderOpen}
            openLoaderModal={openLoaderModal}
          ></LoaderDialog>
        ) : (
          <>
            {indexOfunsold > 2 ? (
              <ArtGallery1 galleries={galleries}></ArtGallery1>
            ) : (
              <a className="flex-none text-center text-[#A2A6D0] hover:text-white dark:text-gray-800 dark:hover:text-gray-600">
                Dont Have 3 NfTs
              </a>
            )}
          </>
        )}

        <SuccessDialog show={successOpen} closeSuccessModal={closeSuccessModal}>
          {{
            msg: "PLease Connect MetaMask With Roposten NetWork",
            title: "Attention",
            buttonTitle: "Cancel",
          }}
        </SuccessDialog>
      </div>
    </div>
  );
}

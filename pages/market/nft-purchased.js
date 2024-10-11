import Head from "next/head";
import Link from "next/link";
import { Fragment, useState, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-regular-svg-icons";
import {
  faTimesCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Breadcrumbs from "../../components/breadcrumbs";
import ArtGallery4 from "../../components/explore/art-gallery4";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { TailSpin } from "react-loader-spinner";
import Web3 from "web3";
import axios from "axios";
import { useRouter } from "next/router";
import SuccessDialog from "../../components/dialog/success";
import LoaderDialog from "../../components/dialog/loader";
import { useWeb3 } from "../../components/web3";
export default function NftPurchasedPage() {
  const web3Api = useWeb3();
  console.log(web3Api);

  //Craete function to listen the change in account changed and network changes

  //Create LoadAccounts Function
  const account = web3Api.account;
  const router = useRouter();

  //Craete function to listen the change in account changed and network changes

  const providerChanged = (provider) => {
    provider.on("accountsChanged", (_) => window.location.reload());
    provider.on("chainChanged", (_) => window.location.reload());
  };

  //Load Contracts Function
  const [nftContract, setNFtContract] = useState(null);
  const [marketContract, setMarketContract] = useState(null);
  const [nftAddress, setNFtAddress] = useState(null);
  const [marketAddress, setMarketAddress] = useState(null);
  const [purchasedItems, setpurchasedItems] = useState([]);
  const [newPrice, setNewPrice] = useState(0);
  const [resellItems, setResellItems] = useState([]);

  const [isLoading, SetIsLoading] = useState(true);

  useEffect(() => {
    const LoadContracts = async () => {
      //Paths of Json File
      openLoaderModal();
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

        //TODO:

        console.log(account);
        //Fetch all unsold items
        const data = await deployedMarketContract.methods
          .getMyNFTPurchased()
          .call({ from: account });

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
              buttonTitle: "Process To Resell",
            };
            console.log(item);

            return myItem;
          })
        );

        setpurchasedItems(items);
        SetIsLoading(false);
        closeLoaderModal();
      } else {
        openSuccessModal();
      }
    };
    web3Api.web3 && account && LoadContracts();
  }, [account]);
  //Resell Function

  const resellItemFunction = async (item, newPrice) => {
    console.log(marketContract);
    console.log(nftAddress);

    if (marketContract) {
      let marketFees = await marketContract.methods.gettheMarketFees().call();
      marketFees = marketFees.toString();
      const priceToWei = Web3.utils.toWei(newPrice, "ether");
      console.log(priceToWei);

      try {
        closePriceModal();
        await marketContract.methods
          .putItemToResell(nftAddress, item.itemId, priceToWei)
          .send({ from: account, value: marketFees });
        console.log("Resell NFt");
        router.push("/");
      } catch (e) {
        console.log(e);
      }
    }
  };
  let [priceOpen, setPriceOpen] = useState(false);
  let inputPriceRef = useRef(null);
  let [loaderOpen, setLoaderOpen] = useState(false);
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
  }

  const breadcrumbs = ["Explore", "Beautiful Artwork", "Purchased Items"];

  return (
    <>
      <Head>
        <title>Purchased Items</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header current={-1}></Header>

      <div className="bg-[#0D0F23] dark:bg-white">
        <div className="w-full 2xl:max-w-screen-2xl h-auto pt-[104px] m-auto">
          <div className="flex flex-col mx-8 sm:mx-16 lg:mx-[9vw] space-y-6 py-12">
            {/* custom breadcrubs */}
            <Breadcrumbs home="Home" breadcrumbs={breadcrumbs}></Breadcrumbs>

            <div className="border border-[#787984]"></div>

            <div className="flex flex-col space-y-6">
              <h1 className="flex-grow text-white dark:text-gray-800 text-2xl sm:text-4xl font-bold">
                Purchased Items
              </h1>

              <div className="text-white dark:text-gray-800">
                <FontAwesomeIcon
                  icon={faClone}
                  className="text-[#FAD804] text-xl mr-3"
                />
                This is a descriptive sub-headline that introduces the whole
                content of this text to the audience who is interested in
                reading about this topic.
              </div>

              <div className="flex flex-row items-center space-x-4 rounded-md bg-[#212760] dark:bg-white border-2 border-[#212760] dark:border-2 dark:border-gray-200 p-4">
                <div className="flex-none grid place-items-center w-16 h-16 rounded-md bg-[#215BF0] m-auto">
                  <FontAwesomeIcon
                    icon={faClone}
                    className="text-[#FAD804] text-4xl font-bold"
                  />
                </div>
                <div className="flex-grow flex-col">
                  <p className="text-white dark:text-gray-800 text-xl font-bold">
                    Good Job
                  </p>
                  {!purchasedItems ? (
                    <p className="text-[#53CEC7] dark:text-gray-600 text-sm font-bold">
                      You Purchased {purchasedItems.length} NFTS
                    </p>
                  ) : (
                    <p className="text-[#53CEC7] dark:text-gray-600 text-sm font-bold">
                      Start To Purchased Items Now
                    </p>
                  )}
                </div>
              </div>

              {/* galleries */}
              <ArtGallery4
                galleries={purchasedItems}
                closePriceModal={closePriceModal}
              >
                {{ resellFucnction: resellItemFunction }}
              </ArtGallery4>
              <SuccessDialog
                show={successOpen}
                closeSuccessModal={closeSuccessModal}
              >
                {{
                  msg: "PLease Connect MetaMask With Roposten NetWork",
                  title: "Attention",
                  buttonTitle: "Cancel",
                }}
              </SuccessDialog>
              <LoaderDialog
                show={loaderOpen}
                openLoaderModal={openLoaderModal}
              ></LoaderDialog>
            </div>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </>
  );
}

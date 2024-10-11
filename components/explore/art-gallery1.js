import Link from "next/link";

export default function ArtGallery1(props) {
  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {props.galleries.map((item, index) => (
        <div
          key={item.itemId}
          className="w-full h-auto bg-[#161A42] dark:bg-white grid grid-cols-1 justify-items-center gap-2 text-center p-4 text-white border-2 border-[#161A42] dark:text-gray-800 dark:border-2 dark:border-gray-200 bg-[url('/assets/svg/bg-top-newest-nft-art.svg')] rounded-xl"
        >
          <h1 className="text-xl sm:text-2xl xl:text-4xl">{item.name}</h1>

          <Link
            href={{
              pathname: `/market/${item.tokenId}/`,
              query: {
                id: `${item.itemId}`,
              },
            }}
          >
            <img
              style={{ height: "200px", width: "200px" }}
              src={item.image}
              alt={item.name}
              className="rounded-full object-cover h-48 w-96 border-solid border-4 border-sky-500 "
            ></img>
          </Link>
          <Link
            href={{
              pathname: `/market/${item.tokenId}/`,
              query: {
                id: `${item.itemId}`,
              },
            }}
          >
            <button className="rounded-full bg-gradient-to-b from-[#3461FF] to-[#8454EB] text-white text-base uppercase w-3/4 py-2 shadow-md mx-auto my-2">
              ⚡ {item.buttonTitle}
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}

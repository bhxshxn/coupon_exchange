import {
  useAddress,
  useMetamask,
  useNFTCollection,
  useSigner,
} from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import axios from "axios";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "../components/Header";
import LoadingFullScreen from "../components/LoadingFullScreen";

const style = {
  Wrapper: `flex flex-col justify-top items-center h-screen w-screen bg-[#3b3d42] `,
  button: `border border-[#282b2f] bg-[#2081e2] p-[0.8rem] text-xl font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text=[#282b2f] font-semibold mt-4`,
  form: ` flex flex-col justify-center items-left py-[50px]`,
};

const Create = () => {
  const address = useAddress();
  const connectUsingMetamask = useMetamask();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const signer = useSigner();
  console.log(image);
  const collection = useNFTCollection(
    process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS
  );

  const inputFileRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const tw = new ThirdwebSDK(signer);
    const upload = await tw.storage.upload(image);
    console.log(upload);
    const res = await axios.post("/api/generate", {
      name,
      description,
      image: upload,
    });

    const { signature } = res.data;

    await collection.signature.mint(signature);

    confirmMint();
    setDescription("");
    setImage(null);
    setName("");
    setLoading(false);
  };
  const confirmMint = (toastHandler = toast) =>
    toastHandler.success(`Minting successful!`, {
      style: {
        background: "#04111d",
        color: "#fff",
      },
    });
  return (
    <>
      <Header />
      <div className={style.Wrapper}>
        <Toaster position='top-center' reverseOrder={false} />
        {address ? (
          <>
            {loading ? (
              <LoadingFullScreen />
            ) : (
              <div>
                <form className={style.form} onSubmit={onSubmit}>
                  <div className='py-[15px] flex justify-between'>
                    Image URL:
                    <input
                      className='hidden'
                      type='file'
                      name='myImage'
                      onChange={(event) => {
                        setImage(event.target.files[0]);
                      }}
                      ref={inputFileRef}
                      accept='image/*'
                    />
                    {image == null ? (
                      <div
                        onClick={() => inputFileRef.current.click()}
                        className='cursor-pointer	 text-center rounded-[5px] bg-white w-[248px] h-[24px]'
                      >
                        Click to upload your Image
                      </div>
                    ) : (
                      <>
                        <div className='	text-center rounded-[5px] bg-white w-[248px] h-fit'>
                          {image?.name}
                        </div>
                        <div
                          className='cursor-pointer'
                          onClick={() => setImage(null)}
                        >
                          <svg
                            className='w-6 h-6'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                            />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>
                  <div className='py-[15px] flex justify-between'>
                    Name:
                    <input
                      type='text'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className='rounded-[5px]'
                    />
                  </div>
                  <div className='py-[15px] flex justify-between'>
                    Description:
                    <input
                      type='text'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className='rounded-[5px]'
                    />
                  </div>

                  <div className='w-[100%] flex justify-center '>
                    <div className='rounded-[5px] w-[50%] flex justify-center py-[5px] bg-[#0062ff]'>
                      <button type='submit' disabled={loading}>
                        Mint NFT
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </>
        ) : (
          <button onClick={connectUsingMetamask}>Connect using Metamask</button>
        )}
      </div>
    </>
  );
};
export default Create;

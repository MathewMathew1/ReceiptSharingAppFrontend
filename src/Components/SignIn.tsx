import { useEffect } from "react";
import { GOOGLE_LOGIN_ROUTE , DISCORD_LOGIN_ROUTE , GET_RECEIPTS_ROUTE  } from "../routes/routes";

const PROVIDERS  = [
  {name: "Google", id: 1, icon: GoogleIcon, signUrl: GOOGLE_LOGIN_ROUTE },
  {name: "Discord", id: 2, icon: DiscordIcon, signUrl: DISCORD_LOGIN_ROUTE },
]

export default function SignIn() {

  useEffect(() => {
    const get = async () => {
      const response = await fetch(GET_RECEIPTS_ROUTE , {
        method: 'GET',
        mode: "cors",
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response)
      if (response.status === 200) {
        // Retrieve the authorization link from the response JSON
        const data = await response.json();
        console.log(data)
      }
    }

    get()
  }, []);

    const login = async (signUrl: string) => {
      window.location.href = signUrl;
    }
 
    return (
      <>
        <div className='flex items-center w-full flex-col mt-6 '>
          <div className='shadow bg-light-secondaryBg dark:bg-dark-secondaryBg  p-6'>
            <div><h1 className='text-light-text dark:text-dark-secondaryText text-center bold text-2xl'>Authorize:</h1></div>
            <div className='flex gap-3 flex-col mt-5'>
              {Object.values(PROVIDERS).map((provider) => {

                return(
                  <div key={provider.id} className="flex  items-center justify-center ">
                    <button onClick={()=>login(provider.signUrl)}  className="flex items-center dark:bg-dark-colorBtnPrimary dark:text-dark-text  border border-gray-300 
                    rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none 
                    focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                      {provider.icon()}
                      <span>Continue with {provider.name}</span>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </>
    );
  }

  function DiscordIcon()  {
    return <img className='mr-1' alt={"discord"} loading="lazy" height="24" width="24" id="provider-logo" src="https://authjs.dev/img/providers/discord.svg"/>
  }

  function GoogleIcon() {
    return <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" 
    viewBox="-0.5 0 48 48" version="1.1"> <title>Google-color</title> <desc>Created with Sketch.
      </desc> <defs> </defs> 
        <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> 
          <g id="Color-" transform="translate(-401.000000, -860.000000)"> 
            <g id="Google" transform="translate(401.000000, 860.000000)"> 
            <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> 
            </g> 
          </g> 
        </g> 
      </svg>
  }

  export async function getServerSideProps() {
   
  }

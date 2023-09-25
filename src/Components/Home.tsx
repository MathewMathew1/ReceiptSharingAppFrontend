import React, { useEffect, useState } from "react";
import { RECEIPTS_ROUTE } from "../routes/routes";
import { Receipt } from "../types/Receipt";
import ReceiptPreview from "./Receipts/ReceiptPreview";
import { LoadingSpinner } from "./LoadingCircle";
import { useSearchParams } from "react-router-dom";
import {INPUT_CLASS} from "../Utils/input"
import Button from "./Button";

const SELECTION_OPTIONS = [
  {name: "Newest", queryParam: "newest"},
  {name: "Best Rated", queryParam: "bestRated"},
  {name: "Hottest", queryParam: "hot"},
]

const LIMIT_PER_PAGE = 20

export default function Home() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchType, setSearchType] = useState(searchParams.get("sort") || SELECTION_OPTIONS[0].queryParam)
  const [fetchedReceipts, setFetchedReceipts] = useState(false)
  const [disableSearchButton, setDisableSearchButton] = useState(false)
  const [search, setSearch] = useState(searchParams.get("search")? searchParams.get("search")!: "")
  

  const [isThereNextPage, setIsThereNextPage] = useState(false)

  const controller = new AbortController()

  useEffect(() => {
    const getReceipts = async () => {
      try{
        setDisableSearchButton(true)

        const { signal } = controller
        setFetchedReceipts(false)
        const page =searchParams.get("page")? parseInt(searchParams.get("page")!): 0
        const skip = page * LIMIT_PER_PAGE

        const searchParam = searchParams.get("search")? searchParams.get("search"): ""

        const response = await fetch(RECEIPTS_ROUTE+`?sortType=${searchParams.get("sort")}&limit=${LIMIT_PER_PAGE}&skip=${skip}&searchQuery=${searchParam}`,{
          method: "GET",
          signal
        })
        const data  = await response.json()
        if(!data.error && !data.errors){
          setReceipts(data.receipts)
          setIsThereNextPage(data.isThereNextPage)
        }
        console.log(data)
      }catch(e){
        console.log(e)
      } 
      finally{
        setFetchedReceipts(true)
        setDisableSearchButton(false)
      }
    }
    
    document.title = "Receptao";
    getReceipts()
  }, [searchParams.get("page"), searchParams.get("sort"), searchParams.get("search")]);

  useEffect(() => {

  }, []);
  
  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value);
    setSearchParams({ ["sort"]: e.target.value });
  }

  const page = searchParams.get("page")!==null? parseInt(searchParams.get("page")!): 1

  const nextPage = (changeInPage: number) => {
    setSearchParams({["page"]: (page+changeInPage).toString()})
  }

  const setParamsBeforeSearch = () => {
    setSearchParams({["search"]: search})
  }

  return (
    <div className="mt-5 flex flex-col">
      <div className="mb-5">
        <h1>Receipts</h1>
      </div>
      
        <div className="">
          <label htmlFor="sortSelector">Sort by:</label>
          <select value={searchType} className="ml-3 bg-light-selectorPrimaryBg dark:bg-dark-selectorPrimaryBg p-1" onChange={(e)=>handleSearchTypeChange(e)}  id="sortSelector">
            {SELECTION_OPTIONS.map((option, index) => (
                <option value={option.queryParam} key={`option ${index}`}>{option.name}</option>
            ))}
          </select>
          <input
            aria-placeholder={"search"}
            type="text"
            className={`${INPUT_CLASS} border ml-[2rem] px-4 py-1 focus:outline-none focus:border-blue-500`}
            placeholder="Search..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />
          <Button 
            className="ml-4"
            disabled={disableSearchButton} 
            color="green" 
            onClick={()=>setParamsBeforeSearch()}>
            Search
          </Button>
        </div>
        {fetchedReceipts?
        <div>
          {receipts.length > 0?
            <div className="flex justify-center gap-5 mt-4 align-center flex-wrap">
                {receipts.map((receipt, index) => (
                  <ReceiptPreview receipt={receipt} key={`receipt ${index}`}/>
                ))

                }
            </div>
          :
            <div className="my-4 text-[1.2rem]">
               No Receipts have been found for this query   
            </div>
          }
          <div className="mt-5 flex gap-1 justify-center">
              <Button color="blue" disabled={page===1} onClick={()=>nextPage(-1)}>Previous</Button>
              <Button color="blue" disabled={!isThereNextPage} onClick={()=>nextPage(1)}>Next</Button>
          </div>
        </div>
        :
            <LoadingSpinner/>
        }
    </div>
  );
}
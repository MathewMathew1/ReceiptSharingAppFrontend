import {BiErrorCircle} from "react-icons/bi"

const INPUT_CLASS = "bg-light-inputPrimaryBg text-light-text dark:text-dark-text dark:bg-dark-inputPrimaryBg invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500" 

export const InputGroup = ({labelName, name, value, handleInputChange, error}: {
    labelName: string, 
    name: string, 
    value: string, 
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error: string|null
}) => {

    return(
        <div className="mb-4">
            <div className="flex items-center justify-center flex-col md:flex-row">
                <div className="flex items-center justify-center">
                    <label htmlFor={name} className="font-semibold mb-1 md:w-[120px] text-left text-light-text dark:text-dark-text">
                        {labelName}
                    </label>
                </div>
                <input name={name} className={`${INPUT_CLASS} ${error? "border-red-500" : ""} w-full border rounded-lg px-4 py-1 focus:outline-none focus:border-blue-500`} 
                    value={value} onChange={(e)=>(handleInputChange(e))}/>
            
            </div>
            {error?
                <div className="basis-[100%]">
                    <span className="mt-2  text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                    <InputError error={error}/>
                    </span>
                </div>
            :
                null
            }
        </div>
    )
}

export const TextAreaGroup = ({labelName, name, value, handleInputChange, error}: {
    labelName: string, 
    name: string, 
    value: string, 
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>) => void
    error: string|null
}) => {

    return(
        <div className="mb-4 ">
            <div className="flex flex-col sm:flex-row ">
                <div className="flex items-center justify-center">
                    <label htmlFor={name} className="font-semibold mb-1 md:w-[120px] text-left text-light-text dark:text-dark-text">
                        {labelName}
                    </label>
                </div>
                <textarea rows={3}  name={name} className={`${INPUT_CLASS} w-full border resize-none rounded-lg px-4 py-1 focus:outline-none focus:border-blue-500`} 
                    value={value} onChange={(e)=>(handleInputChange(e))}/>
            </div>
            {error?
                <div className="basis-[100%]">
                    <InputError error={error}/>
                </div>
            :
                null
            }
        </div>
    )
}

export const InputError = ({error}: {error: string}) => {

    return (
        <div className="mt-2 gap-3 flex items-center bg-slate-300 text-left pl-5 dark:bg-[#222222] p-1 text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
            <div className="flex-1">{error} </div>
            <div><BiErrorCircle fill={"red"}/></div>
        </div>
    )
}
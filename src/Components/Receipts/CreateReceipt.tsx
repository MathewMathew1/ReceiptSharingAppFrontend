import React, { useState } from "react";
import Button from "../Button";
import { BiSolidDownvote, BiSolidUpvote } from "react-icons/bi"
import {BsClockFill} from "react-icons/bs"
import AddIngredient from "./AddIngredient";
import { Ingredient, Receipt } from "../../types/Receipt";
import ImageCarousel from "./ImageCarousel";
import {MdClose} from "react-icons/md"
import { RECEIPTS_ROUTE } from "../../routes/routes";
import { InputError, InputGroup, TextAreaGroup } from "../Input";
import { stringLengthValidator, arrayLengthValidator, numberRangeValidator } from "../../Utils/validators";

const INPUT_CLASS = "bg-light-inputPrimaryBg text-light-text dark:text-dark-text dark:bg-dark-inputPrimaryBg invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500" 

type FormDataType = {
    title: string,
    description: string,
    newStep: string,
    steps: string[]
    ingredients: Ingredient[],
    minCookDuration: number,
    maxCookDuration: number,
    videoLink: string
}

type CreateReceiptProps= {
    isUpdate: true; // When isUpdate is true
    defaultValues: Receipt; // defaultValues must be provided and not null
    cancelFunction?: () => void;
} | {
    isUpdate: false; // When isUpdate is false
    defaultValues?: Receipt; // defaultValues is optional
    cancelFunction?: () => void;
};

const CreateReceipt: React.FC<CreateReceiptProps> = ({ isUpdate, defaultValues, cancelFunction }) => {
    const [images, setImages] = useState<File[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formSend, setFormSend] = useState(false)
    const [formData, setFormData] = useState<FormDataType>(() => {
        // Use defaultValues if in update mode, otherwise initialize with empty values
        return  {
          title: defaultValues? defaultValues.title: "",
          description: defaultValues? defaultValues.description: "",
          newStep: "",
          steps: defaultValues? defaultValues.steps: [],
          ingredients: defaultValues? defaultValues.ingredients: [],
          minCookDuration: defaultValues? defaultValues.minCookDuration: 30,
          maxCookDuration: defaultValues? defaultValues.maxCookDuration: 60,
          videoLink: defaultValues?.videoLink? defaultValues.videoLink:  ""
          // Add more fields as needed
        };
    });
    
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        const titleError = stringLengthValidator('Title', formData.title, 2, 64);
        if (titleError) newErrors.title = titleError;

        const descriptionError = stringLengthValidator('Description', formData.description, 2, 1048);
        if (descriptionError) newErrors.description = descriptionError;

        const minCookDurationError = numberRangeValidator('Min Cook Duration', formData.minCookDuration, 0, 1000);
        if (minCookDurationError) newErrors.minCookDuration = minCookDurationError;

        const maxCookDurationError = numberRangeValidator('Max Cook Duration', formData.maxCookDuration, 0, 1000);
        if (maxCookDurationError) newErrors.maxCookDuration = maxCookDurationError;

        const stepsError = arrayLengthValidator('Steps', formData.steps, 1, 30);
        if (stepsError) newErrors.steps = stepsError;

        if(!isUpdate){
            const imagesError = arrayLengthValidator('Images', images, 1, 30);
            if (imagesError) newErrors.images = imagesError;
        }
       
        const ingredientsError = arrayLengthValidator('Ingredients', formData.ingredients, 1, 100);
        if (ingredientsError) newErrors.ingredients= ingredientsError;

        // Add more validation rules for other fields as needed

        return newErrors;
    }
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
 
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    const addStep = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const newStepError = stringLengthValidator('Step', formData.newStep, 2, 256);
        if (newStepError) {
            setErrors((errors) => ({
                ...errors,
                step: newStepError
            }))
            return
        }else{
            setErrors((errors) => {
                const { step, ...restErrors } = errors;
                return restErrors;
            });
        }
        
        e.preventDefault()
        setFormData((currentData)=>({
            ...currentData,
            steps: [...currentData.steps, currentData.newStep],
            newStep: ""
            
        }));
    }

    const addIngredient = async (ingredient: Ingredient, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setFormData((currentData)=>({
            ...currentData,
            ingredients: [...currentData.ingredients, ingredient],  
        }));
    }
      const moveInArrayUp = (index: number, name: keyof FormDataType) => {
        const value = formData[name]
        
        if(!Array.isArray(value)) return

        if (index > 0 && index < value.length) {
          const updatedArray = [...value];
          const itemToMove = updatedArray.splice(index, 1)[0];
          updatedArray.splice(index - 1, 0, itemToMove);
          setFormData({
            ...formData,
            [name]: updatedArray,
          });
        }
      };

      const deleteFromArray = (index: number, name: keyof FormDataType) => {
        const value = formData[name]
        
        if(!Array.isArray(value)) return

        let updatedArray = [...value];
        updatedArray = updatedArray.filter((_item, indexInArray) => indexInArray !== index);

        // Update the state with the new array
        setFormData((formData)=>({
            ...formData,
            [name]: updatedArray,
        }));

      }
    
      // Generic function to move an element down in any array within formData
      const moveInArrayDown = (index: number, name: keyof FormDataType) => {
        const value = formData[name]

        if(!Array.isArray(value)) return

        if (index >= 0 && index < value.length - 1) {
          const updatedArray = [...value];
          const itemToMove = updatedArray.splice(index, 1)[0];
          updatedArray.splice(index + 1, 0, itemToMove);
          setFormData({
            ...formData,
            [name]: updatedArray,
          });
        }
    };

    function isYouTubeVideo(url: string) {
        // Regular expression pattern to match YouTube video URLs
        const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&=%\?]{11})/;
        
        return url.match(youtubePattern) !== null;
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
       
        e.preventDefault();
        const newErrors = validateForm()

        setErrors(newErrors)
        if (Object.keys(newErrors).length !== 0) {
            console.log(newErrors)
            return
        }
        setFormSend(true)
        const formDataRequest = new FormData();
        formDataRequest.append('Title', formData.title);
        formDataRequest.append('Description', formData.description);
        for (let i = 0; i<formData.steps.length; i++) {
            formDataRequest.append(`Steps[${i}]`, formData.steps[i])
        }

        formDataRequest.append('VideoLink', formData.videoLink);
        formDataRequest.append('MinCookDuration', formData.minCookDuration.toString());
        formDataRequest.append('MaxCookDuration', formData.maxCookDuration.toString());
        formData.ingredients.forEach((obj, index) => {
            Object.entries(obj).forEach(([key, value]) => {
              formDataRequest.append(`Ingredients[${index}].${key}`, value.toString());
            });
        });
        if(!isUpdate){
            for (const image of images) {
                formDataRequest.append("Images", image);
            }
        }
        
        const method = isUpdate? "PUT": "POST"
        const route = isUpdate? RECEIPTS_ROUTE+`/${defaultValues?.id}`: RECEIPTS_ROUTE

        try {
            setFormSend(true)
            const response = await fetch(route, {
                method: method,
                credentials: "include",
                body: formDataRequest,
            });

            const data = await response.json()
            console.log(data)
            if(!data.error && !data.errors){
                location.reload()
            }else{
                //handle error
            }

        }catch (error) {
            // Handle network error
            console.error('Error:', error);
        }
        finally{
            setFormSend(false)
        }
    };

    

    return (
        <div className="flex items-center mt-5">
            <form onSubmit={e => e.preventDefault()} noValidate className="w-[100%] flex justify-center group">
                <div className="glass-rounded flex justify-center flex-col text-light-text dark:text-dark-text w-[fit-content]">
                    <h2 className="font-extrabold text-[2rem]">Create Receipt</h2>
                    <div className="flex gap-5 flex-col md:flex-row justify-center ">          
                        <div className="glass-rounded">             
                            <h3 className="text-[2rem] mb-3">Main info:</h3>
                            <InputGroup name="title" value={formData.title} labelName="Title:" error={errors.title}
                                handleInputChange={handleInputChange}/>
                            <TextAreaGroup name="description" value={formData.description} labelName="Description:" 
                                handleInputChange={handleInputChange} error={errors.description}/>
                            <InputGroup name="newStep" value={formData.newStep} labelName="Step:" error={errors.step}
                                handleInputChange={handleInputChange}/>
                            <div className="flex justify-end">
                                <Button color="green" onClick={(e)=>addStep(e)}>
                                    Add Step
                                </Button>
                            </div>
                            <div className="flex flex-col mt-4 mb-4 gap-1 md:w-[400px] ">
                                <h3>Steps</h3>
                                {errors.steps?
                                    <InputError error={errors.steps}/>
                                :
                                    null
                                }
                                {formData.steps.map((step, index)=> (
                                    <div className="flex px-2 py-2 bg-light-infoBg dark:bg-dark-infoBg" key={`step ${index}`}>
                                        <div>{index+1}.</div>
                                        <div className="flex-1 text-left break-all">{step}</div>
                                        <div className="flex flex-col justify-center">
                                            <BiSolidUpvote onClick={()=>moveInArrayUp(index, "steps")} fill={`${index===0? "grey": ""}`}/>
                                            <BiSolidDownvote onClick={()=>moveInArrayDown(index, "steps")} fill={`${index===formData.steps.length-1? "grey": ""}`}/>
                                        </div>
                                        <div>
                                            <div className="rounded-[50%] bg-slate-400 hover:bg-slate-500">
                                                <MdClose onClick={()=>deleteFromArray(index, "steps")}/>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <AddIngredient addIngredient={addIngredient}/>
                            <div className="flex flex-col mt-4 mb-4 gap-1">
                                <h3>Ingredients</h3>
                                {errors.ingredients?
                                    <InputError error={errors.ingredients}/>
                                :
                                    null
                                }
                                {formData.ingredients.map((ingredient, index)=> (
                                    <div className="flex px-2 py-2 bg-light-infoBg dark:bg-dark-infoBg" key={`step ${index}`}>
                                        <div>{index+1}.</div>
                                        <div className="flex-1 text-left flex gap-2">
                                            <div className="break-all">
                                                {ingredient.name}
                                            </div>
                                            <div>
                                                {ingredient.quantity}
                                            </div>
                                            <div>
                                                {ingredient.unit}
                                            </div>
                                            <div>
                                                {ingredient.optional? "*": null}
                                            </div>
                                            <div>
                                            
                                        </div>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <BiSolidUpvote onClick={()=>moveInArrayUp(index, "ingredients")} fill={`${index===0? "grey": ""}`}/>
                                            <BiSolidDownvote onClick={()=>moveInArrayDown(index, "ingredients")} fill={`${index===formData.ingredients.length-1? "grey": ""}`}/>
                                        </div>
                                        <div>
                                            <div className="rounded-[50%] bg-slate-400 hover:bg-slate-500">
                                                <MdClose onClick={()=>deleteFromArray(index, "ingredients")}/>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        
                        </div>
                        <div className="glass-rounded">
                            <h3 className="text-[2rem] mb-3">Secondary info:</h3>
                            <div className="flex flex-row items-center justify-center mb-3">
                                    
                                    <div className="flex items-center">
                                        <BsClockFill/>
                                    </div>
                                    <input className={`${INPUT_CLASS} p-1 w-[4rem] ml-1`} onChange={(e)=>handleInputChange(e)} name="minCookDuration" value={formData.minCookDuration}></input>
                                    -
                                    <input className={`${INPUT_CLASS} p-1 w-[4rem]`} onChange={(e)=>handleInputChange(e)} name="maxCookDuration" value={formData.maxCookDuration}></input>
                                    min
                                
                            </div>
                            {isUpdate?
                                null
                            :
                                <div>
                                    <h3>Images</h3> 
                                    {errors.images?
                                        <div className="my-3">
                                            <InputError error={errors.images}/>
                                        </div>
                                    :
                                        null
                                    }
                                    <ImageCarousel images={images} setImages={setImages}/>
                                </div>
                            }
                                
                            <div className="mt-4">
                                <InputGroup name="videoLink" value={formData.videoLink} labelName="VideoLink:" error={null} 
                                    handleInputChange={handleInputChange}/>
                                {isYouTubeVideo(formData.videoLink)?
                                    <iframe
                                        width="400"
                                        height="300"
                                        src={formData.videoLink}
                                        title="YouTube Video"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                :
                                    null
                                } 
                            </div>              
                        </div>                    
                    </div>
                    <div className="mt-4">
                        <Button
                            disabled={formSend}
                            type="submit"
                            onClick={(e)=>handleSubmit(e)}
                            className="submit group-invalid:pointer-events-none group-invalid:opacity-30 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                        >
                            {isUpdate? "Update":  "Create Receipt" }
                        </Button>
                        {isUpdate?
                            <Button onClick={()=>cancelFunction!()} color="red">
                                Cancel
                            </Button>
                        :
                            null
                        }
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateReceipt;
import { useState } from "react";
import { Ingredient } from "../../types/Receipt";
import Button from "../Button";
import { InputError } from "../Input";
import { numberRangeValidator, stringLengthValidator } from "../../Utils/validators";

const AddIngredient = ({addIngredient}: {addIngredient: (ingredient: Ingredient, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>}) => {
    const [ingredientData, setIngredientData] = useState<Ingredient>({
        name: '',
        quantity: 0,
        unit: '',
        optional: false,
    });
    const [error, setError] = useState<string|null>("")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setIngredientData((ingredientData) => ({
            ...ingredientData,
            [name]: value,
        }));
    };

    const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setIngredientData((ingredientData) => ({
            ...ingredientData,
            optional: e.target.checked,
        }));
    };


    const clearData = () => {
        setIngredientData({
            name: '',
            quantity: 0,
            unit: '',
            optional: false,
        });
    }

    const handleForm = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const nameError = stringLengthValidator('Name', ingredientData.name, 2, 64);
        if (nameError) {
            setError(nameError)
            return
        }
        const unitError = stringLengthValidator('Unit', ingredientData.unit, 1, 8);
        if (unitError) {
            setError(unitError)
            return
        }
        const quantityError = numberRangeValidator('Quanity', ingredientData.quantity, 1, 1000000);
        if (quantityError) {
            setError(quantityError)
            return
        }

        setError(null)
        await addIngredient(ingredientData, e);
        clearData()
    }

    return (
            <>
                <label className="text-2xl" htmlFor="name">New Ingredient</label>
                <div className="flex-1 flex-row m-3 bg-light-inputPrimaryBg text-light-text dark:text-dark-text dark:bg-dark-inputPrimaryBg">     
                    <input
                        className="w-[200px] sm:border-r sm:border-gray-300 bg-light-inputPrimaryBg text-light-text dark:text-dark-text dark:bg-dark-inputPrimaryBg  rounded-none px-2 py-1 focus:outline-none focus:border-blue-500"
                        type="text"
                        id="name"
                        placeholder="Ingredient Name"
                        name="name"
                        value={ingredientData.name}
                        onChange={(e) => handleInputChange(e)}
                    />
                    <input
                        className="w-[75px] border-r border-gray-300 bg-light-inputPrimaryBg text-light-text dark:text-dark-text dark:bg-dark-inputPrimaryBg rounded-none px-2 py-1 focus:outline-none focus:border-blue-500"
                        type="number"
                        id="quantity"
                        placeholder="50"
                        name="quantity"
                        value={ingredientData.quantity}
                        onChange={(e) => handleInputChange(e)}
                    />
                    <input
                        className="w-[50px] border-r border-gray-300 bg-light-inputPrimaryBg text-light-text dark:text-dark-text dark:bg-dark-inputPrimaryBg rounded-none px-2 py-1 focus:outline-none focus:border-blue-500"
                        type="text"
                        id="unit"
                        placeholder="mg"
                        name="unit"
                        value={ingredientData.unit}
                        onChange={(e) => handleInputChange(e)}
                    />
                    <input
                        className="w-[50px] bg-light-inputPrimaryBg text-light-text dark:text-dark-text dark:bg-dark-inputPrimaryBg rounded-none px-2 py-1 focus:outline-none focus:border-blue-500"
                        type="checkbox"
                        id="optional"
                        name="optional"
                        checked={ingredientData.optional}
                        onChange={(e) => {handleCheckChange(e);}}
                    />
                </div>
                {error?
                    <InputError error={error}/>
                :
                    null
                }
                <div className="flex justify-end">
                    <Button color="green" onClick={(e)=> handleForm(e)}>Add</Button>
                </div>
            </>
 
    );
}

export default AddIngredient;
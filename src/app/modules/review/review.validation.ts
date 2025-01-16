import { z } from "zod";



const createReviewValidationSchema = z.object({
    courseId : z.string(),
    rating : z.number().max(5,{message:'Ratings cannot be more than 5'}).min(1,{message:'Ratings cannot be less than 1'}),
    review : z.string().max(500,{message:'Review cannot be more than 500 characters'}).optional()
})




export const reviewValidations = {
    createReviewValidationSchema
}
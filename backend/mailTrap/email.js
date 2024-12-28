import { mailclient,sender } from "./mailTrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE } from "./email.Template.js"
import { MailtrapClient } from "mailtrap";
export const sendVerificationMail=async(email,verificationToken)=>{
const recipient=[{email}];
try {
    const response= await mailclient.send({
        from:sender,
        to:recipient,
        subject:"Verify your email",
        html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
        category:"Email verification"
    })
    console.log("email send successfully",response);
    
    
} catch (error) {
    console.error(`eroor sending verification `,error);
    throw new Error(`Eroor sending verification mail : ${error}`)
    
}
}
export const sendwelcomeEmail=async(email,name)=>{
    const recipients=[{email}]
    try {
        const response=await mailclient.send({
            from:sender,
            to:recipients,
            template_uuid: "231d7902-fba7-453f-824e-90ee63d5ed94",
            template_variables: {
                "company_info_name": "Momento",
                "name":name,
                "company_info_address": "RR Nagara",
                "company_info_city": "Bengaluru",
                "company_info_zip_code": "560-098",
                "company_info_country": "India"
              }
        })
        console.log("Welcome email sent Successfully");
        

    } catch (error) {
        console.log('Error Sending Verification email:',error);
    
    throw new Error(`Error Sending Verification email: ${error} `)
    }  

}
export const sendPasswordResetEmail=async(email,resetURL)=>{
    const recipients=[{email}];
    try {
        
        const response=await mailclient.send({
            from:sender,
            to:recipients,
            subject:"Reset your password",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
            category:"Password reset"
        })
        console.log("reset link sent successfully",response);
        
    } catch (error) {
        console.log("Error in sendPasswordResetEmail",error);
        
        throw new Error(`Error in Sending password reset email: ${error} `)
    }
    }
    export const sendResetSuccessEmail=async(email)=>{
        const recipients=[{email}];
        try{
const response=await mailclient.send({
    from:sender,
    to:recipients,
    subject:"Password reset successful",
    html:PASSWORD_RESET_SUCCESS_TEMPLATE,
    category:"Password Reset Success"
})
        }catch(error){
            console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
        }
    }
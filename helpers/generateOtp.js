// Create a random 6-digit OTP

function generateOTP(){
    return Math.floor(100000 + Math.random()* 900000);
}


export default generateOTP;
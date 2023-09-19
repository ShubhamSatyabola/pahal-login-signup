const form = document.getElementById('addform');
const otpForm= document.getElementById('otpForm');


form.addEventListener('submit', signup)
otpForm.addEventListener('submit',otpVerify)
async function signup(e){
    try{
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        // const number = document.getElementById('number').value;
        const password = document.getElementById('password').value;

        const obj = {name, email, password};
        const response = await axios.post('http://localhost:3000/user/signup',obj)
        localStorage.setItem("token",response.data.token)
        alert(response.data.message)  
        window.location.href='./otp.html'
    }
    catch(err){
        console.log(err)
    }
    

}
async function otpVerify(e){
    try{
        e.preventDefault();
        const otp = document.getElementById('name').value;
        const token = localStorage.getItem('token');
        // const number = document.getElementById('number').value;
        // const password = document.getElementById('password').value;


        const obj = {otp,token};
        const response = await axios.post('http://localhost:3000/user/verify',obj)
        // localStorage.setItem("token",response.data.token)
        // if(response.status==500){
        //     document.getElementById('error').innerHTML=response.data.message
        // }
        // else{
            alert(response.data.message)
        // }
        
        
        window.location.href='../login/login.html'
    }
    catch(err){
        console.log(err)
    }
    

}
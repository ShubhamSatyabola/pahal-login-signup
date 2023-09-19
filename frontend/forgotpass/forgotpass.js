const forgotPassword = document.getElementById('formforgotpass');
            forgotPassword.addEventListener('submit', setNewPassword);

            async function setNewPassword(e){
                try{
                    e.preventDefault()
                    const email = document.getElementById('email').value;
                    // console.log(email)
                    const data = {email}
                    const response  = await axios.post('http://localhost:3000/password/forgot-password',data)
                    alert(response.data.message)
                }
                catch(err){
                    console.log(err)
                }
            }

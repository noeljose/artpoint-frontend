<script>
    import {navigate} from 'svelte-navigator'
    import {API_URL} from '../../component/constant'

	let input ={email:"",password:"",type:"",token:""}
    let errs = ''

    const login =async()=>{
        if(input.type==""){
            errs = "Select Admin Type"
        }else if(input.type=="superAdmin"){
            errs=""
            if(input.email === 'admin' && input.password==='123'){
                localStorage.setItem("admin_details",JSON.stringify(input))
                navigate('/admin')
            }else{
                errs='Wrong Credentials'
            }
        }else if(input.type=="marketer"){
            errs=""
            const res = await fetch(`${API_URL}/marketeer/login`,
            { method:'post',
            body:JSON.stringify(input),
            headers:{'Content-Type': 'application/json'}
            })
            const json = await res.json()
            if(json.status === true){
                localStorage.setItem("admin_details",JSON.stringify(json.data))
                navigate('/marketer')
            }else{
                errs='Wrong Credentials'
            }
        }
    }
</script>

<main class='body'>
    <div class="container">
        <div class="row justify-content-center align-items-center">
            <div class="col-lg-6 col-md-6 col-sm-6 loginBox">
                <!-- <div class="row loginKey justify-content-center">
                    <i class="fa fa-key" aria-hidden="true"></i>
                </div> -->
                <div class="row loginTitle justify-content-center">
                    <img alt='logo' src="/assert/artLogo.PNG"/>
                </div>
                <div class="loginForm">
                    <div class="form-group  text-center">
                        <p class="inputLabel">USER TYPE</p>
                            <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                <label class="btn btn-outline-info">
                                    <input type="radio" name="super" id="super" autocomplete="off" on:blur={input.type="superAdmin"}> SUPER ADMIN
                                </label>
                                <label class="btn btn-outline-info">
                                    <input type="radio" name="admin" id="admin" autocomplete="off" on:blur={input.type="marketer"}> MARKETER
                                </label>
                            </div>
                    </div>
                    <div class="form-group">
                        <p class="inputLabel">USERNAME/E-Mail</p>
                        <input type="text" class="form-control loginInput" name='username' bind:value={input.email}/>
                    </div>
                    <div class="form-group">
                        <p class="inputLabel">PASSWORD</p>
                        <input type="password" class="form-control loginInput" name='password' bind:value={input.password}/>
                    </div>
                    <p class='text-danger text-center'>{errs}</p>
                    <div class="col loginButton text-right">
                        <button type="button" class="btn" on:click={login}>LOGIN</button>
                    </div>
                </div>
                <div class="col forgetLink ">
                    <a class='btn' href='/'>Forget Password ?</a>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    .body{
    background-color: #3e3e41c4;
	height: 100vh;

    }
  .loginBox {
    margin: 75px 20px;
    padding: 20px;
    height: auto;
    position: center;
    min-height: 450px;
    background: #1a2226c2;
    text-align: center;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

/* .loginKey i{
    height: 100%;
    width: 100%;
    font-size: 400%;
    line-height: 100px;
    background: -webkit-linear-gradient(#27EF9F, #0DB8DE);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
} */

.loginTitle {
    text-align: center;
    font-size: 30px;
    letter-spacing: 2px;
    font-weight: bold;
    color: #ECF0F5;
}
.loginTitle img{
    height: auto;
    width: 50%;
}

.loginForm {
    margin-top: 25px;
    text-align: left;
}

.loginInput {
    background-color: transparent;
    max-width: 100%;
    border: none;
    border-bottom: 2px solid #0DB8DE;
    border-top: 0px;
    border-radius: 0px;
    font-weight: bold;
    outline: 0;
    margin-bottom: 20px;
    padding-left: 0px;
    color: aquamarine;
}

.loginInput:focus {
    border-color: inherit;
    -webkit-box-shadow: none;
    box-shadow: none;
    border-bottom: 2px solid #0DB8DE;
    outline: none;
    background-color: transparent;
    color: aquamarine;
}

.inputLabel {
    font-size: 14px;
    color: #e6dfdf;
    font-weight: bold;
    letter-spacing: 1px;
}

.loginButton button {
 color: #0DB8DE;
 border-radius: 10px;
 border: 2px solid #0DB8DE;
 font-size: 20px;
 padding: 5px 20px;
 background-color: transparent;
 font-weight: bold;
}

.loginButton button:hover {
  color: #282c34;
  background-color: #0DB8DE;
 }

 .forgetLink{
     align-items: center;
     display: inline;
     color: aqua;
 }
 .forgetLink a{
    color: aqua;
}

.forgetLink a:hover{
    color: #0DB8DE;
}
</style>
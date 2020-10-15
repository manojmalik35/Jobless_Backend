import React, { Component } from 'react';
import Header from '../../components/Header/Header';
import Input from '../../components/Input/Input';
import recImg from "../../assets/recruitment.svg";
// import LoginDataManager from "./dataManager";

class Signup extends Component {

    constructor(props) {
        super(props);
        // this.dataManager = new LoginDataManager();
        this.state = {
            role: 1,
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: ""
        }
    }

    handleChange = (target) => {
        let value = target.value;
        let name = target.name;

        this.setState({
            [name]: value
        })
    }

    handleSubmit = (e) => {
        // this.dataManager.handleLogin({email : this.state.email, password : this.state.password})
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>{
        //     console.log(err);
        // })

    }

    render() {
        return (
            <div className="base">
                <Header></Header>
                <div className="base-form signup">
                    <h3>Signup</h3>
                    <form>
                        <fieldset>
                            <label>I'm a*</label>
                            <div className="role-container">
                                <button className="btn role" className="active" type="button" onClick={this.handleSubmit}>Recruiter</button>
                                <button className="btn role" type="button" onClick={this.handleSubmit}>Candidate</button>
                            </div>
                        </fieldset>
                        <fieldset>
                            <label>Email address</label>
                            <Input type="email" value={this.state.email} handleChange={this.handleChange}></Input>
                        </fieldset>
                        <fieldset>
                            <div className="password-label">
                                <label>Password</label>
                                <a href="/">Forgot your password?</a>
                            </div>
                            <Input type="password" value={this.state.password} handleChange={this.handleChange}></Input>
                        </fieldset>
                        <div className="error-container hidden">
                            <p className="error">Incorrect email address or password.</p>
                        </div>
                        <div className="btn-container">
                            <button className="btn" type="button" onClick={this.handleSubmit}>Login</button>
                        </div>
                    </form>
                    <p className="bottom">New to JobLess? <a href="/signup">Create an account</a></p>
                </div>
            </div>
        );
    }
}

export default Signup;
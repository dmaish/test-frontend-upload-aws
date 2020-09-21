/* eslint-disable no-useless-concat */
import React, {Component} from 'react';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import Switch from "react-switch";
import {withRouter} from 'react-router-dom';
import {JOB_VISIBILITY_PUBLIC, JOB_VISIBILITY_PRIVATE} from '../../helpers/constants';

import CategoriesService from './../../services/categories';

import './../../views/wizard.css';

import WizardContext from './../../helpers/wizardContext';

class JobPostDetails extends Component {
    static contextType = WizardContext;

    state = {
        toggleObjective: '',
        visibility: JOB_VISIBILITY_PUBLIC,
        categories: [],
        optionCategories: [],
        edit: false
    }

    componentDidMount() {
        const {wizardState} = this.context;
        const {toggleObjective, visibility, categories, percentageCompletion} = wizardState;
        const edit = this.props.location && this.props.location.state ? this.props.location.state.edit : false;
        this.setState({toggleObjective, visibility, categories, edit, percentageCompletion});
        this.fetchCategories();
        
    }

    fetchCategories = async () => {
        const optionCategories = await CategoriesService.fetchCategories();
        if (optionCategories && optionCategories.data.categories) {
            this.setState({optionCategories: optionCategories.data.categories});
        }
    }

    handleToggleObjectiveInput = (e) => {
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
    }

    handleCategorySelect = (newValue, actionMeta) => {
        this.setState({categories: newValue});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {setWizardValues} = this.context
        setWizardValues({...this.state, percentageCompletion: 15.3846});
        this.props.history.push('/wizard/users')
    }

    handleSubmitEdit = (e) => {
        e.preventDefault();
        const {setWizardValues} = this.context
        setWizardValues(this.state);
        this.props.history.push('/wizard/wizard-review')
    }

    handleBackButton = (e) => {
        e.preventDefault();
        const {setWizardValues} = this.context
        setWizardValues(this.state);
        this.props.history.push('/wizard/')
    }

    render () {
        const { percentageCompletion } = this.state;


        return (
            <div style={{overflowY: 'hidden'}} class="row">
                    <div style={{minHeight: '100vh'}} class="col-xl-6 col-lg-6 wizard-div-top">
                        <div style={{height: '100%'}} class="row align-items-center animate__animated animate__fadeInRight">
                            <div class="col-xl-12 col-lg-12">
                                <div class='pageTitle' style={{fontSize: '50px', margin: '15px'}}>Job post details</div>
                                <div style={{margin: '15px'}}>Add information to describe your job post more and control who is able to bid.</div>
                            </div>
                        </div>
                    </div>

                    <div style={{minHeight: '100vh'}} class="col-xl-6 col-lg-6 wizard-div">
                            <div style={{height: '100%'}} class="row align-items-center animate__animated animate__bounceInUp">
                                <div class="col-xl-11 col-lg-11  ">
                                    <div class="aesthetic-items-container">
                                        <h5 class='project-details-headers'>Give more description about this job post.</h5>
                                        <textarea onInput={this.handleToggleObjectiveInput} style={{padding: '4px', paddingLeft: '8px', 
                                            fontSize: '15px', minHeight: '70px', border:'0.5px #a1a9e4 solid', 
                                            overflow: 'auto', color: 'white', background: 'transparent'}} 
                                            class="wizard-text-area-input" placeholder="more job post description" 
                                            name="toggleObjective" defaultValue={this.state.toggleObjective}>
                                        </textarea>
                                    </div>

                                    <div class="section-headline margin-bottom-10">
                                        <h5 class='project-details-headers'>Specify visibility for this job post.</h5>
                                    </div>
                                    <label>
                                        <Switch  onChange={() => this.setState({visibility: JOB_VISIBILITY_PUBLIC})} checked={this.state.visibility === JOB_VISIBILITY_PUBLIC}/>
                                        <span class="switch-label">public</span>
                                    </label>
                                    <br/>
                                    <label>
                                        <Switch onChange={() => this.setState({visibility: JOB_VISIBILITY_PRIVATE})} checked={this.state.visibility === JOB_VISIBILITY_PRIVATE}/>
                                        <span class="switch-label">private</span>
                                    </label>

                                </div>

                                <div style={{width: '100%', padding: '2%'}}>
                                    <div class="d-flex justify-content-between">
                                         {this.state.edit ? 
                                    <>
                                        <button class="button ripple-effect gray-button "><i class="icon-material-outline-arrow-back"></i>Back</button>
                                        <button onClick={this.handleSubmitEdit} class="button ripple-effect wizard-button">Review<i class="icon-material-outline-arrow-forward"></i></button>
                                    </> : 
                                    <>
                                        <button onClick={this.handleBackButton} class="button ripple-effect wizard-button"><i class="icon-material-outline-arrow-back"></i>Back</button>
                                        <button onClick={this.handleSubmit} class="button ripple-effect wizard-button">Next<i class="icon-material-outline-arrow-forward"></i></button>
                                    </>
                                    }
                                    </div>
                                    { this.state.edit ? null :
                                <div style={{marginTop: '60px', padding: '2%'}}>
                                    <Progress percent={Math.floor(percentageCompletion)} 
                                            theme={
                                                {
                                                active: {
                                                    symbol: `${Math.floor(percentageCompletion)}%`,
                                                    trailColor: '#5869ee',
                                                    color: '#ffffff'
                                                },
                                                }
                                            }
                                        />
                                </div>
                                }
                                </div>
                            </div>
                    </div>
                </div>
        );
    }
}

export default withRouter(JobPostDetails);
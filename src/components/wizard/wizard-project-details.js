/* eslint-disable no-useless-concat */
import React, {Component} from 'react';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import './../../views/wizard.css';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from 'react-modern-calendar-datepicker';
import {withRouter} from 'react-router-dom';
import CategoriesService from './../../services/categories';
import withToastNotificationHOC from './../../HOCs/notificationHOC';

import WizardContext from './../../helpers/wizardContext';

class ProjectDetails extends Component {
    static contextType = WizardContext;

    state = {
        milestones: [{date: '', milestone: ''}], 
        budget: '',
        deliverables: { Model: false, UXPrototype: false, FunctionalPrototype: false },
        edit: false,
        optionCategories: [],
        categories: [],
    }

    componentDidMount() {
        const {wizardState} = this.context
        const edit = this.props.location && this.props.location.state ? this.props.location.state.edit : false;
        const {milestones, budget, deliverables, percentageCompletion} = wizardState;
        this.setState({milestones, budget, deliverables, edit, percentageCompletion});
        this.fetchCategories();
        
    }

    fetchCategories = async () => {
        const optionCategories = await CategoriesService.fetchCategories();
        if (optionCategories && optionCategories.data.categories) {
            this.setState({optionCategories: optionCategories.data.categories});
        }
    }

    setSelectedDay = (date, index) => {
        const {milestones} = this.state;
        const activeMilestone = milestones[index];
        milestones[index] = {date: `${date.month} / ${date.day} / ${date.year}`, milestone: activeMilestone.milestone}
        this.setState({milestones});
    }

    setMilestone = (index, e) => {
        const {milestones} = this.state;
        const activeMilestone = milestones[index]
        milestones[index] = {date: activeMilestone.date, milestone: e.target.value}
        this.setState({milestones})
    }

    setValues = (e) => {
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value });
    }

    setCheckBoxValue = (e) => {
        const name = e.target.name;
        const {deliverables} = this.state;
        deliverables[name] = !deliverables[name];
        this.setState({deliverables});
    }


    renderCustomInput = ({ ref }, index) => (
        <input
          readOnly
          ref={ref} // necessary
          placeholder="Date"
          class="wizard-text-area-input"
          value={this.state.milestones[index].date ? ` ${this.state.milestones[index].date}` : ''}
          style={{
            padding: '4px',
            paddingLeft: '8px',
            fontSize: '15px',
            height: '40px',
            width: '95%',
            border:'0.5px #a1a9e4 solid',
            marginBottom:'10px',
            color: 'white',
            background: 'transparent',
          }}
        />
      );

      handleDeleteAction = (index, array) => {
        const reducedArray = array.filter((item, i) => i !== index);
        this.setState({milestones: reducedArray})

    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {setWizardValues} = this.context;

        if (this.state.categories.length > 0) {
           setWizardValues({...this.state, percentageCompletion: 100});
            this.props.history.push('/wizard/wizard-review');

        } else {
            return this.props.addToast("Please provide at least one deliverable for your job post.", {
                appearance: 'error',
                autoDismiss: true,
            });
        }
        
    }

    handleBackButton = (e) => {
        e.preventDefault();
        const {setWizardValues} = this.context
        setWizardValues(this.state);
        this.props.history.push('/wizard/aesthetics');
    }

    handleSubmitEdit = (e) => {
        e.preventDefault();
        const {setWizardValues} = this.context
        setWizardValues(this.state);
        this.props.history.push('/wizard/wizard-review');
    }

    handleCategorySelect = (value) => {
        this.setState({categories: [value]});
    }

    render() {
        const {milestones, percentageCompletion} = this.state;

        return (
            <div style={{overflowY: 'hidden'}} class="row">
                    <div style={{minHeight: '100vh'}} class="col-xl-6 col-lg-6 wizard-div-top">
                        <div style={{height: '100%', position: 'fixed'}} class="row align-items-center animate__animated animate__fadeInRight">
                            <div class="col-xl-12 col-lg-12">
                                <div style={{fontSize: '50px', margin: '15px'}}>Project Details</div>
                                <div style={{margin: '15px'}}>List your project's milestones, if any, budget and deliverables.</div>
                            </div>
                        </div>
                    </div>

                    <div style={{paddingTop: '100px'}} class="col-xl-6 col-lg-6 wizard-div">
                            <div style={{minHeight: '100%'}} class="row animate__animated animate__bounceInUp">
                                <div class="col-xl-12 col-lg-12">
                                        <div>
                                            <div class="section-headline margin-bottom-10">
                                                <h5 class='project-details-headers'>Specify your budget for this project.</h5>
                                            </div>
                                            <input type='number' onInput={this.setValues} 
                                                style={{padding: '4px', paddingLeft: '8px', fontSize: '15px', height: '40px', width: '95%',border:'0.5px #a1a9e4 solid', marginBottom:'10px', color: 'white', background: 'transparent'}} 
                                                class="wizard-text-area-input" placeholder="Budget" name="budget" value={this.state.budget}></input>
                                        </div>
                                        <div>
                                            <div class="section-headline margin-top-35 margin-bottom-12">
                                                <h5 class='project-details-headers'>What deliverables are you looking for?</h5>
                                                {
                                                    this.state.optionCategories.map((eachOption) => {
                                                        return (
                                                            <>
                                                                {this.state.categories[0] && this.state.categories[0].id === eachOption.id ?  
                                                                    <div class="checkbox wizard-checkbox">
                                                                        <input name={`${eachOption.category}`} type="checkbox" id={`${eachOption.category}`} checked/>
                                                                        <label for={`${eachOption.category}`}><span class="checkbox-icon"></span>{`${eachOption.category}`}</label>
                                                                    </div>
                                                                
                                                                : 
                                                                <div class="checkbox wizard-checkbox">
                                                                    <input name={`${eachOption.category}`} type="checkbox" id={`${eachOption.category}`} onClick={() => this.handleCategorySelect({...eachOption, value: eachOption.category})}/>
                                                                    <label for={`${eachOption.category}`}><span class="checkbox-icon"></span>{`${eachOption.category}`}</label>
                                                                </div> }
                                                                <br/>
                                                            </>
                                                        );
                                                    })
                                                }
                                            </div>

                                        </div>
                                        <div>
                                            <div class="section-headline margin-top-35 margin-bottom-12">
                                                <h5 class='project-details-headers'>Specify any key milestone dates you wish to meet. </h5>
                                            </div>
                                            {milestones.map((eachFeature,index, array) => {
                                                return (
                                                    <div style={{width: '100%', marginBottom: '30px'}}>
                                                        <div style={{width: '95%', display: 'inline-block'}}>
                                                            <DatePicker
                                                                    inputPlaceholder="Select a day"
                                                                    renderInput={(ref) => this.renderCustomInput(ref, index)}
                                                                    shouldHighlightWeekends
                                                                    onChange={(date) => this.setSelectedDay(date, index)}
                                                                />
                                                            <textarea onInput={(e) =>this.setMilestone(index, e)} style={{padding: '4px', paddingLeft: '8px', fontSize: '15px', minHeight: '70px', border:'0.5px #a1a9e4 solid', overflow: 'auto', color: 'white', background: 'transparent'}} class="wizard-text-area-input" placeholder="User Description" name="description" value={eachFeature.milestone}></textarea>
                                                        </div>
                                                        {array.length - 1 === index ?
                                                            <div onClick={() => this.setState((prevState) =>({milestones: [...prevState.milestones, {name: '', description: ''}] }))} style={{width: '5%', display: 'inline-block',fontSize: '25px',color: 'white', cursor: 'pointer'}}><i class='icon-material-outline-add'></i></div>
                                                        :
                                                            <div onClick={() => this.handleDeleteAction(index, array)} style={{width: '2.5%', paddingLeft: '4px', color:'red', display: 'inline-block', cursor: 'pointer'}}><i class="fa fa-trash" aria-hidden="true"></i></div>
                                                        }
                                                    </div>
                                                    )
                                                })}
                                        </div>
                                    </div>

                                <div class="col-xl-12 col-lg-12">
                                    <div style={{ width: '100%', padding: '2%'}}>
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
                </div>
            );
    }
}

export default withToastNotificationHOC(withRouter(ProjectDetails));